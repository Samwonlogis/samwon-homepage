// 관리자 모드 「홈페이지 전체 반영」 — GitHub 저장소의 public/content.json을 직접 갱신
// 반영 키(GitHub 토큰)는 이 브라우저에만 저장되며, 사이트 코드·콘텐츠에는 포함되지 않습니다.
import { defaultContent } from '../data/defaultContent'

export const REPO = 'Samwonlogis/samwon-homepage'
export const BRANCH = 'main'
const PATH = 'public/content.json'
const TOKEN_KEY = 'samwon_publish_key'

export const getPublishKey = () => { try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' } }
export const setPublishKey = (v) => { try { v ? localStorage.setItem(TOKEN_KEY, v.trim()) : localStorage.removeItem(TOKEN_KEY) } catch {} }

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
/** 기본값과 다른 부분만 추출 — 코드의 기본 콘텐츠가 갱신되어도 수정하지 않은 항목은 자동 반영되도록 */
export function diffContent(base, cur) {
  if (JSON.stringify(base) === JSON.stringify(cur)) return undefined
  if (isObj(base) && isObj(cur)) {
    const out = {}
    for (const k of Object.keys(cur)) { const d = diffContent(base[k], cur[k]); if (d !== undefined) out[k] = d }
    return Object.keys(out).length ? out : undefined
  }
  return cur
}
export const publishable = (content) => diffContent(defaultContent, content) || {}

const b64 = (str) => { const bytes = new TextEncoder().encode(str); let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b) }); return btoa(bin) }

export async function publishContent(content, message = '관리자 모드: 홈페이지 콘텐츠 반영') {
  const key = getPublishKey()
  if (!key) throw new Error('반영 키가 등록되어 있지 않습니다. 관리자 모드 「고급 설정」에서 등록해 주십시오.')
  const headers = { Authorization: `Bearer ${key}`, Accept: 'application/vnd.github+json' }
  const url = `https://api.github.com/repos/${REPO}/contents/${PATH}`
  let sha
  const g = await fetch(`${url}?ref=${BRANCH}`, { headers })
  if (g.ok) sha = (await g.json()).sha
  else if (g.status === 401 || g.status === 403) throw new Error('반영 키가 올바르지 않거나 권한이 없습니다.')
  const body = JSON.stringify({ message, branch: BRANCH, sha, content: b64(JSON.stringify(publishable(content), null, 2) + '\n') })
  const p = await fetch(url, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body })
  if (!p.ok) { const t = await p.text(); throw new Error(`반영 실패 (${p.status}) ${t.slice(0, 120)}`) }
  return true
}
