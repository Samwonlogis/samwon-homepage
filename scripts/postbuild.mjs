// GitHub Pages에서 새로고침·직접 접속 시 404를 막기 위해 index.html을 404.html로 복제 + sitemap.xml/robots.txt 생성
import { copyFileSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
const CF = !!process.env.CF_PAGES
const GH = 'https://samwonlogis.github.io/samwon-homepage'
// Cloudflare Pages는 404.html이 없으면 SPA로 자동 처리하므로 GitHub Pages에서만 복제
if (!CF) copyFileSync('dist/index.html', 'dist/404.html')
// 대표 주소: SITE_URL 환경변수 > Cloudflare(www.3won.kr) > GitHub Pages
const SITE = (process.env.SITE_URL || (CF ? 'https://www.3won.kr' : GH)).replace(/\/$/, '')
if (SITE !== GH) for (const f of ['dist/index.html', 'dist/m/index.html', 'dist/s1/index.html']) {
  if (existsSync(f)) writeFileSync(f, readFileSync(f, 'utf8').split(GH).join(SITE))
}
const routes = ['/', '/company/intro', '/company/vision', '/company/history', '/company/offices', '/company/status',
  '/business', '/business/corporate', '/business/distribution', '/business/brokerage', '/business/warehouse', '/business/consulting',
  '/recruitment/talent', '/recruitment/jobs', '/support/notice', '/contact', '/contact/partnership', '/privacy', '/terms']
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(r => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod><changefreq>${r === '/' || r.includes('notice') || r.includes('jobs') ? 'weekly' : 'monthly'}</changefreq><priority>${r === '/' ? '1.0' : r.split('/').length > 2 ? '0.7' : '0.8'}</priority></url>`).join('\n') + '\n</urlset>\n'
writeFileSync('dist/sitemap.xml', xml)
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /driver\nSitemap: ${SITE}/sitemap.xml\n`)
console.log((CF ? '' : 'dist/404.html, ') + 'sitemap.xml, robots.txt created (' + SITE + ')')
