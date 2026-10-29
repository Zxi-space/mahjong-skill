"""本地独立 HTTP 服务器用于测试启动器状态检测，不依赖 pnpm/npm。"""
import importlib.util
import io
import json
import shutil
from contextlib import redirect_stdout
from pathlib import Path
import socket
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'mahjong_skill.py'
spec = importlib.util.spec_from_file_location('mahjong_skill_runtime', SCRIPT)
cli = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cli)


def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


class RuntimeTests(unittest.TestCase):
    def test_http_ready_requires_correct_backend_payload(self):
        from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
        import threading
        class H(BaseHTTPRequestHandler):
            def do_GET(self):
                payload = json.dumps({'code':'OK','data': {'status':'ok'}}).encode()
                self.send_response(200)
                self.send_header('Content-Length',str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            def log_message(self, *args):
                pass
        server = ThreadingHTTPServer(('127.0.0.1', 0), H)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with patch.dict(cli.PORTS, backend=server.server_port):
                self.assertTrue(cli.ready('backend'))
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)

    def test_all_services_live_start_status_stop(self):
        ports = {name: free_port() for name in cli.PORTS}
        service = ('from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler\n'
                   'import json,sys\n'
                   'class H(BaseHTTPRequestHandler):\n'
                   ' def do_GET(self):\n'
                   '  body=(json.dumps({"code":"OK","data":{"status":"ok"}}) if self.path=="/api/v1/health" else "<!doctype html><html><body><div id=app></div><script src=/js/app.js></script></body></html>").encode()\n'
                   '  self.send_response(200)\n'
                   '  self.send_header("Content-Type","application/json" if self.path=="/api/v1/health" else "text/html; charset=utf-8")\n'
                   '  self.send_header("Content-Length",str(len(body)))\n'
                   '  self.end_headers()\n'
                   '  self.wfile.write(body)\n'
                   ' def log_message(self,*a):pass\n'
                   'ThreadingHTTPServer(("127.0.0.1",int(sys.argv[1])),H).serve_forever()\n')
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            with patch.object(cli, 'STATE_DIR', root), patch.object(cli, 'STATE', root/'runtime.json'), \
                 patch.object(cli, 'PORTS', ports), patch.object(cli, 'lan_ips', return_value=[]), \
                 patch.object(cli, 'service_command', side_effect=lambda name: [sys.executable, '-u', '-c', service, str(ports[name])]):
                try:
                    output = io.StringIO()
                    with redirect_stdout(output):
                        result = cli.dev_start(list(ports), 8)
                    self.assertEqual(result, 0, output.getvalue())
                    self.assertIn('Access URLs', output.getvalue())
                    self.assertIn('Backend Health', output.getvalue())
                    self.assertEqual(set(cli.load_state()), set(ports))
                    with redirect_stdout(io.StringIO()):
                        statuses = cli.print_service_report()
                    self.assertTrue(all(x == 'READY' for x in statuses.values()))
                finally:
                    with redirect_stdout(io.StringIO()):
                        cli.dev_down()
                self.assertEqual(cli.load_state(), {})


    def test_client_h5_validation_rejects_weapp_directory_listing(self):
        listing = '<!doctype html><html><body><h1>~/</h1><a href="app.wxss">app.wxss</a><script src="/index.js"></script></body></html>'
        self.assertFalse(cli.is_client_h5_html('text/html', listing))
        self.assertFalse(cli.is_client_h5_html('application/json', '<html><script src="/app.js"></script></html>'))
        self.assertTrue(cli.is_client_h5_html('text/html; charset=utf-8', '<!doctype html><html><body><div id="app"></div><script defer src="/js/app.js"></script></body></html>'))

    def test_client_ready_rejects_live_weapp_directory_listing(self):
        from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
        import threading
        class H(BaseHTTPRequestHandler):
            def do_GET(self):
                body = b'<html><body><a href="app.wxss">app.wxss</a><script src="x"></script></body></html>'
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(body)
            def log_message(self, *args):
                pass
        server = ThreadingHTTPServer(('127.0.0.1', 0), H)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with patch.dict(cli.PORTS, client=server.server_port):
                self.assertFalse(cli.ready('client'))
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)

    def test_log_tail_hides_previous_attempt(self):
        with tempfile.TemporaryDirectory() as tmp:
            state = Path(tmp)
            (state / 'logs').mkdir()
            (state / 'logs/client.log').write_text(
                '--- START 2026-10-29T13:52:36 ---\n' +
                '^C\n[ELIFECYCLE] old crash\n' +
                '--- START 2026-10-29T14:06:38 ---\n', 'utf-8')
            with patch.object(cli, 'STATE_DIR', state):
                self.assertIn('本次启动尚无日志输出', cli.log_tail('client'))
                self.assertNotIn('old crash', cli.log_tail('client'))

    def test_windowless_windows_flags(self):
        flags = cli.windowless_creationflags(True)
        self.assertTrue(flags & 0x08000000, 'Windows 子进程需要 CREATE_NO_WINDOW')
        self.assertTrue(flags & 0x00000200, 'Windows 子进程需要独立进程组')
        self.assertFalse(flags & 0x00000008, '不使用 DETACHED_PROCESS')
        self.assertEqual(cli.windowless_creationflags(False), 0)

    def test_direct_node_package_bin_resolution(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            pkg = project / 'node_modules' / '@tarojs' / 'cli'
            (pkg / 'bin').mkdir(parents=True)
            (pkg / 'package.json').write_text(json.dumps({'bin': {'taro': './bin/taro.js'}}), 'utf-8')
            (pkg / 'bin' / 'taro.js').write_text('console.log("ok")', 'utf-8')
            self.assertEqual(cli.js_package_bin(project, '@tarojs/cli', 'taro'), (pkg / 'bin' / 'taro.js').resolve())
            with self.assertRaisesRegex(RuntimeError, '无法解析'):
                cli.js_package_bin(project, '@tarojs/cli', 'vite')

    @unittest.skipUnless(shutil.which('node'), '测试需要 Node.js')
    def test_client_launches_node_directly_without_pnpm_wrapper(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = root / 'frontend' / 'client'
            pkg = project / 'node_modules' / '@tarojs' / 'cli'
            (pkg / 'bin').mkdir(parents=True)
            port = free_port()
            (pkg / 'package.json').write_text(json.dumps({'bin': {'taro': './bin/taro.js'}}), 'utf-8')
            (pkg / 'bin' / 'taro.js').write_text(
                'const http=require("http");' +
                'http.createServer((req,res)=>{res.writeHead(200,{"Content-Type":"text/html"});res.end(`<!doctype html><html><body><div id="app"></div><script src="/app.js"></script></body></html>`)})' +
                f'.listen({port},"127.0.0.1");' +
                'console.log("mock taro ready");', 'utf-8')
            with patch.object(cli, 'ROOT', root), patch.object(cli, 'STATE_DIR', root/'.mahjong-skill'), \
                 patch.object(cli, 'STATE', root/'.mahjong-skill/runtime.json'), \
                 patch.dict(cli.PORTS, client=port), patch.object(cli, 'lan_ips', return_value=[]):
                cmd = cli.service_command('client')
                self.assertEqual(Path(cmd[0]).name, Path(shutil.which('node')).name)
                self.assertEqual(cmd[2:], ['build', '--type', 'h5', '--watch'])
                self.assertNotIn('pnpm', ' '.join(cmd).lower())
                try:
                    output = io.StringIO()
                    with redirect_stdout(output):
                        result = cli.dev_start(['client'], 8)
                    self.assertEqual(result, 0, output.getvalue())
                    self.assertIn('READY', output.getvalue())
                    self.assertIn('mock taro ready', cli.log_tail('client'))
                finally:
                    with redirect_stdout(io.StringIO()):
                        cli.dev_down()

    def test_unhealthy_service_does_not_report_success(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            port = free_port()
            with patch.object(cli,'STATE_DIR',root), patch.object(cli,'STATE',root/'runtime.json'), \
                 patch.dict(cli.PORTS, backend=port), patch.object(cli,'lan_ips',return_value=[]), \
                 patch.object(cli,'service_command',return_value=[sys.executable, '-c', 'import time; time.sleep(5)']):
                try:
                    output = io.StringIO()
                    with redirect_stdout(output):
                        code = cli.dev_start(['backend'],1)
                    self.assertEqual(code,1)
                    self.assertIn('NOT READY',output.getvalue())
                    self.assertIn('STARTING',output.getvalue())
                    self.assertNotIn('全部 1 个目标服务已通过',output.getvalue())
                finally:
                    with redirect_stdout(io.StringIO()):
                        cli.dev_down()


if __name__ == '__main__':
    unittest.main()
