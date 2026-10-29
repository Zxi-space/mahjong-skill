# 贡献与工程约定

欢迎以 Issue / Pull Request 的方式提出缺陷修复和工程改进。

## 开发约束

1. 一个仓库包含三个独立前端 Package（`frontend/client`、`frontend/admin`、`frontend/portal`）和一个后端（`backend`）。禁止跨前端项目直接引用对方 `src/components` 或业务源码。
2. Client 使用 Taro / React 18；Admin、Portal 使用 React 19。修改依赖时必须验证 H5 和微信小程序的实际构建。
3. 环境变量只提交 `.env.example`；运行日志、数据库、密钥、打包产物不得提交。
4. 更改 API Schema 时同步更新 `backend/openapi.json`，检查 Admin Orval 类型生成与 Client 请求调用。
5. 修改数据库模型时编写 Alembic 迁移文件并提交。
6. UI 组件修改至少完成 H5 浏览器测试与微信开发者工具检查；需真机验证的行为在 PR 中说明。

## 建议的分支与提交规范

- 分支：`feat/*`、`fix/*`、`refactor/*`、`docs/*`、`chore/*`。
- 中文提交：`feat(client): 增加技能卡组件`、`fix(client): 修复 H5 React 解析`、`docs: 完善仓库说明`。
- Pull Request 应写明目的、受影响工程、已执行的构建/测试命令，以及仍未验证的项目。

## 提交前检查

```bash
python -m unittest discover -s scripts/tests -p 'test_*.py'
pnpm --filter @mahjong-skill/client build:h5
pnpm --filter @mahjong-skill/client build:weapp
pnpm --filter @mahjong-skill/admin build
pnpm --filter @mahjong-skill/portal build
```

如果存在已知的构建失败，请在 PR 中如实标注；不要通过屏蔽错误、降低检查强度或直接覆盖他人文件使 CI 假通过。

请勿公开提交账号密钥、私人数据或没有授权的素材。发现敏感信息泄露时，先阻止继续传播、轮换相关凭据，并通过仓库维护者的非公开渠道处理。
