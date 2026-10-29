# 雀变 Client 双端运行与兼容验收

## 1. H5（浏览器）

在仓库根目录执行 `pnpm mahjong-skill:dev:client`，启动器的 H5 端口为 `5174`，随后访问 `http://127.0.0.1:5174`。

也可以仅运行 `pnpm --filter @mahjong-skill/client dev:h5`；生产构建为 `pnpm --filter @mahjong-skill/client build:h5`，产物在 `frontend/client/dist/h5/`。

## 2. 微信小程序（微信开发者工具）

在仓库根目录执行 `pnpm --filter @mahjong-skill/client dev:weapp`，编译器持续监听文件修改，输出到 `frontend/client/dist/weapp/`。

打开微信开发者工具 → **导入项目** → 目录选择 `D:\Projects\Python\mahjong-skill\frontend\client`。微信配置文件位于 Client 根目录，`miniprogramRoot` 已指向 `dist/weapp/`。填写真实微信小程序 AppID，或在受限的游客模式中仅验证基础 UI。

> **不要直接导入 `src/`。** 开发者工具读取的是已经由 Taro 编译完成的小程序文件。构建成功后应看到 `dist/weapp/app.json`。

本次修复后，H5 和微信小程序输出目录互不覆盖，可以同时进行双端开发。

## 3. Mj UI 手动冒烟验收

在 H5 和微信开发者工具中分别检查：

- 首页正常显示、进入演示房间、返回首页
- 组件示例页：Button 点击后 Toast 出现并自动消失
- Input 输入中文、超出长度限制时表现正常
- Tabs 在三个选项间切换，激活态样式一致
- Dialog 确认/取消和遮罩关闭
- Sheet 打开/关闭、内容滚动和底部安全区
- Loading/Empty/Badge/Avatar/SkillCard 的结构与样式
- 小程序调试器无报错；真机检查 iOS 与 Android、竖屏和安全区

`subpackages/gallery/index` 仅是测试入口；它不是自动化端到端测试，更不能代替微信真机验收。

## 4. 缓存与打包策略

当前 H5 已使用文件系统持久化缓存；微信小程序默认改为不启用文件系统缓存，以规避之前 `Can't resolve '@tarojs/taro-loader/lib/page'` 的写盘失败。微信端开发模式仍可使用 Webpack 内存缓存，**这是稳定性降级，而非持久化缓存根因已解决**。

如需在本机诊断并试用微信文件系统缓存（PowerShell）：

```powershell
$env:MJ_ENABLE_MINI_FS_CACHE = '1'
pnpm --filter @mahjong-skill/client build:weapp
Remove-Item Env:MJ_ENABLE_MINI_FS_CACHE
```

只有在连续两次构建无缓存序列化及 Loader 解析警告后，才考虑启用该配置为默认行为。若仍然出现该警告，则继续使用默认设置，后续基于完整 `node_modules` 依赖解析数据排查。

## 5. 包体审查

```powershell
pnpm --filter @mahjong-skill/client build:h5
pnpm mahjong-skill:analyze:client:h5
pnpm --filter @mahjong-skill/client build:weapp
pnpm mahjong-skill:analyze:client:weapp
```

报告位置：`artifacts/client-h5-bundle-report.json`、`artifacts/client-weapp-bundle-report.json`。报告列出实际资源大小及 gzip 大小，不会通过调高 Webpack 阈值来掩盖问题。

大 Chunk 可能来自框架运行时、UI 组件、路由或重复依赖；当前**尚未生成完整模块归因报告**，不能直接认定是 Taroify。
