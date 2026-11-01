# Phase 03 · Admin / Portal shadcn/ui 组件体系迁移

> 工程基线：2026-10-30 `mahjong-skill-layout-foundation`。本文记录的是已修改的组件与验收边界，不能代替已确认的视觉设计系统文档。

## 权威设计规范

- `docs/system/docs/03-雀变_三端设计系统_V1.2_新版三端视觉.md`
- `docs/system/references/02-portal-approved-20261030.webp` 与 `03-admin-approved-20261030.webp`
- `docs/system/tokens/design-tokens.json`

**产品定位**：线下实体麻将中的电子技能卡辅助工具。三端只使用真实可编辑控件，不设计在线麻将牌桌/手牌/牌墙等交互。

## 技术栈与组件归属

| 端 | 原语 | 组合式源码组件 | 应用层 |
| --- | --- | --- | --- |
| Admin (React19 / Vite8) | Radix UI / TanStack Table | `src/components/ui/*`（shadcn/ui API） | Sidebar/Header、Dashboard、组件实验室 |
| Portal (Next16 / React19) | Radix UI | `src/components/ui/*`（shadcn/ui API） | SiteHeader、Hero、Features、Steps |
| Client (Taro / React18) | Taro/Taroify | 保留微信小程序兼容组件 | 不在本次 Web 组件迁移范围内 |

shadcn/ui 是将组件**源码加入项目**的方式，不是必须在 `package.json` 中出现 `shadcn/ui` 的运行时依赖。Button/Card/Input 底层仍会渲染 HTML 元素，但一律使用 `components/ui` 的统一实现；Dialog、Sheet、Select、DropdownMenu、Tabs、Switch、Tooltip 和 AlertDialog 的行为由 Radix UI 原语承担。Admin 数据表格由 TanStack Table 管理排序/行模型，shadcn Table 负责 DOM 展示。不得另写 `showModal()`、原生弹层焦点逻辑、CSS 模拟下拉框。

### 实现清单（本轮）

- 双端 `Button`、`Card`、`Badge`、`Input`、`Textarea`、`Label`、`Skeleton`、`Separator`、`Table`、`Empty`。
- 双端 `Dialog`、`Sheet`、`AlertDialog`、`DropdownMenu`、`Select`、`Tabs`、`Switch`、`Tooltip`。
- Admin `Sidebar` 组合组件（移动端 Radix Sheet）、TanStack DataTable、状态 Badge、Dashboard Card、Component Lab。
- Portal 站点桌面导航 Radix NavigationMenu、移动端 Radix Sheet、CTA Button、功能/步骤 Card、统一主题 DropdownMenu。
- `--qb-*` Design Tokens 仍为颜色唯一源，shadcn/Tailwind 只做 Token 映射，不覆盖既定品牌配色。

这些是**现有页面及本阶段底座组件的迁移范围**，不是声称设计文档中 100+ 个业务组件已经全部实现。涉及身份、技能牌与房间数据的业务页面尚未进入本轮。

## 本地一次性安装与锁文件更新

源码包不附带 `node_modules`。新增 Radix 依赖已经写入 Admin/Portal 的 `package.json`。由于当前打包环境无法联网，**尚未更新 `pnpm-lock.yaml`**；安装前必须在可访问 npm Registry 的本机重新解析并提交锁文件：

```powershell
cd D:\Projects\Python\mahjong-skill
pnpm install --no-frozen-lockfile
pnpm mahjong-skill:theme:check
pnpm --filter @mahjong-skill/admin build
pnpm --filter @mahjong-skill/portal build
pnpm --filter @mahjong-skill/admin test
pnpm --filter @mahjong-skill/portal test
```

提交时一起添加 `pnpm-lock.yaml`，否则 GitHub Actions 的 `pnpm install --frozen-lockfile` 会失败。**不应使用 `--no-frozen-lockfile` 作为 CI 的长期替代品**。

## 现场验收

1. Admin 5173 `/` 与 `/components`：Sidebar、响应式移动抽屉、Dialog、AlertDialog、Select、Tabs、Switch、输入、Tooltip、空表格均可操作，Esc/遮罩/焦点行为正确。
2. Portal 3000 `/`：主/次 CTA、功能卡与步骤卡、移动 Sheet 导航、主题菜单均可使用。
3. Light/Dark/System：在两个端切换、刷新和系统切换后，样式与 `--qb-*` 保持一致；Dark 仍待独立视觉验收。
4. 辅助验收：键盘 Tab 焦点、对话框返回焦点、移动安全区、1366/1440/390 宽度、无控制台 hydration 错误。
5. 不用设计稿中的假 KPI 冒充真实业务指标；Portal 正式雀叽插画在素材接入前继续显示可替换占位。

### 已验证 / 待验证

本地静态检查与 Python 回归测试可执行；**本轮尚未在安装依赖后实际运行 Vite/Next 编译、浏览器端交互或移动端实测**，这些必须在本机完成后才能通过最终 Gate。
