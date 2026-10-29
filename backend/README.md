# 雀变 Backend · FastAPI

统一 REST API 服务。使用 **FastAPI + SQLAlchemy + Alembic**；本地默认 SQLite，未来正式环境推荐 PostgreSQL。

## 环境和启动

在仓库根目录运行：

```bash
uv sync --project backend --group dev
pnpm mahjong-skill:dev:backend
```

Swagger：`http://127.0.0.1:8000/docs`；健康检查：`http://127.0.0.1:8000/api/v1/health`。

本地配置示例在 `backend/.env.example`。复制为 `backend/.env` 后设置 `DATABASE_URL` 与 `CORS_ORIGINS`。不要提交真实环境文件或凭据。

## 数据库与测试

```bash
pnpm mahjong-skill:db:upgrade
pnpm mahjong-skill:db:current
pnpm mahjong-skill:test:backend
pnpm mahjong-skill:check:backend
pnpm mahjong-skill:contract:export
```

- `app/api/`：HTTP 接口。
- `app/domains/`：业务领域及数据模型，目前仅有基础技能模型。
- `app/core/`：配置；`app/db/`：数据库基础设施。
- `alembic/versions/`：数据库迁移，**必须提交 Git**。
- `openapi.json`：供前端生成 API Client 的公开接口契约，**可以提交 Git**，但不得包含测试密钥或真实用户数据。

当前只是业务骨架，没有实现真实用户登录、管理员授权、房间 WebSocket 或技能规则执行，不具备生产对外开放条件。
