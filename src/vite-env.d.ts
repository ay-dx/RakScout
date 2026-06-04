/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAKUTEN_APP_ID: string;
  readonly VITE_RAKUTEN_AFFILIATE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}