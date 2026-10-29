#!/usr/bin/env python3
"""雀变 Monorepo 统一脚本。仅依赖 Python 标准库，适配 Windows/Linux。"""
from __future__ import annotations
import argparse
import ipaddress
from collections import deque
from datetime import datetime
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import time
import zipfile
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
STATE_DIR = ROOT / '.mahjong-skill'
STATE = STATE_DIR / 'runtime.json'
ARTIFACTS = ROOT / 'artifacts'
PORTS = {'backend': 8000, 'client': 5174, 'admin': 5173, 'portal': 3000}
_PROCESSES = {}  # 当前调度器内启动的子进程，用于安全等待与回收
TARGETS = {'all': ['frontend', 'backend', 'scripts', 'docs', '.github', 'README.md', 'CONTRIBUTING.md', 'package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml', '.npmrc', '.gitignore', '.gitattributes', '.editorconfig'],
           'frontend': ['frontend'], 'backend': ['backend'], 'client': ['frontend/client'],
           'admin': ['frontend/admin'], 'portal': ['frontend/portal']}
BLOCKED_DIRS = {'.git', 'node_modules', '.venv', '__pycache__', '.pytest_cache', '.ruff_cache', '.next', '.taro',
                '.mahjong-skill', '.idea', '.vscode', '.turbo', '.cache', '.swc', '.webpack', 'artifacts', 'dist', 'build', 'coverage'}
PRIVATE_SUFFIXES = {'.key', '.pem', '.p12', '.pfx', '.p8', '.keystore', '.jks', '.pyc', '.pyo', '.log', '.tsbuildinfo', '.db', '.sqlite', '.sqlite3'}
MEDIA = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.mov', '.webm', '.mp3', '.wav'}


def out(message): print('[Mahjong Skill] ' + str(message), flush=True)
def tool(name):
    found = shutil.which(name)
    if not found: raise RuntimeError(f'缺少命令 {name}，请安装后检查 PATH')
    return found

def run(args, *, env=None):
    out('RUN ' + ' '.join(args))
    return subprocess.run(args, cwd=ROOT, env=env, check=False).returncode

def env_backend():
    e = os.environ.copy()
    e['PYTHONPATH'] = str(ROOT / 'backend') + os.pathsep + e.get('PYTHONPATH', '')
    return e

def uv(*args): return [tool('uv'), 'run', '--project', 'backend', *args]
def pnpm(name, cmd): return [tool('pnpm'), '--filter', f'@mahjong-skill/{name}', cmd]


def js_package_bin(project, package, bin_name):
    """从已安装依赖的 package.json 读取真实 Node CLI 入口，不经过 pnpm.cmd/cmd.exe。"""
    manifest = project / 'node_modules' / package / 'package.json'
    if not manifest.is_file():
        raise RuntimeError(f'缺少 {manifest.relative_to(ROOT) if manifest.is_relative_to(ROOT) else manifest}；请在根目录执行 pnpm install')
    try:
        info = json.loads(manifest.read_text(encoding='utf-8'))
        entry = info.get('bin')
        if isinstance(entry, dict):
            entry = entry.get(bin_name)
        if not isinstance(entry, str) or not entry:
            raise ValueError(f'{package} 未声明 {bin_name} 可执行入口')
        script = (manifest.parent / entry).resolve()
        if not script.is_file():
            raise ValueError(f'{package} CLI 不存在: {script}')
        return script
    except (OSError, ValueError) as exc:
        raise RuntimeError(f'无法解析 {package} 的 Node CLI: {exc}') from exc


def windowless_creationflags(is_windows=None):
    """Windows: 不创建额外窗口，仍允许 taskkill /T 终止进程树。"""
    if is_windows is None:
        is_windows = os.name == 'nt'
    if not is_windows:
        return 0
    # 不使用 DETACHED_PROCESS；在 Windows 中它与 .cmd 包装器组合可能导致异常或新窗口。
    return getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000) | getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0x00000200)

