// GitHub Pages에서 새로고침·직접 접속 시 404를 막기 위해 index.html을 404.html로 복제 + sitemap.xml/robots.txt 생성
import { copyFileSync, writeFileSync } from 'node:fs'
copyFileSync('dist/index.html', 'dist/404.html')
// 도메인 전환(3won.kr) 시 SITE_URL 환경변수 또는 아래 기본값만 바꾸면 됩니다
const SITE = (process.env.SITE_URL || 'https://samwonlogis.github.io/samwon-homepage').replace(/\/$/, '')
const routes = ['/', '/company/intro', '/company/vision', '/company/history', '/company/offices', '/company/status',
  '/business', '/business/corporate', '/business/distribution', '/business/brokerage', '/business/warehouse', '/business/consulting',
  '/recruitment/talent', '/recruitment/jobs', '/support/notice', '/contact', '/contact/partnership', '/privacy', '/terms']
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(r => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod><changefreq>${r === '/' || r.includes('notice') || r.includes('jobs') ? 'weekly' : 'monthly'}</changefreq><priority>${r === '/' ? '1.0' : r.split('/').length > 2 ? '0.7' : '0.8'}</priority></url>`).join('\n') + '\n</urlset>\n'
writeFileSync('dist/sitemap.xml', xml)
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /driver\nSitemap: ${SITE}/sitemap.xml\n`)
console.log('dist/404.html, sitemap.xml, robots.txt created')
