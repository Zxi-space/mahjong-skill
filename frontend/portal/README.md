# 雀变 Portal · 品牌门户

技术栈：**Next.js 16 + React 19 + TypeScript + App Router + Tailwind CSS 4**。

## 本地运行

在仓库根目录执行：

```bash
pnpm --filter @mahjong-skill/portal dev
pnpm --filter @mahjong-skill/portal build
pnpm --filter @mahjong-skill/portal start
```

开发地址：`http://127.0.0.1:3000/`。环境文件：`.env.example`。`NEXT_PUBLIC_` 变量会进入浏览器构建产物，**不能保存密钥**。

- `src/app/`：Next.js App Router 页面与布局。
- `src/components/`：Portal 自有 Web 组件。
- `src/styles/`：门户品牌样式。

目前只有品牌首页展示骨架；未来面向公开网页的玩法介绍、技能图鉴、公告等内容可以由 Admin 管理并通过 FastAPI 提供。Next.js 默认构建并不等于纯静态网站，实际部署前需明确 SSR / 静态导出方案。
