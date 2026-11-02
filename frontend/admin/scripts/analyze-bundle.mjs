#!/usr/bin/env node
/**
 * Inspect the production Vite manifest. Counts static imports in the initial
 * load and does NOT count lazy route chunks as startup assets. No deps.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const root = resolve(import.meta.dirname, '..')
const distArg = process.argv.indexOf('--dist')
const dist = distArg >= 0 && process.argv[distArg + 1] ? resolve(process.argv[distArg + 1]) : resolve(root, 'dist')
const manifestPath = resolve(dist, '.vite/manifest.json')
const strict = process.argv.includes('--strict')
const budgetBytes = 500_000 // Vite reports decimal kB, not KiB.

if (!existsSync(manifestPath)) {
  console.error('未找到 dist/.vite/manifest.json，请先运行 pnpm --filter @mahjong-skill/admin build')
  process.exit(1)
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const entryKeys = Object.keys(manifest).filter(key => manifest[key].isEntry)
if (entryKeys.length !== 1) {
  console.error(`期望一个 HTML 应用入口，实际发现 ${entryKeys.length} 个：${entryKeys.join(', ')}`)
  process.exit(1)
}
const entryKey = entryKeys[0]
function walkStatic(start, visited = new Set()) {
  if (visited.has(start) || !manifest[start]) return visited
  visited.add(start)
  for (const dependency of manifest[start].imports ?? []) walkStatic(dependency, visited)
  return visited
}
function measuredFile(filename) {
  const path = resolve(dist, filename)
  if (!existsSync(path)) throw new Error(`产物不存在：${filename}`)
  const data = readFileSync(path)
  return { file: filename, bytes: statSync(path).size, gzipBytes: gzipSync(data).length }
}
const initialKeys = walkStatic(entryKey)
const initialFiles = new Set([...initialKeys].map(key => manifest[key].file).filter(file => file?.endsWith('.js')))
const dynamicKeys = Object.keys(manifest).filter(key => manifest[key].isDynamicEntry)
const requiredLazyPages = ['dashboard.tsx', 'components-demo.tsx']
const lazyFailures = requiredLazyPages.filter(name => !dynamicKeys.some(key => key.replaceAll('\\', '/').endsWith('/features/' + name)))
const allJsFiles = new Set(Object.values(manifest).map(item => item.file).filter(file => file?.endsWith('.js')))
const allChunks = [...allJsFiles].map(measuredFile).sort((a,b) => b.bytes - a.bytes)
const initialChunks = allChunks.filter(chunk => initialFiles.has(chunk.file))
const fmt = value => `${(value / 1000).toFixed(2)} kB`
console.log('\n雀变 Admin · Vite 生产分包报告')
console.log(`入口：${entryKey} · 初始 JS：${initialChunks.length} 个 · 懒加载页面：${dynamicKeys.length} 个`)
console.log('\nJS 产物（原始 / gzip；* 为初始加载依赖）：')
for (const chunk of allChunks) {
  console.log(`${initialFiles.has(chunk.file) ? '*' : ' '} ${chunk.file.padEnd(47)} ${fmt(chunk.bytes).padStart(11)} / ${fmt(chunk.gzipBytes).padStart(10)}`)
}
const total = chunks => chunks.reduce((sum, chunk) => sum + chunk.bytes, 0)
const initialGzip = initialChunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0)
console.log(`\n初始 JS：${fmt(total(initialChunks))} · gzip ${fmt(initialGzip)}`)
console.log(`全部 JS：${fmt(total(allChunks))} · gzip ${fmt(allChunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0))}`)
console.log(`最大单文件：${allChunks.length ? fmt(allChunks[0].bytes) : '无'}`)
console.log(`异步页面：${dynamicKeys.map(key => key.replace(/^src\/features\//, '')).join('、') || '无'}`)
const overBudget = allChunks.filter(chunk => chunk.bytes > budgetBytes)
if (lazyFailures.length) {
  console.log(`\n[WARN] 页面缺少独立的异步入口：${lazyFailures.join('、')}`)
  if (strict) process.exitCode = 1
}
if (overBudget.length) {
  console.log(`\n[WARN] ${overBudget.length} 个 JS 文件超过 ${fmt(budgetBytes)}：${overBudget.map(chunk => chunk.file).join('、')}`)
  if (strict) process.exitCode = 1
} else {
  console.log(`\n[OK] 所有 JS 文件均不超过 ${fmt(budgetBytes)}`)
}