def load_state():
    if STATE.exists():
        try: return json.loads(STATE.read_text('utf-8'))
        except (ValueError, OSError): return {}
    return {}

def save_state(data):
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = STATE.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', 'utf-8')
    tmp.replace(STATE)

SERVICE_LABELS = {
    'backend': 'Backend API',
    'client': 'Client H5',
    'admin': 'Admin Vite',
    'portal': 'Portal Next',
}
READY_PATHS = {
    'backend': '/api/v1/health',
    'client': '/',
    'admin': '/',
    'portal': '/',
}


def alive(pid):
    """检查 PID 是否存活，Windows 不使用 os.kill(pid, 0) 以免误终止进程。"""
    if not isinstance(pid, int) or pid <= 0:
        return False
    if os.name == 'nt':
        from ctypes import WinDLL
        from ctypes import wintypes
        kernel = WinDLL('kernel32', use_last_error=True)
        kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        kernel.OpenProcess.restype = wintypes.HANDLE
        kernel.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        kernel.WaitForSingleObject.restype = wintypes.DWORD
        kernel.CloseHandle.argtypes = [wintypes.HANDLE]
        kernel.CloseHandle.restype = wintypes.BOOL
        handle = kernel.OpenProcess(0x00100000, False, pid)  # SYNCHRONIZE
        if not handle:
            return False
        try:
            return kernel.WaitForSingleObject(handle, 0) == 0x102  # WAIT_TIMEOUT
        finally:
            kernel.CloseHandle(handle)
    try:
        os.kill(pid, 0)
    except (OSError, OverflowError):
        return False
    # Linux 的僵尸进程仍会响应 kill(pid,0)，但不应被视为正在运行。
    stat = Path(f'/proc/{pid}/stat')
    if stat.exists():
        try:
            if stat.read_text().split(') ', 1)[1][0] == 'Z':
                return False
        except (OSError, IndexError):
            pass
    return True


def listening(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=.3):
            return True
    except OSError:
        return False


def is_client_h5_html(content_type: str, html: str) -> bool:
    """验证 H5 真实入口，杜绝把 Webpack 目录列表当作客户端 READY。"""
    if 'text/html' not in content_type.lower():
        return False
    markup = html.lower()
    if not ('<html' in markup or '<!doctype html' in markup):
        return False
    # 小程序编译产物列表虽返回 200 + text/html，却不是可运行的 H5 页面。
    if any(marker in markup for marker in ('app.wxss', 'base.wxml', 'directory listing for', 'index of /', 'serve-index')):
        return False
    return '<script' in markup and ('id="app"' in markup or "id='app'" in markup or 'src=' in markup)


def ready(name):
    """不能将端口开放等同于 HTTP 服务可用；Client 必须返回 H5 HTML。"""
    try:
        url = f'http://127.0.0.1:{PORTS[name]}{READY_PATHS[name]}'
        with urlopen(url, timeout=.9) as response:
            if not 200 <= response.status < 400:
                return False
            if name == 'backend':
                content = json.loads(response.read().decode('utf-8'))
                return content.get('code') == 'OK' and content.get('data', {}).get('status') == 'ok'
            if name == 'client':
                return is_client_h5_html(response.headers.get('Content-Type', ''), response.read(65536).decode('utf-8', 'replace'))
            return True
    except (OSError, TimeoutError, ValueError, KeyError):
        return False


def service_command(name):
    if name == 'backend':
        return uv('uvicorn', 'app.main:app', '--app-dir', 'backend', '--reload', '--reload-dir', 'backend', '--host', '0.0.0.0', '--port', str(PORTS[name]))
    project = ROOT / 'frontend' / name
    # Windows 中 pnpm.cmd 会经过 cmd.exe；直接调用 Node CLI，避免额外控制台。
    packages = {
        'client': ('@tarojs/cli', 'taro', ['build', '--type', 'h5', '--watch']),
        'admin': ('vite', 'vite', ['--host', '0.0.0.0', '--port', str(PORTS[name]), '--strictPort']),
        'portal': ('next', 'next', ['dev', '--hostname', '0.0.0.0', '--port', str(PORTS[name])]),
    }
    package, executable, args = packages[name]
    return [tool('node'), str(js_package_bin(project, package, executable)), *args]


