import { defineConfig } from 'orval'
export default defineConfig({
  admin: {
    input: '../../backend/openapi.json',
    output: { target: 'src/api/generated.ts', client: 'axios', mode: 'single' },
  },
})
