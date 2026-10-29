# 雀变 Admin · 运营管理端

技术栈：**React 19 + Vite 8 + TypeScript + Tailwind CSS 4 + TanStack Query + Zustand**，基于 shadcn/ui 设计思路维护本地 Web 组件。

## 本地运行

在仓库根目录执行：

```bash
pnpm --filter @mahjong-skill/admin dev
pnpm --filter @mahjong-skill/admin build
pnpm --filter @mahjong-skill/admin test
```

本地访问：`http://127.0.0.1:5173/`。环境变量示例：`.env.example`，其中 `VITE_API_BASE_URL` 指向统一 FastAPI 服务。

## 目录

- `src/features/`：业务功能模块（当前为 Dashboard 演示）。
- `src/components/`：仅属于 Admin 的组件，不跨前端项目引用。
- `src/api/`：Admin 请求层；`orval.config.ts` 基于 `backend/openapi.json`。
- `src/styles/`：后台视觉 Token 与样式。

> **尚未实现生产级 RBAC、管理员会话和真实 CRUD。** 接入公网前必须先完成认证授权和 API 层权限校验，不能仅依赖前端菜单隐藏。
