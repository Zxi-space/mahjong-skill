# 雀变用户端组件边界

- `ui/`：通用 Mj UI。Button/Dialog/Sheet/Toast 依托 Taroify，其他基础组件基于 Taro 原语，不依赖 DOM。
- `layout/`：页面容器与标题。保留平台原生导航栏，不与原生导航重复。
- `business/`：技能卡等可组合的业务展示组件，当前示例不承诺实际规则处理。
- 各组件的类型、样式和状态在本目录内维护；不得直接 import Admin/Portal 组件。
- `subpackages/gallery/` 是 UI 验证入口，应在微信真机及 H5 测试弹层、Input、Toast、触摸与安全区。
- 主题变量维护在 `src/styles/_tokens.scss`，在 `app.scss` 同步覆盖 Taroify 的核心 CSS variables。

- 页面与业务组件优先直接引用所需 `ui/<name>`，避免通过 `ui/index.ts` 汇总所有带样式副作用的组件；保留 index.ts 供外部兼容。
