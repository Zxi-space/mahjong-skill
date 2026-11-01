/// <reference types="vite/client" />

/** Vite-exposed variables for the Admin browser runtime. */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