def inspect_service(name, state):
    record = state.get(name, {})
    pid = record.get('pid')
    if alive(pid):
        return 'READY' if ready(name) else 'STARTING'
    return 'EXTERNAL' if listening(PORTS[name]) else 'STOPPED'


def lan_ips():
    """仅列出常见私有 IPv4；忽略回环、测试网段及虚拟代理 198.18/15。"""
    candidates = set()
    try:
        for item in socket.getaddrinfo(socket.gethostname(), None, family=socket.AF_INET):
            candidates.add(item[4][0])
    except OSError:
        pass
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(('192.0.2.1', 9))  # 仅选择本机路由接口，不发送数据
            candidates.add(sock.getsockname()[0])
    except OSError:
        pass
    networks = (ipaddress.ip_network('10.0.0.0/8'), ipaddress.ip_network('172.16.0.0/12'),
                ipaddress.ip_network('192.168.0.0/16'))
    values = []
    for raw in candidates:
        try:
            ip = ipaddress.ip_address(raw)
            if any(ip in network for network in networks):
                values.append(raw)
        except ValueError:
            pass
    def weight(item):
        ip = ipaddress.ip_address(item)
        return (0 if ip in networks[2] else 1 if ip in networks[0] else 2, int(ip))
    return sorted(set(values), key=weight)[:3]


def _table(headers, rows):
    widths = [max(len(str(headers[i])), *(len(str(row[i])) for row in rows)) for i in range(len(headers))]
    print('  '.join(str(item).ljust(widths[i]) for i, item in enumerate(headers)))
    print('  '.join('-' * w for w in widths))
    for row in rows:
        print('  '.join(str(item).ljust(widths[i]) for i, item in enumerate(row)))


def print_service_report(state=None):
    if state is None:
        state = load_state()
    print('\nServices\n')
    rows = []
    statuses = {}
    for name in PORTS:
        record = state.get(name, {})
        status = inspect_service(name, state)
        statuses[name] = status
        rows.append((SERVICE_LABELS[name], f'0.0.0.0:{PORTS[name]}',
                     'True' if status == 'READY' else 'False', str(record.get('pid') or '-'), status))
    _table(('Service', 'Endpoint', 'Running', 'PID', 'Status'), rows)
    print('\nAccess URLs\n')
    routes = [('Backend API', 'backend', ''), ('Swagger', 'backend', '/docs'),
              ('ReDoc', 'backend', '/redoc'), ('OpenAPI JSON', 'backend', '/openapi.json'),
              ('Backend Health', 'backend', READY_PATHS['backend']),
              ('Client H5', 'client', ''), ('Admin', 'admin', ''), ('Portal', 'portal', '')]
    rows = []
    for label, name, route in routes:
        url = f'http://127.0.0.1:{PORTS[name]}{route}'
        rows.append(('Local', label, url, statuses[name]))
    for ip in lan_ips():
        for label, name, route in routes:
            rows.append(('LAN', label, f'http://{ip}:{PORTS[name]}{route}', statuses[name]))
    _table(('Scope', 'Service', 'URL', 'Status'), rows)
    if not lan_ips():
        print('\nLAN: 未检测到可用的私有网卡 IP。')
    print('\n提示：LAN 访问需要服务监听 0.0.0.0、操作系统防火墙放行；浏览器 API 跨域还需配置 CORS。')
    return statuses


