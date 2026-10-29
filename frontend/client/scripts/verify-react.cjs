// Validate React modules resolved from Client, not from other frontend packages.
const { createRequire } = require('node:module')
const { resolve } = require('node:path')

const clientRequire = createRequire(resolve(__dirname, '../package.json'))
const deps = ['react', 'react-dom']
const results = deps.map((name) => {
  const manifestPath = clientRequire.resolve(`${name}/package.json`)
  const version = clientRequire(`${name}/package.json`).version
  return { name, version, manifestPath }
})

for (const dep of results) {
  console.log(`${dep.name.padEnd(9)} ${dep.version}  ${dep.manifestPath}`)
}

if (results.some((dep) => dep.version !== '18.3.1')) {
  console.error('Client React 与 React DOM 必须均为 18.3.1。请在仓库根目录运行 pnpm install。')
  process.exitCode = 1
} else {
  console.log('[OK] Client React runtime versions are aligned.')
}
