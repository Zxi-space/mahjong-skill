# 雀变 · Mahjong Skill

> 线下麻将「技能牌」的电子化辅助工具。提供可配置的技能卡、房间和互动界面，**不负责完整麻将牌局或规则裁判**。

**项目状态：工程底座 / Mj UI 组件验证阶段。** 用户登录、真实房间同步、技能执行及管理端权限系统尚未完成，请勿将当前 Demo 当作生产应用。

## 工程组成

| 目录 | 应用 | 技术栈 | 开发地址 |
| --- | --- | --- | --- |
| [`frontend/client`](frontend/client/README.md) | 用户端 · 微信小程序 / H5 | Taro 4.3.1、React 18、TypeScript、Taroify | `http://127.0.0.1:5174` (H5) |
| [`frontend/admin`](frontend/admin/README.md) | 管理端 | React 19、Vite 8、shadcn/ui 风格组件 | `http://127.0.0.1:5173` |
| [`frontend/portal`](frontend/portal/README.md) | 门户端 | Next.js 16、React 19 | `http://127.0.0.1:3000` |
| [`backend`](backend/README.md) | 统一后端 | FastAPI、SQLAlchemy、Alembic | `http://127.0.0.1:8000/docs` |

三个前端各自维护 `package.json`、组件和 API Client；根目录使用 pnpm Workspace 统一管理依赖，后端使用 Python/uv。**没有 `frontend/packages/` 共享 UI 包。**

## 快速开始

**环境：** Windows/macOS/Linux；Node.js 24（建议）、pnpm `12.16.1`、Python `>=3.11`、uv。依赖版本以各工程清单为准。

```bash
# 在仓库根目录执行；首次安装依赖
pnpm install
uv sync --project backend --group dev

# 诊断和启动四个服务（开发模式）
pnpm mahjong-skill:doctor
pnpm mahjong-skill:dev

# 查看状态 / 停止
pnpm mahjong-skill:dev:status
pnpm mahjong-skill:dev:down
```

> 运行 `pnpm mahjong-skill:dev` 之前，请按需复制 `backend/.env.example`、`frontend/*/.env.example` 为各自 `.env`。示例配置可跟踪，真实 `.env` 和密钥不允许提交。后端本地默认使用 SQLite。

微信小程序需另外启动监听编译：

```bash
pnpm --filter @mahjong-skill/client dev:weapp
```

打开微信开发者工具，导入 `frontend/client/`；`project.config.json` 的 `miniprogramRoot` 指向 `dist/weapp/`。正式 AppID 替换 `touristappid` 后再测试受限的平台 API。H5 则使用 `http://127.0.0.1:5174/`，不要在浏览器打开 `dist/weapp`。

## 构建与验证

```bash
python scripts/mahjong_skill.py test              # 脚本 / 后端 / 前端测试
pnpm --filter @mahjong-skill/client build:h5
pnpm --filter @mahjong-skill/client build:weapp
pnpm --filter @mahjong-skill/admin build
pnpm --filter @mahjong-skill/portal build
pnpm mahjong-skill:analyze:client:h5             # 资源体积报告
```

本地 Git 仓库初始化：`pnpm mahjong-skill:git:init`（仅初始化与检查，不会自动提交或推送）。

源码打包：`pnpm mahjong-skill:package:source`；打包结果写到 `artifacts/`（不纳入 Git）。CI 需要提交 `pnpm-lock.yaml`；若本地生成 `backend/uv.lock` 也应提交。

## 文档

- **[工程与系统文档总导航](docs/README.md)**：包含 2026-10-30 产品需求、玩法原文、三端设计系统、阶段计划、视觉参考、Token 与验收清单
- [技术架构和项目边界](docs/architecture.md)
- [开发环境、命令与故障排查](docs/development.md)
- [Git 初始化与 GitHub 推送指南](docs/github.md)
- [完整系统资料包](docs/system/README.md)（规范与计划，不代表相关功能已经落地）
- [代码贡献规范](CONTRIBUTING.md)
- [Client 跨端测试矩阵](frontend/client/COMPATIBILITY.md)

## 安全与许可

此仓库包含应用骨架与演示逻辑，尚未实现生产级登录授权、房间权限与真实支付。公开仓库前请审查环境变量、配置、历史提交以及美术资源的使用权。

**目前未指定开源许可证。** 公开 GitHub 仓库不代表他人自动获得复制、修改或再分发许可；如决定开源，请在获得权利方同意后另行增加 `LICENSE` 文件。
