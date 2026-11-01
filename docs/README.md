# 雀变 · 工程与系统文档导航

本目录汇总 **`mahjong-skill` 仓库已有的工程文档**与 **2026-10-30 新增的产品 / 玩法 / 三端设计系统资料**。两类文档用途不同：工程文档描述当前代码结构和本地开发方式；系统资料定义产品边界、批准的设计基线、开发计划与未来验收要求。**系统资料中的计划项不代表已经实现。**

## 工程文档（以当前源码为准）

| 文档 | 用途 |
| --- | --- |
| [技术架构与代码边界](architecture.md) | Monorepo、三端职责、代码边界、服务与发布目录 |
| [本地开发与工程命令](development.md) | 安装、启动、构建、测试、小程序 / H5 预览及故障排查 |
| [Git / GitHub 指南](github.md) | 首次提交、远程仓库、忽略规则与协作 |
| [Admin / Portal shadcn/ui 迁移](shadcn-migration.md) | Phase 03 Web 组件迁移、依赖更新、验证边界与运行步骤 |

## 系统文档（2026-10-30 资料包，原样归档）

[完整系统资料导航与版本说明](system/README.md)

| 文件 | 用途 |
| --- | --- |
| [01 · 产品需求 V1.0-R2](system/docs/01-雀变_产品需求_V1.0-R2_新版视觉映射.md) | P0 / P1 / P2 范围与原功能映射 |
| [02 · V1.0 玩法规则原文](system/docs/02-雀变_玩法规则_V1.0_原文.md) | **电子技能卡玩法的权威规则原文**（按资料包说明） |
| [03 · 三端设计系统 V1.2](system/docs/03-雀变_三端设计系统_V1.2_新版三端视觉.md) | 品牌 IP、UI、Light / Dark、布局、组件、素材规范 |
| [04 · 开发落地阶段计划 V1.1](system/docs/04-雀变_开发落地阶段计划_V1.1_新稿实施.md) | Phase 01–13 的任务、依赖与验收门 |
| [05 · 新三端设计对照与验收 V1.3](system/docs/05-雀变_新三端设计开发对照与验收_V1.3.md) | Client / Portal / Admin 的视觉与功能边界核对 |

### 随附结构化资料

- [`system/inventories/`](system/inventories/)：组件、页面、素材盘点和主题对照 CSV。
- [`system/planning/`](system/planning/)：阶段矩阵、需求追踪、页面发布映射以及视觉基线 JSON。
- [`system/tokens/`](system/tokens/)：`design-tokens.css` / `design-tokens.json`，是**待实施校准的设计规范输入**，不是现有三端代码已全部接入的证明。
- [`system/references/`](system/references/)：Client、Portal、Admin 三张 2026-10-30 视觉参考 WebP（用于对照，不能直接当做完整页面组件）。

## 阅读与实施顺序

1. 新功能开发：先看系统资料的 **玩法原文 → 产品需求 → 阶段计划 → 设计系统 / 验收**，再结合当前源码和工程架构制定具体变更。
2. 启动、构建和部署：以本目录的 `development.md` 与各工程 README 为准；文档中的未来计划不得覆盖当前实际脚本行为。
3. 视觉实现：以资料包中三张批准的浅色参考图为核对依据；Dark 主题需独立设计与验收，不能假定已经完成。
4. 如文档出现文件名、数量或版本不一致，**先核对原资料，不要静默修改 7z 导入的原文件**；后续修订应新增版本或留变更记录。

> 文件组织：整个外部系统资料包完整保存在 `docs/system/`，保持原始 `README.md`、`docs/`、`inventories/`、`planning/`、`references/`、`tokens/` 相对结构，便于其内部相对路径不受影响。

- [三端主题底座与验收](./theme-foundation.md)
