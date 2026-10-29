# 雀变 Client · 微信小程序 / H5

使用 **Taro 4.3.1 + React 18.3.1 + TypeScript + Taroify + SCSS + Zustand + TanStack Query + Taro.request**。

## 开发与构建

在仓库根目录：

```bash
pnpm --filter @mahjong-skill/client dev:h5
pnpm --filter @mahjong-skill/client dev:weapp
pnpm --filter @mahjong-skill/client build:h5
pnpm --filter @mahjong-skill/client build:weapp
pnpm --filter @mahjong-skill/client doctor:react
```

H5 开发地址默认 `http://127.0.0.1:5174`，输出到 `dist/h5/`；微信小程序输出到 `dist/weapp/`。微信开发者工具导入**本目录 `frontend/client/`**，并使用 `project.config.json` 中的 `miniprogramRoot`。`touristappid` 仅用于受限调试。

## 目录约定

- `src/pages/`：主包路由入口；`src/subpackages/`：分包页面（包含组件实验室）。
- `src/components/ui/`：自封装 Mj UI；`layout/`：页面布局；`business/`：技能卡等业务组件。
- `src/platform/`：平台功能边界；`src/api/`：Taro 请求层；`src/stores/`：客户端状态。
- `src/styles/`：独立的 SCSS Tokens / Mixins；`config/`：Taro 构建配置。

**注意：** Client 使用 React 18，Admin / Portal 使用 React 19。不要直接导入两端的组件、Browser DOM 原语或其他项目的 React 实例。

本阶段实现首页、演示房间、组件实验室，尚未实现完整房间业务、技能规则校验或微信正式登录。跨端 UI 的浏览器、开发者工具和真机验收步骤参见 [COMPATIBILITY.md](COMPATIBILITY.md)。
