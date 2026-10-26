/**
 * 콘텐츠 저장 계층
 *  1) defaultContent (코드 기본값)
 *  2) public/content.json (GitHub에 올리면 모든 방문자에게 반영)
 *  3) localStorage (관리자가 브라우저에서 즉시 수정한 값 — 해당 브라우저에서만 유지)
 * 우선순위: 3 > 2 > 1
 */
const STORAGE_KEY = 'samwon_content_v2026'
export const BASE = import.meta.env.BASE_URL || '/'

export function asset(url) {
  if (!url) return ''
  if (/^(data:|https?:|blob:)/.test(url)) return url
  return BASE + url.replace(/^\//, '')
}

export function loadLocal() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null } catch { return null }
}
export function saveLocal(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true }
  catch (e) { if (e && e.name === 'QuotaExceededError') alert('브라우저 저장 공간이 부족합니다. 이미지 크기를 줄여 주십시오.'); return false }
}
export function clearLocal() { try { localStorage.removeItem(STORAGE_KEY) } catch {} }

export async function loadRemote() {
  try {
    const r = await fetch(`${BASE}content.json?v=${Date.now()}`, { cache: 'no-store' })
    if (!r.ok) return null
    const j = await r.json()
    return j && Object.keys(j).length ? j : null
  } catch { return null }
}

export function deepMerge(base, over) {
  if (!over) return structuredClone(base)
  if (Array.isArray(base) || Array.isArray(over)) return structuredClone(over)
  if (typeof base !== 'object' || typeof over !== 'object' || base === null || over === null) return over
  const out = { ...base }
  for (const k of Object.keys(over)) out[k] = k in base ? deepMerge(base[k], over[k]) : structuredClone(over[k])
  return out
}

export function imageToDataUrl(file, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        resolve(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality))
      }
      img.onerror = reject; img.src = e.target.result
    }
    reader.onerror = reject; reader.readAsDataURL(file)
  })
}

export function downloadJson(data, filename = 'content.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
