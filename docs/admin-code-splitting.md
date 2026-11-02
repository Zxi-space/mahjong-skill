# Admin 生产分包与体积验收

## 目标与范围

针对此前 Admin 的单文件 `index-*.js` **524.30 kB（gzip 162.61 kB）**，实施**路由懒加载 + Vite 8/Rolldown 依赖拆包 + 产物体积门禁**。这一数字是本机旧版构建日志的基线，不是本轮新构建结果。

本阶段仅修改 `frontend/admin` 的构建与路由，不修改雀变三端 Design Tokens、业务数据接口、微信小程序或门户端。

## 真实执行路径

| 分类 | 加载策略 | 理由 |
| --- | --- | --- |
| App Shell、侧栏、顶栏、主题切换 | 首次加载 | 全局布局必须存在 |
| `/` 工作台 | `React.lazy` | 工作台指标与 TanStack Table 不需要打入 Shell |
| `/components` 组件实验室 | `React.lazy` | Dialog/Select/Tabs/Switch 等仅在访问实验室时加载 |
| 其他尚未建设的业务路由 | `React.lazy` 复用占位页 | 占位 UI 独立于入口 |
| React / React DOM / Scheduler | `react-runtime` | 稳定运行时，独立缓存 |
| React Router | `router-runtime` | 路由依赖独立缓存 |
| TanStack Query | `query-runtime` | 入口需要 QueryClient，但不连带表格运行时 |
| TanStack Table | `table-runtime` | 仅在含表格的页面被访问时加载 |
| Radix/shadcn 交互组件 | **自动分包** | 避免将仅组件实验室使用的浮层、Select 等强制拉进首屏 |

使用 **Vite 8** 支持的 `build.rolldownOptions.output.codeSplitting.groups`，**不使用废弃的 `manualChunks`**，也不调高 `chunkSizeWarningLimit` 以掩盖警告。分组支持 pnpm 的 `.pnpm/<package>/node_modules` 安装路径。

### 运行

在仓库根目录：

```powershell
pnpm --filter @mahjong-skill/admin build
pnpm mahjong-skill:analyze:admin
pnpm mahjong-skill:check:admin:bundle
pnpm --filter @mahjong-skill/admin preview
```

在预览服务中依次访问 `/`、`/components`、`/skills`，观察 DevTools Network（Disable cache）：首次访问 `/` 不应加载 `components-demo` 的 JS；点击 `/components` 时才拉取对应动态入口。页面跳转、暗色模式、交互弹窗、控制台均应正常。

### 产物检查

`frontend/admin/dist/.vite/manifest.json` 记录 HTML entry、静态 `imports`、路由的 `dynamicImports` 和产物文件。

`analyze:bundle` 输出各 JS 文件的**原始体积 / gzip 体积**、**实际首屏静态依赖大小**、**动态页面数量**及**最大单个 JS 文件**。首屏数值是依据 manifest 的静态 import 图计算，不把尚未访问的动态路由计入首屏。

`check:bundle` 在任一 JS 文件 **大于 500,000 字节**，或 `/`、`/components` 不是独立动态入口时返回非零状态。GitHub Actions 在 Admin 构建后执行这一检查。

> 单个 chunk 变小 **不等于**总 JS 减少，也不代表页面加载速度一定提高。应将首屏总下载量（尤其 gzip）、网络并发、交互延迟和真实缓存命中作为后续性能验收依据。本轮无法替代本机生产编译及浏览器运行验证。

### 构建后若仍超限

1. 先查看报告中最大的 chunk、它是否属于首屏静态依赖，以及是否由单个大库组成。
2. 若是按需页面，优先检查是否被 shell 静态导入或被分组规则提前拉入；不要直接调大阈值。
3. 若是长期使用的大型库，可拆更精确的 Rolldown group；先评估模块初始化顺序及依赖循环，再执行页面完整回归。
4. 如今后真正使用 ECharts，应仅在图表页面 `import()`，避免它出现在入口 bundle 中。

## 验收状态

- 源码拆分与产物分析器：已实施。
- 分包规则/分析器模拟回归：可在当前测试环境运行。
- 新 Vite 构建体积、Windows 实际浏览器行为：需在安装工程依赖的本机验证后确认。
