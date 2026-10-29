# 本地开发与工程命令

## 前置依赖

推荐 Node.js 24、pnpm 12.16.1、Python 3.11+、uv、Git、微信开发者工具。Windows 建议 PowerShell，路径示例使用 `D:\Projects\Python\mahjong-skill`。

```powershell
cd D:\Projects\Python\mahjong-skill
pnpm install
uv sync --project backend --group dev
```

复制所需的 `.env.example` 为 `.env`；真实 `.env` 文件被 `.gitignore` 排除。pnpm 使用根目录锁文件；首次成功安装后运行 `git add pnpm-lock.yaml` 将其提交。

## 常用命令

| 命令 | 功能 |
| --- | --- |
| `pnpm mahjong-skill:dev` | 启动 Backend / Client H5 / Admin / Portal |
| `pnpm mahjong-skill:dev:status` | 查看端口、PID 与 Local/LAN 访问地址 |
| `pnpm mahjong-skill:dev:logs` | 查看开发日志 |
| `pnpm mahjong-skill:dev:down` | 关闭托管开发进程 |
| `pnpm mahjong-skill:dev:client` | 仅启动 Client H5 |
| `pnpm --filter @mahjong-skill/client dev:weapp` | 微信小程序监听编译 |
| `pnpm --filter @mahjong-skill/client build:h5` | Client H5 生产构建 |
| `pnpm --filter @mahjong-skill/client build:weapp` | Client 小程序构建 |
| `pnpm --filter @mahjong-skill/admin build` | Admin 构建 |
| `pnpm --filter @mahjong-skill/portal build` | Portal 构建 |
| `pnpm mahjong-skill:doctor:client:react` | 诊断 Client React 18 与 React DOM 18 |
| `pnpm mahjong-skill:analyze:client:h5` | H5 产物体积分析 |
| `pnpm mahjong-skill:package:source` | 打包全部源码到 `artifacts/` |

## H5 与小程序预览

H5 访问 `http://127.0.0.1:5174`，必须得到有效的 HTML，而不是 `dist/weapp` 的目录列表。`frontend/client/src/index.html` 是 H5 入口模板。

微信开发者工具导入 `frontend/client/`，`project.config.json` 的 `miniprogramRoot` 是 `dist/weapp/`；运行 `dev:weapp` 后确认有 `dist/weapp/app.json`。H5 与小程序分别输出到不同目录，不要用浏览器打开小程序 JS/WXML 文件。

## 常见问题

- **5174 只有目录列表**：确认 `src/index.html` 存在；检查 H5 构建产物 `dist/h5/index.html`；停止旧服务并重启。不要把 `h5.devServer.static.directory` 指到小程序产物。
- **React DOM 读取内部字段 `S` 崩溃**：Client 使用 React 18.3.1，Admin / Portal 使用 React 19。检查 `pnpm mahjong-skill:doctor:client:react`，避免将 React DOM 19 解析给 Client。
- **pnpm ERR_PNPM_IGNORED_BUILDS**：检查 `pnpm-workspace.yaml` 中逐包 `allowBuilds`，不要全局放开所有未审查的安装脚本。
- **微信缓存 `taro-loader/lib/page` 解析失败**：微信端默认禁用 Webpack 文件系统缓存；可在本机临时设置 `MJ_ENABLE_MINI_FS_CACHE=1` 测试。此问题的缓存根因未完全修复。
- **H5 资源过大**：使用 `pnpm mahjong-skill:analyze:client:h5` 生成实际体积报告，不要仅调高警告阈值。
- **Windows 启动多个 CMD 窗口**：统一脚本使用直接 Node CLI + `CREATE_NO_WINDOW`；遇异常请检查 `.mahjong-skill/logs/` 中对应服务的日志。

## 测试与 Git

```powershell
python -m unittest discover -s scripts/tests -p 'test_*.py'
pnpm mahjong-skill:test:backend
pnpm --filter @mahjong-skill/client test
pnpm --filter @mahjong-skill/admin test
pnpm --filter @mahjong-skill/portal test
```

执行 `git status --short` 检查待提交内容。**`pnpm-lock.yaml` 与 Alembic 迁移应提交；`.env`、数据库、日志和打包产物不应提交。**
