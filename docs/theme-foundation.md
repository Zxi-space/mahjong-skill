# 雀变三端基础设计系统（主题底座）

本阶段仅实现 Design Tokens、全局色彩/表面/字体、Light/Dark/System 主题切换、存储与基础页面验证；不开发新业务页面，不将静态参考图当成 UI 实现。

## 权威来源

- `docs/system/docs/03-雀变_三端设计系统_V1.2_新版三端视觉.md` §02 / §09
- `docs/system/tokens/design-tokens.json` 与 `design-tokens.css`
- `docs/system/references/01~03`：已确认的 **Light 布局参考图**，不是可复用完整页面素材；Dark 视觉稿尚未正式验收。

## 技术边界

- Client（Taro）：`src/styles/_qb-theme.scss` 为本端生成自设计规范的语义值快照，`src/theme/theme.ts` 保存偏好，`MjPageContainer` 承载小程序主题 Scope；H5 的 HTML 在首屏脚本预设 `data-qb-theme`。
- Admin：`src/styles/qb-tokens.css` 本地复制语义 Token；`index.html` 在 React 挂载前设定主题。
- Portal：`src/styles/qb-tokens.css` 本地复制语义 Token；`src/app/layout.tsx` 的早期脚本按已保存偏好解析最终主题，并使用 `suppressHydrationWarning`。
- 由于三端各为独立 Package，**不新增** `frontend/packages`；Tokens 以文档 JSON 为唯一权威源，前端三端使用经 `python scripts/sync_theme_tokens.py` 生成的构建时快照，CI 执行 `--check` 防止颜色漂移。

## 主题与持久化

- 用户偏好：`light` / `dark` / `system`；默认 `light`。
- 实际渲染 `resolved`: `light` 或 `dark`；`system` 并非 CSS 主题值。
- 存储键：`mahjong-skill-theme`；浏览器 `localStorage`；Taro 小程序 `Taro.setStorageSync`。
- `system` 订阅系统外观变化。微信小程序开启 `darkmode: true` 才可获取系统主题并监听主题变更；微信导航栏颜色通过小程序 API 同步。部分平台不支持系统主题事件时回退 Light。
- 主题不会重挂 QueryProvider、Room 状态或路由，不更改用户房间和技能数据。
- 深色下 `--qb-card-paper` / `--qb-card-ink` 保持浅纸卡片，**禁止**整站图片反色。

## 验收

1. `pnpm --filter @mahjong-skill/client build:h5`；浏览器 5174 测试主题切换后刷新及系统模式跟随。
2. `pnpm --filter @mahjong-skill/client build:weapp`；微信开发者工具检查首页/组件实验室/演示房间主题颜色、存储恢复及状态保持。
3. `pnpm --filter @mahjong-skill/admin build`，访问 5173，切换三个选项、刷新、查看表格/卡片/菜单。
4. `pnpm --filter @mahjong-skill/portal build`，访问 3000 检查首屏无白闪、切换和跨页面一致性。
5. 主题 UI 必须有键盘焦点、选中状态与清晰文字；进一步进行 WCAG 文字/对比度审查和正式 Dark 视觉对位验收。

## 目前未涵盖

- 三张参考图的完整页面复刻、设计规范 107 组件、48 页面与 137 素材的全量开发。
- 微信、支付宝、抖音全部真机主题验证，尤其非微信系统主题事件兼容性。
- 特殊系统设置下的高对比/大字模式自动检测、完整无障碍审查。

### 维护命令

```bash
pnpm mahjong-skill:theme:sync    # 从 docs/system/tokens 生成三个工程各自的快照
pnpm mahjong-skill:theme:check   # 只检查快照是否漂移，CI 使用
```