def log_tail(name, lines=16):
    """仅显示最近一次 START 之后的日志，避免把旧的 ^C 当作本次失败原因。"""
    log = STATE_DIR / 'logs' / f'{name}.log'
    if not log.is_file():
        return '(无日志文件)'
    with log.open(encoding='utf-8', errors='replace') as reader:
        content = list(deque(reader, maxlen=max(200, lines + 1)))
    latest_start = next((i for i in range(len(content) - 1, -1, -1)
                         if content[i].startswith('--- START ')), None)
    if latest_start is not None:
        content = content[latest_start + 1:]
    return ''.join(content[-lines:]).strip() or '(本次启动尚无日志输出；请检查进程及 Taro CLI 环境)'


def dev_start(names, wait_seconds=120):
    state = load_state()
    (STATE_DIR / 'logs').mkdir(parents=True, exist_ok=True)
    label = 'All' if len(names) == len(PORTS) else ('Frontend' if len(names) == 3 else SERVICE_LABELS[names[0]])
    print(f'\n[Mahjong Skill] Dev / {label}\n', flush=True)
    blocked = []
    for name in names:
        print(f'\n[Mahjong Skill] Dev / {SERVICE_LABELS[name]}', flush=True)
        existing = state.get(name, {}).get('pid')
        if alive(existing):
            out(f'[EXISTS] {name}: pid={existing}')
            continue
        if listening(PORTS[name]):
            out(f'[PORT BUSY] {name}: port={PORTS[name]} 被非托管进程占用；拒绝接管')
            blocked.append(name)
            state.pop(name, None)
            continue
        try:
            cmd = service_command(name)
        except (OSError, RuntimeError, ValueError) as exc:
            out(f'[FAILED] {name}: {exc}')
            blocked.append(name)
            state.pop(name, None)
            continue
        log_path = STATE_DIR / 'logs' / f'{name}.log'
        try:
            with log_path.open('ab') as log:
                log.write(f'\n--- START {datetime.now().isoformat()} ---\n'.encode())
                log.flush()
                # node.exe/uv.exe 直接执行；Windows CREATE_NO_WINDOW 避免弹出 cmd 窗口。
                process_env = env_backend() if name == 'backend' else os.environ.copy()
                process_env['NO_COLOR'] = '1'
                if name == 'client':
                    # 子进程明确锁定 H5 编译目标，避免继承终端中残留的 TARO_ENV=weapp。
                    process_env['TARO_ENV'] = 'h5'
                proc = subprocess.Popen(cmd, cwd=ROOT if name == 'backend' else ROOT / 'frontend' / name,
                                        stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT,
                                        start_new_session=os.name != 'nt', creationflags=windowless_creationflags(),
                                        env=process_env)
        except OSError as exc:
            out(f'[FAILED] {name}: 无法创建进程: {exc}')
            blocked.append(name)
            state.pop(name, None)
            continue
        _PROCESSES[name] = proc
        state[name] = {'pid': proc.pid, 'log': str(log_path.relative_to(ROOT)) if log_path.is_relative_to(ROOT) else str(log_path),
                       'command': cmd,
                       'started_at': datetime.now().isoformat()}
        save_state(state)
        print(f'[STARTED] {name}: pid={proc.pid}', flush=True)
        print(f'          command={subprocess.list2cmdline(cmd)}', flush=True)
        print(f'          log={log_path.resolve()}', flush=True)
    save_state(state)
    pending = set(names) - set(blocked)
    deadline = time.monotonic() + max(1, wait_seconds)
    while pending and time.monotonic() < deadline:
        for name in list(pending):
            status = inspect_service(name, state)
            if status == 'READY':
                print(f'[READY]   {name}: http://127.0.0.1:{PORTS[name]}', flush=True)
                pending.remove(name)
            elif status in ('STOPPED', 'EXTERNAL'):
                pending.remove(name)
        if pending:
            time.sleep(.6)
    statuses = print_service_report(state)
    failed = [name for name in names if statuses[name] != 'READY']
    for name in failed:
        out(f'[NOT READY] {name}: {statuses[name]} (端口 {PORTS[name]})')
        if name == 'client' and listening(PORTS[name]):
            out('5174 端口已打开，但根路径不是有效的 H5 页面；请检查 dist/h5/index.html，而不是 dist/weapp。')
        print(f'\n--- {name} last log lines ---\n{log_tail(name)}\n', flush=True)
    if failed:
        out(f'启动验收未通过 {len(failed)}/{len(names)}；查看详细日志: pnpm mahjong-skill:dev:logs')
        return 1
    out(f'全部 {len(names)} 个目标服务已通过 HTTP 就绪检查')
    return 0


