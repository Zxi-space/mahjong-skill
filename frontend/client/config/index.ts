import { defineConfig } from '@tarojs/cli'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

// 三端独立 React 版本：Taro Client=18，Admin/Portal=19。
// 在 pnpm Workspace 中，H5 Webpack 必须从 Client 自己的依赖目录解析 React / React DOM。
const clientRequire = createRequire(resolve(__dirname, '../package.json'))
const reactManifest = clientRequire.resolve('react/package.json')
const reactDomManifest = clientRequire.resolve('react-dom/package.json')
const reactVersion = JSON.parse(readFileSync(reactManifest, 'utf8')).version as string
const reactDomVersion = JSON.parse(readFileSync(reactDomManifest, 'utf8')).version as string

if (reactVersion !== reactDomVersion || reactVersion !== '18.3.1') {
  throw new Error(
    `[Mahjong Skill] Client 需要 React/React DOM 18.3.1，实际为 react=${reactVersion}、react-dom=${reactDomVersion}。请先在仓库根目录执行 pnpm install。`,
  )
}

const clientReactDir = dirname(reactManifest)
const clientReactDomDir = dirname(reactDomManifest)

// 不同平台独立输出；微信小程序默认不写入有解析错误的 Webpack 文件缓存。
// 如已验证本机 @tarojs/taro-loader 缓存解析正常，可设置 MJ_ENABLE_MINI_FS_CACHE=1 测试。
const target = process.env.TARO_ENV || 'h5'
const useMiniFilesystemCache = process.env.MJ_ENABLE_MINI_FS_CACHE === '1'
// H5 的 HTML 入口为 src/index.html，由 Taro 的 HtmlWebpackPlugin 生成 index.html。

export default defineConfig<'webpack5'>({
  projectName: 'mahjong-skill',
  date: '2026-10-29',
  designWidth: 750,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
  sourceRoot: 'src',
  outputRoot: `dist/${target}`,
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: target === 'h5' || useMiniFilesystemCache,
  },
  plugins: [],
  mini: {},
  h5: {
    publicPath: '/',
    // React 19 在 Admin/Portal 中使用，但不允许被 Client H5 的依赖图错误解析。
    // 包目录 Alias 同时覆盖 react/jsx-runtime 与 react-dom/client 等子路径。
    webpackChain(chain) {
      chain.resolve.alias.set('react', clientReactDir)
      chain.resolve.alias.set('react-dom', clientReactDomDir)
    },
    devServer: {
      host: '0.0.0.0',
      port: 5174,
      // 使用 Taro 自己生成并提供的 index.html；不要将 dist 目录配置为额外的 static 服务。
    },
  },
})
