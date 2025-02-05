/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string
  VITE_DEBUG: string
}

interface ImportMeta {
  env: ImportMetaEnv
}
