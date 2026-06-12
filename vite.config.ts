import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/RakScout/', // GitHub Pages 用のベースパスを設定
  build: {
    sourcemap: false, // ソースマップを出力しない（セキュリティ）
  },
})