def dev_down():
    state = load_state()
    for name, record in list(state.items()):
        pid = record.get('pid')
        if alive(pid):
            if os.name == 'nt':
                subprocess.run(['taskkill', '/T', '/F', '/PID', str(pid)], capture_output=True, check=False,
                               creationflags=windowless_creationflags())
            else:
                try:
                    os.killpg(pid, signal.SIGTERM)
                except (ProcessLookupError, PermissionError):
                    pass
            out(f'STOP {name} PID={pid}')
        state.pop(name, None)
    save_state(state)
    for name, proc in list(_PROCESSES.items()):
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            pass
        _PROCESSES.pop(name, None)
    deadline = time.monotonic() + 6
    while time.monotonic() < deadline and any(listening(port) for port in PORTS.values()):
        time.sleep(.2)
    return 0


def dev_status():
    print_service_report()
    return 0

def doctor_tools():
    failed = False
    for name in ('node', 'pnpm', 'uv', 'git'):
        value = shutil.which(name)
        out(f'{name:<8} {value or "NOT FOUND"}')
        if name != 'git' and not value: failed = True
    out(f'python   {sys.version.split()[0]}')
    return 2 if failed or sys.version_info < (3, 11) else 0

def doctor_ports():
    for name, port in PORTS.items(): out(f'{name:<8} {port}: {"LISTEN" if listening(port) else "FREE"}')
    return 0

def doctor_services():
    dev_status()
    try:
        from urllib.request import urlopen
        with urlopen('http://127.0.0.1:8000/api/v1/health', timeout=1) as reply: out(f'backend health: HTTP {reply.status}')
    except Exception: out('backend health: 未启动或不可访问')
    return 0

def architecture_scan():
    missing = []
    for name in ('client', 'admin', 'portal'):
        file = ROOT / 'frontend' / name / 'package.json'
        if not file.exists(): missing.append(str(file)); continue
        data = json.loads(file.read_text('utf-8'))
        out(f'frontend/{name}: {data["name"]} ({len(data.get("scripts", {}))} scripts)')
    for path in ('backend/app/main.py','backend/pyproject.toml','pnpm-workspace.yaml'):
        if not (ROOT / path).exists(): missing.append(path)
    if (ROOT / 'frontend/packages').exists(): missing.append('禁止在初始化阶段创建 frontend/packages')
    if missing:
        for path in missing: out('ERROR ' + path)
        return 1
    out('ARCHITECTURE OK: 三个前端独立 Package + 统一后端')
    return 0

def contract(check):
    script = ('import json; from pathlib import Path; from app.main import app;'
              'p=Path("backend/openapi.json");'
              'content=json.dumps(app.openapi(),ensure_ascii=False,indent=2,sort_keys=True)+"\\n";'
              'old=p.read_text(encoding="utf-8") if p.exists() else None;'
              'print("UP-TO-DATE" if old==content else "OUT-OF-DATE");'
              + ('raise SystemExit(0 if old==content else 1)' if check else 'p.write_text(content,encoding="utf-8")'))
    return run(uv('python', '-c', script), env=env_backend())

def frontend(action):
    for name in ('client', 'admin', 'portal'):
        task = 'build:h5' if name == 'client' and action == 'build' else ('typecheck' if action == 'check' else action)
        code = run(pnpm(name, task))
        if code: return code
    return 0

