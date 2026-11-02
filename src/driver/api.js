/**
 * 차주 전용 포털 API 어댑터
 * - company.driverApi(관리자 모드에서 입력)에 API 기본 주소가 있으면 실제 서버를 호출합니다. 명세: docs/DRIVER_API.md
 * - 비어 있으면 데모 모드(src/driver/mock.js)로 동작하며, 화면 상단에 예시 데이터임을 표시합니다.
 * - 토큰은 '기억하기' 선택 시 localStorage, 아니면 sessionStorage 에 보관합니다.
 */
import { demoDriver, demoStatement, demoDeductions, demoPosts } from './mock'

const KEY = 'samwon_driver_session'
let base = ''
export const configure = (apiBase) => { base = (apiBase || '').replace(/\/$/, '') }
export const isDemo = () => !base

const store = () => (localStorage.getItem(KEY) ? localStorage : sessionStorage)
export const getSession = () => { try { const s = store().getItem(KEY); return s ? JSON.parse(s) : null } catch { return null } }
const setSession = (s, remember) => { clearSession(); (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s)) }
export const clearSession = () => { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY) }

async function call(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const s = getSession(); if (auth && s?.token) headers.Authorization = `Bearer ${s.token}`
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (res.status === 401) { clearSession(); throw Object.assign(new Error('로그인이 만료되었습니다. 다시 로그인해 주십시오.'), { code: 401 }) }
  const j = await res.json().catch(() => ({}))
  if (!res.ok || j.ok === false) throw new Error(j.message || '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주십시오.')
  return j.data ?? j
}
const wait = (ms) => new Promise(r => setTimeout(r, ms))

export async function login(vehicleNo, password, remember) {
  const vno = vehicleNo.replace(/\s+/g, '')
  if (isDemo()) {
    await wait(400)
    if (!vno || password !== '1234') throw new Error('데모 모드입니다. 차량번호를 입력하고 비밀번호는 1234를 입력해 주십시오.')
    const driver = { ...demoDriver, vehicleNo: vehicleNo.trim() || demoDriver.vehicleNo }
    setSession({ token: 'demo', driver, at: Date.now() }, remember); return driver
  }
  const d = await call('/auth/login', { method: 'POST', body: { vehicleNo: vno, password }, auth: false })
  setSession({ token: d.token, driver: d.driver, at: Date.now() }, remember); return d.driver
}
export async function logout() { if (!isDemo()) { try { await call('/auth/logout', { method: 'POST' }) } catch {} } clearSession() }

export async function getStatement(month) { if (isDemo()) { await wait(250); return demoStatement(month) } return call(`/statements/${month}`) }
export async function getStatementMonths() { if (isDemo()) return null; return call('/statements') }
export async function getDeductions(month) { if (isDemo()) { await wait(250); return demoDeductions(month) } return call(`/deductions/${month}`) }
export async function getPosts({ category = '', page = 1, q = '' } = {}) {
  if (isDemo()) {
    await wait(200)
    let list = demoPosts.filter(p => (!category || p.category === category) && (!q || p.title.includes(q)))
    list = [...list].sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date))
    return { items: list, page: 1, pages: 1, total: list.length }
  }
  const qs = new URLSearchParams({ ...(category && { category }), page, ...(q && { q }) })
  return call(`/board?${qs}`)
}
export async function getPost(id) { if (isDemo()) { await wait(150); const p = demoPosts.find(x => String(x.id) === String(id)); if (!p) throw new Error('게시글을 찾을 수 없습니다.'); return p } return call(`/board/${id}`) }
export async function changePassword(current, next) { if (isDemo()) { await wait(300); return { ok: true } } return call('/auth/password', { method: 'POST', body: { current, next } }) }

export const won = (n) => (n == null ? '-' : `${Number(n).toLocaleString('ko-KR')}원`)
export const fmtMonth = (ym) => { const [y, m] = ym.split('-'); return `${y}년 ${Number(m)}월` }
export const fmtDate = (s) => (s ? s.replace(/-/g, '.') : '-')
