import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Anchored package segments work with both normal node_modules and pnpm's
// node_modules/.pnpm/<package>/node_modules layout. The React matcher must not
// accidentally capture react-router(-dom) or react-hook-form.
const reactRuntime = /[\\/]node_modules[\\/](?:\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?(?:react|react-dom|scheduler)[\\/]/
const routerRuntime = /[\\/]node_modules[\\/](?:\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?react-router(?:-dom)?[\\/]/
const queryRuntime = /[\\/]node_modules[\\/](?:\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?@tanstack[\\/](?:react-query|query-core)[\\/]/
const tableRuntime = /[\\/]node_modules[\\/](?:\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?@tanstack[\\/](?:react-table|table-core)[\\/]/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, strictPort: true },
  build: {
    // Build the manifest so actual initial/static vs on-demand JS can be
    // measured, rather than merely counting the number of output files.
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-runtime', test: reactRuntime, priority: 40 },
            { name: 'router-runtime', test: routerRuntime, priority: 30 },
            { name: 'query-runtime', test: queryRuntime, priority: 25 },
            { name: 'table-runtime', test: tableRuntime, priority: 25 },
          ],
        },
      },
    },
  },
})
