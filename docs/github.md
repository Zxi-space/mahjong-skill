# Git 仓库初始化与 GitHub 首次发布

## 首次初始化（仅在当前目录还不是 Git 仓库时运行）

在项目根目录执行：

```powershell
cd D:\Projects\Python\mahjong-skill
# 若 `git status` 提示 not a git repository，再执行下一行
git init -b main
# 或运行自动预检命令（不要在初始化后重复执行 git init）
# pnpm mahjong-skill:git:init

# 确认必要锁文件存在；按需先运行 pnpm install / uv sync
Test-Path pnpm-lock.yaml

# 敏感文件预检（被忽略的文件不应进入提交）
git check-ignore -v backend/.env frontend/client/.env frontend/client/dist/weapp/app.js

git add .
git status --short
# 核对无环境密钥、node_modules、构建产物、数据库、日志
git diff --cached --stat

git commit -m "chore: 初始化雀变 Monorepo Git 仓库"
```

若 Git 提示未设置提交身份，请先执行 `git config --global user.name "你的 Git 用户名"` 与 `git config --global user.email "你的 Git 提交邮箱"`。

**重要：** `.gitignore` 只能阻止新文件被追踪；如果你过去已经提交过敏感文件，必须从 Git 索引中移除并评估是否需要清理历史、轮换密钥。不要将整个 `.git` 目录放进 ZIP 源码包。

## 推送 GitHub

在 GitHub 创建一个名为 `mahjong-skill` 的**空仓库**，不要勾选自动生成 README、`.gitignore` 或 LICENSE，然后从 GitHub 页面复制你自己的仓库 URL：

```powershell
# 替换为你在 GitHub 创建的真实 URL
git remote add origin https://github.com/<YOUR_ACCOUNT>/mahjong-skill.git
git remote -v
git push -u origin main
```

也可以安装并登录 GitHub CLI：

```powershell
gh auth login
gh repo create mahjong-skill --private --source . --remote origin --push
```

> 为当前尚未完成生产鉴权的工程，**建议先创建 Private 仓库**。如决定开源，请先确认图片、字体、IP 素材版权与许可证。未得到明确授权前，不自动添加开源 `LICENSE`。

## 首次发布检查清单

- [ ] `.env`、私钥、个人用户配置、测试数据未进入 `git status`。
- [ ] `pnpm-lock.yaml` 提交（以及如果生成则提交 `backend/uv.lock`）。
- [ ] 保留 `frontend/client/project.config.json`，排除 `project.private.config.json`。
- [ ] Alembic 迁移和 `backend/openapi.json` 已纳入版本管理。
- [ ] `.github/workflows/ci.yml` 在 GitHub Actions 中运行；如果失败，按日志修复，不把它当作已验证通过。
- [ ] 为 `main` 分支启用 PR/状态检查保护（可选，按仓库权限和计划）。

## 推送后的日常流程

`git checkout -b feat/skill-card` → 修改 → 本地检查 → `git add` / `git commit` → `git push -u origin feat/skill-card` → 创建 Pull Request。