def backend(action):
    arguments = ('python', '-m', 'pytest', 'backend/tests') if action == 'test' else ('ruff', 'check', 'backend/app', 'backend/tests')
    return run(uv(*arguments), env=env_backend())

def db(action, extra):
    if action == 'db:reset:preflight':
        out('仅检查，不删除数据库。请确认 DATABASE_URL 指向期望的数据库。')
        return 0 if (ROOT / 'backend/alembic/versions').is_dir() else 1
    name = action.split(':')[1]
    if name == 'downgrade' and not extra: out('ERROR 指定回滚目标，例如 db:downgrade -1'); return 2
    if name == 'revision' and not extra: out('ERROR 指定 --message，例如 db:revision --message add_room'); return 2
    if name == 'upgrade' and not extra: extra = ['head']
    return run(uv('alembic', '-c', 'backend/alembic.ini', name, *extra), env=env_backend())

def safe_file(path, slim=False):
    if any(part in BLOCKED_DIRS for part in path.parts): return False
    if path.name == '.env' or (path.name.startswith('.env.') and not path.name.endswith('.example')): return False
    if path.name in {'id_rsa','id_ed25519','credentials.json','project.private.config.json','project.config.local.json'} or path.name.startswith(('.secret', 'service-account')): return False
    if path.suffix.lower() in PRIVATE_SUFFIXES: return False
    if slim and path.suffix.lower() in MEDIA: return False
    return True

def source_package(target='all', slim=False):
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    output = ARTIFACTS / f'mahjong-skill-source-{target}-{datetime.now().strftime("%Y%m%d-%H%M%S")}.zip'
    files = set()
    for item in TARGETS[target]:
        path = ROOT / item
        if not path.exists(): continue
        for file in path.rglob('*') if path.is_dir() else [path]:
            if file.is_file():
                rel = file.relative_to(ROOT)
                if safe_file(rel, slim): files.add(rel)
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for rel in sorted(files): archive.write(ROOT / rel, str(Path('mahjong-skill') / rel))
    out(f'SOURCE {output} | {len(files)} files | {output.stat().st_size:,} bytes')
    return output

def ai_context():
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    dst = ARTIFACTS / 'mahjong-skill-ai-context.md'
    files = [p.relative_to(ROOT) for p in ROOT.rglob('*') if p.is_file() and safe_file(p.relative_to(ROOT))]
    body = ['# Mahjong Skill AI Context', '', '三端独立 Package：frontend/client(Taro)、admin(Vite)、portal(Next)；backend(FastAPI)。',
            '不允许跨前端直接引用业务组件。', '', '## 文件索引'] + [f'- `{f.as_posix()}`' for f in sorted(files)]
    dst.write_text('\n'.join(body)+'\n', 'utf-8')
    out(f'AI CONTEXT {dst}')
    return 0

def release_package():
    if frontend('build'): return 1
    # 发布包同时包含 H5 与小程序产物；常规 build 命令只构建 Client H5。
    if run(pnpm('client', 'build:weapp')): return 1
    # Next.js SSR is not deployable as arbitrary static files. Package build outputs for inspection.
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    dest = ARTIFACTS / f'mahjong-skill-release-{datetime.now().strftime("%Y%m%d-%H%M%S")}.zip'
    paths = ['frontend/client/dist/h5','frontend/client/dist/weapp','frontend/admin/dist','frontend/portal/.next','frontend/portal/package.json','frontend/portal/next.config.ts','backend','scripts']
    for p in paths:
        if not (ROOT/p).exists(): out(f'ERROR 缺少构建结果 {p}'); return 1
    with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        for relative in paths:
            base = ROOT / relative
            for f in base.rglob('*') if base.is_dir() else [base]:
                if not f.is_file(): continue
                rel = f.relative_to(ROOT)
                if f.name == '.env' or f.suffix.lower() in PRIVATE_SUFFIXES or 'node_modules' in rel.parts or '__pycache__' in rel.parts: continue
                z.write(f, str(Path('mahjong-skill')/rel))
    out(f'RELEASE {dest} (Next.js 仍需 Node.js 运行依赖与启动配置)')
    return 0

