// GitHub Pages에서 새로고침·직접 접속 시 404를 막기 위해 index.html을 404.html로 복제
import { copyFileSync } from 'node:fs'
copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html created')
