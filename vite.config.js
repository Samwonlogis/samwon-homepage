import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// GitHub Pages 배포 경로: 저장소 이름과 동일하게 유지할 것 (사용자 도메인 사용 시 '/')
const REPO_NAME = 'samwon-homepage'

export default defineConfig(({ mode }) => {
  const isPreview = mode === 'preview'
  // Cloudflare 빌드(Pages: CF_PAGES=1, Workers: WORKERS_CI=1)는 도메인 루트('/'), GitHub Pages는 저장소 경로
  const onCloudflare = !!(process.env.CF_PAGES || process.env.WORKERS_CI)
  return {
    base: isPreview ? './' : onCloudflare ? '/' : `/${REPO_NAME}/`,
    plugins: isPreview ? [react(), viteSingleFile()] : [react()],
    build: isPreview ? { assetsInlineLimit: 100000000, cssCodeSplit: false } : {},
    server: { port: 3000 },
  }
})