def check_scripts(): return run([sys.executable,'-m','unittest','discover','-s','scripts/tests'])

def main():
    parser = argparse.ArgumentParser(description='Mahjong Skill Project CLI')
    parser.add_argument('action')
    parser.add_argument('extra', nargs='*')
    parser.add_argument('--target', choices=list(TARGETS), default='all')
    parser.add_argument('--slim-images', action='store_true')
    parser.add_argument('--lines', type=int, default=60)
    parser.add_argument('--wait', type=int, default=120, help='启动 HTTP 就绪检查最大等待秒数（冷启动 Taro 可能较慢）')
    parser.add_argument('--message', default=None)
    a = parser.parse_args(); command=a.action
    extra = (['--message', a.message] if a.message else []) + a.extra
    if command == 'setup':
        rc = run([tool('pnpm'), 'install'])
        return rc or run(uv('python','-c','import fastapi, alembic, sqlalchemy'))
    if command == 'doctor': return max(doctor_tools(),doctor_ports(),doctor_services(),architecture_scan())
    if command == 'doctor:tools': return doctor_tools()
    if command == 'doctor:ports': return doctor_ports()
    if command == 'doctor:services': return doctor_services()
    if command == 'architecture:scan': return architecture_scan()
    if command in ('doctor:contracts','contract:check','contract:verify'): return contract(True)
    if command == 'contract:export': return contract(False)
    if command == 'contract:generate':
        if contract(True): out('ERROR 请先导出并提交 OpenAPI'); return 1
        return run([tool('pnpm'),'--filter','@mahjong-skill/admin','exec','orval','--config','orval.config.ts'])
    if command.startswith('db:'): return db(command, extra)
    if command == 'dev': return dev_start(['backend','client','admin','portal'], a.wait)
    if command == 'dev:frontend': return dev_start(['client','admin','portal'], a.wait)
    if command in ('dev:client','dev:admin','dev:portal','dev:backend'): return dev_start([command.split(':')[1]], a.wait)
    if command == 'dev:down': return dev_down()
    if command == 'dev:restart':
        dev_down(); return dev_start(list(PORTS), a.wait)
    if command == 'dev:status': return dev_status()
    if command == 'dev:logs':
        for name in PORTS:
            if a.target not in ('all',name): continue
            log = STATE_DIR/'logs'/f'{name}.log'
            out('--- '+name+' ---')
            if log.exists():
                with log.open(encoding='utf-8',errors='replace') as f:
                    for line in deque(f,maxlen=max(1,min(1000,a.lines))): print(line,end='')
        return 0
    if command in ('check:scripts','test:scripts'): return check_scripts()
    if command == 'check:backend': return backend('check')
    if command == 'test:backend': return backend('test')
    if command == 'check:frontend': return frontend('check')
    if command == 'test:frontend': return frontend('test')
    if command == 'check': return check_scripts() or backend('check') or frontend('check')
    if command == 'test': return check_scripts() or backend('test') or frontend('test')
    if command == 'build': return frontend('build')
    if command == 'package:source': source_package(a.target,a.slim_images); return 0
    if command == 'package:ai-context': return ai_context()
    if command in ('release','package:release'): return release_package()
    if command == 'clean':
        if any(alive(v.get('pid')) for v in load_state().values()): out('ERROR 请先 dev:down'); return 2
        for folder in ('frontend/admin/dist','frontend/client/dist','frontend/portal/.next'):
            path=ROOT/folder
            if path.exists(): shutil.rmtree(path); out('CLEAN '+folder)
        return 0
    out('ERROR 未知命令 '+command)
    return 2

if __name__ == '__main__':
    try: sys.exit(main())
    except (RuntimeError, OSError, ValueError) as e: out('ERROR '+str(e)); sys.exit(2)
