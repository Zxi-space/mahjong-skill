# 工程架构与代码边界

## Monorepo

```text
mahjong-skill/
├── frontend/
│   ├── client/      # Taro 4.3.1 / React 18，小程序及 H5
│   ├── admin/       # React 19 / Vite 8，后台管理
│   └── portal/      # React 19 / Next.js 16，门户 SEO / 展示
├── backend/         # FastAPI / SQLAlchemy / Alembic
├── scripts/         # Python 统一工程命令
├── docs/            # 项目文档
└── .github/         # PR 模板、CI
```

- 三个前端是各自独立的 Workspace Package，依赖和编译目标互不耦合。
- **不建立 `frontend/packages`，不跨前端引用组件源码。** 各端都通过后端的 OpenAPI 契约交互。
- 管理端和门户端使用 DOM Web 组件，不能直接移植到 Taro 微信小程序。
- 用户端的微信登录、分享、扫码等能力应通过 `src/platform/` 隔离；跨端功能需要平台实测。
- 后端初期保持模块化单体。未来房间与技能操作以服务端为准，并建立授权、幂等、操作日志与 WebSocket 重连。

## 开发与发布边界

| 服务 | 本地端口 | 构建 / 发布 |
| --- | ---: | --- |
| Client H5 | 5174 | `dist/h5/` 静态资源 |
| Client 微信小程序 | 无 HTTP 端口 | `dist/weapp/`，微信开发者工具上传 |
| Admin | 5173 | Vite `dist/` 静态资源 |
| Portal | 3000 | Next.js Server / 按需静态导出 |
| Backend | 8000 | FastAPI 进程，通过反代和 HTTPS 对外 |

目前前端业务页面为演示实现。上线前必须单独验收真实鉴权、敏感数据保护、WebSocket 权限、跨端 UI 和运行性能。
