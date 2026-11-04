import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import * as api from '../../driver/api'
import { ArrowRight, Phone, Truck, Shield, Check } from '../../components/Icons'

const { won, fmtDate } = api
const num = (n) => (n == null || n === '' ? '' : Number(n).toLocaleString('ko-KR'))
const ymLabel = (ym = '') => { const [y, m] = ym.split('-'); return `${String(y).slice(2)}년 ${Number(m)}월` }
const ymFull = (ym = '') => { const [y, m] = ym.split('-'); return `${y}년 ${Number(m)}월` }
/** 거래처 담당자 — API 가 manager/phone 을 주면 그대로, 없으면 관리자 설정(driverContacts)에서 근무업체명으로 매칭, 그래도 없으면 기본 담당자 */
export function resolveManager(client, dc) {
  if (client?.manager && client?.phone) return { manager: client.manager, phone: client.phone }
  const name = String(client?.name || client || '').replace(/\s+/g, '').toLowerCase()
  for (const m of dc?.managers || []) if ((m.clients || []).some(k => k && name.includes(String(k).replace(/\s+/g, '').toLowerCase()))) return { manager: m.name, phone: m.phone }
  return dc?.default ? { manager: dc.default.name, phone: dc.default.phone } : { manager: client?.manager || '', phone: client?.phone || '' }
}
const todayKey = () => new Date().toISOString().slice(0, 10)
const MENUS = [
  { to: '/driver/statements', label: '운송료내역서', d: 'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5' },
  { to: '/driver/insurance', label: '보험 / 할부 / 공과금', short: '보험·할부', d: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z M9 12l2 2 4-4' },
  { to: '/driver/board', label: '게시판', d: 'M4 5h16v11H8l-4 3z M8 9h8 M8 12h5' },
  { to: '/driver/guide', label: '기사님 안내', short: '안내', d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M12 8v5 M12 16h.01' },
  { to: '/driver/checklist', label: '일상점검표', short: '점검표', d: 'M9 3h6v3H9z M6 5h12v15H6z M9 12l2 2 4-4' },
]
const Ic = ({ d }) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
function useDriverApi() { const { content } = useContent(); api.configure(content.company.driverApi); return content }
function useLoad(fn, deps) {
  const [st, set] = useState({ loading: true, data: null, error: '' })
  useEffect(() => { let on = true; set(s => ({ ...s, loading: true, error: '' })); fn().then(d => on && set({ loading: false, data: d, error: '' })).catch(e => on && set({ loading: false, data: null, error: e.message })); return () => { on = false } }, deps) // eslint-disable-line
  return st
}
const State = ({ st, children }) => st.loading ? <div className="dp-state">불러오는 중…</div> : st.error ? <div className="dp-state dp-state--err">{st.error}</div> : children
function Pager({ page, pages, onGo }) {
  return (
    <nav className="dp-pager" aria-label="페이지">
      <button type="button" disabled={page <= 1} onClick={() => onGo(page - 1)}>‹ 이전</button>
      {Array.from({ length: pages }, (_, k) => <button key={k} type="button" className={k + 1 === page ? 'is-on' : ''} onClick={() => onGo(k + 1)}>{k + 1}</button>)}
      <button type="button" disabled={page >= pages} onClick={() => onGo(page + 1)}>다음 ›</button>
    </nav>
  )
}

/* ───────── 로그인 (/driver) ───────── */
export function DriverLogin() {
  const c = useDriverApi(); const co = c.company; const r = c.recruitment
  const nav = useNavigate(); const loc = useLocation()
  const [f, setF] = useState({ vehicleNo: '', password: '', remember: false })
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  useEffect(() => { document.title = '차주정보 | 삼원종합물류㈜' }, [])
  if (api.getSession()) return <Navigate to={loc.state?.from || '/driver/statements'} replace />
  const submit = async (e) => {
    e.preventDefault(); setMsg(''); setBusy(true)
    try { await api.login(f.vehicleNo, f.password, f.remember); nav(loc.state?.from || '/driver/statements', { replace: true }) }
    catch (err) { setMsg(err.message) } finally { setBusy(false) }
  }
  return (
    <section className="dp-login">
      <div className="dp-login__bg"><img src={asset('img/banner_drivers.jpg')} alt="" /></div>
      <div className="wrap dp-login__in">
        <div className="dp-login__intro" data-reveal="">
          <span className="sh-en">Driver Partners</span>
          <h1>삼원종합물류<br />차주정보</h1>
          <p>월별 운송료내역서 조회·출력, 보험·할부·공과금 확인, 차주 공지와 구인 정보를 한곳에서 확인하는 차주 전용 공간입니다.</p>
          <ul className="dp-login__feat">{MENUS.map(m => <li key={m.to}><Ic d={m.d} /><b>{m.label}</b></li>)}</ul>
          <ul className="check-list dp-login__benefit">{(r.driverBenefits || []).slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
        <form className="dp-card dp-login__form" onSubmit={submit} data-reveal="">
          <h2>로그인</h2>
          {api.isDemo() && <div className="dp-demo">연동 전 <b>예시 화면</b>입니다. 차량번호를 입력하고 비밀번호 <b>1234</b>로 로그인하면 예시 데이터를 볼 수 있습니다.</div>}
          <label>차량번호<input required value={f.vehicleNo} onChange={e => setF({ ...f, vehicleNo: e.target.value })} placeholder="차량번호 전체 입력 (예: 경기12바3456)" autoComplete="username" /></label>
          <label>비밀번호<input required type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="비밀번호 입력" autoComplete="current-password" /></label>
          <label className="dp-check"><input type="checkbox" checked={f.remember} onChange={e => setF({ ...f, remember: e.target.checked })} /> 기억하기</label>
          {msg && <div className="notice dp-err">{msg}</div>}
          <button className="btn btn--primary dp-btn" type="submit" disabled={busy}>{busy ? '확인 중…' : '로그인'} <ArrowRight /></button>
          <p className="small muted">비밀번호 분실·계정 문의: <a href={`tel:${co.phone}`}>{co.phone}</a> (관리팀)</p>
          {co.driverLegacyUrl && <a className="dp-legacy" href={co.driverLegacyUrl}>기존 차주정보 사이트로 이동 →</a>}
        </form>
      </div>
    </section>
  )
}

/* 감사 문구 띠 — 날짜 기준으로 문구 순환 */
function ThanksBar({ name, msgs = [] }) {
  if (!msgs.length) return null
  const i = Math.floor(Date.now() / 86400000) % msgs.length
  return <div className="dp-thanks"><div className="wrap dp-thanks__in"><span className="dp-thanks__ic"><Check /></span><p><b>{name} 기사님,</b> {msgs[i]}</p><Link to="/driver/guide">기사님 안내 <ArrowRight /></Link></div></div>
}

/* ───────── 운행 전 일상점검(법정) — 매일 표시, 당일 완료 시 접힘 ───────── */
const CHECK_KEY = 'samwon_dp_dailycheck'
const CHECK_LOG = 'samwon_dp_dailycheck_log'
export const checkDoneToday = () => { try { const v = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}'); return v.date === todayKey() && !!v.done } catch { return false } }
const loadLog = () => { try { return JSON.parse(localStorage.getItem(CHECK_LOG) || '[]') } catch { return [] } }
function loadCheck() { try { const v = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}'); return v.date === todayKey() ? v : { date: todayKey(), result: {} } } catch { return { date: todayKey(), result: {} } } }
export function DailyCheck({ compact, onDone }) {
  const { content: c } = useContent(); const g = c.driverGuide || {}
  const items = (g.checklist || []).map(x => typeof x === 'string' ? { group: '', text: x } : x)
  const [st, setSt] = useState(loadCheck)
  const [open, setOpen] = useState(() => !loadCheck().done)
  const save = (n) => { setSt(n); try { localStorage.setItem(CHECK_KEY, JSON.stringify(n)) } catch {} }
  const mark = (i, v) => save({ ...st, result: { ...st.result, [i]: st.result[i] === v ? undefined : v } })
  const answered = items.filter((_, i) => st.result[i]).length
  const bad = items.filter((_, i) => st.result[i] === 'x').length
  const finish = () => {
    if (answered < items.length) { alert('모든 항목을 양호 또는 불량으로 표시해 주십시오.'); return }
    const at = new Date().toISOString(); const results = items.map((_, i) => st.result[i])
    save({ ...st, done: true, at }); setOpen(false)
    try { const log = loadLog().filter(l => l.date !== st.date); log.unshift({ date: st.date, at, bad, results }); localStorage.setItem(CHECK_LOG, JSON.stringify(log.slice(0, 60))) } catch {}
    api.submitChecklist({ date: st.date, results, at }).catch(() => {})
    onDone && onDone()
  }
  const d = new Date(); const dateLabel = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  if (!items.length) return null
  if (st.done && !open) return (
    <div className={`dp-dc dp-dc--done ${compact ? 'is-compact' : ''}`}>
      <span className="dp-dc__ic"><Check /></span>
      <div><b>{dateLabel} 운행 전 일상점검 완료</b><span>{bad > 0 ? `불량 ${bad}건 — 정비 조치 후 운행하시고 관리팀에 알려 주십시오.` : '전 항목 양호. 오늘도 안전 운행하십시오.'}</span></div>
      <button type="button" onClick={() => setOpen(true)}>다시 보기</button>
    </div>
  )
  return (
    <div className={`dp-dc ${compact ? 'is-compact' : ''}`}>
      <div className="dp-dc__head">
        <div><span className="dp-dc__tag">법정 의무 · 매일</span><h3>{dateLabel} 운행 전 일상점검</h3><p>{g.checklistLaw}</p></div>
        <div className="dp-dc__prog"><b>{answered}</b> / {items.length}</div>
      </div>
      <ul className="dp-dc__list">
        {items.map((x, i) => (
          <li key={i} className={st.result[i] === 'o' ? 'is-ok' : st.result[i] === 'x' ? 'is-bad' : ''}>
            <span className="dp-dc__no">{i + 1}</span>
            <span className="dp-dc__txt">{x.group && <small>{x.group}</small>}{x.text}</span>
            <span className="dp-dc__btns"><button type="button" className={st.result[i] === 'o' ? 'is-on' : ''} onClick={() => mark(i, 'o')}>양호 ○</button><button type="button" className={st.result[i] === 'x' ? 'is-on is-x' : ''} onClick={() => mark(i, 'x')}>불량 ×</button></span>
          </li>
        ))}
      </ul>
      <div className="dp-dc__foot">
        <p className="small muted">{api.isDemo() ? '연동 전에는 점검 결과가 이 기기에만 보관됩니다. 연동 후에는 점검 완료 즉시 회사로 전송되어 관리팀이 확인합니다.' : '점검 완료를 누르면 결과가 회사로 전송되어 관리팀이 확인합니다.'} 불량 항목은 조치 후 운행하십시오.</p>
        <button type="button" className="btn btn--primary btn--sm" onClick={finish}>점검 완료</button>
      </div>
    </div>
  )
}

/* 운송료내역서·안내 상단 한 줄 안내 */
function CheckReminder() {
  const done = checkDoneToday()
  return (
    <Link to="/driver/checklist" className={`dp-cr ${done ? 'is-done' : ''}`}>
      <span className="dp-cr__ic">{done ? <Check /> : <Shield />}</span>
      <span className="dp-cr__txt"><b>운행 전 일상점검표는 매일 작성해야 합니다.</b><span>{done ? '오늘 점검 완료' : '오늘 점검 미작성'}</span></span>
      <span className="dp-cr__go">{done ? '보기' : '작성하기'} <ArrowRight /></span>
    </Link>
  )
}

/* ───────── 일상점검표 (/driver/checklist) ───────── */
export function Checklist() {
  const { content: c } = useContent(); const g = c.driverGuide || {}
  const [, tick] = useState(0); const log = loadLog()
  const items = (g.checklist || [])
  return (
    <section className="dp-sec">
      <header className="dp-head"><div><span className="sh-en">Daily Check</span><h1>일상점검표</h1></div><span className="dp-head__page">매일 운행 전 작성</span></header>
      <DailyCheck onDone={() => tick(t => t + 1)} />
      <div className="dp-cl-info">
        <h3>운수종사자 일상점검표란</h3>
        <p>{g.checklistLaw}</p>
        <p>항목은 외관(번호판·등화장치·와이퍼·적재함 등) {items.filter(x => x.group === '외관').length}개, 상태(타이어·고정·바퀴 너트) {items.filter(x => x.group === '상태').length}개, 기타(계기판·안전띠·소화기·삼각대) {items.filter(x => x.group === '기타').length}개로 구성됩니다. 불량 항목은 정비 조치 후 운행하시고, 조치가 어려우면 배차팀에 먼저 알려 주십시오.</p>
      </div>
      <div className="dp-cl-log">
        <h3>최근 점검 이력 <small>{api.isDemo() ? '이 기기 기록' : '회사 전송 완료'}</small></h3>
        {log.length === 0 ? <p className="dp-ins__none">아직 기록이 없습니다. 오늘 점검을 완료하면 이곳에 쌓입니다.</p> : (
          <ul>{log.slice(0, 30).map(l => <li key={l.date} className={l.bad > 0 ? 'is-bad' : ''}><b>{fmtDate(l.date)}</b><span>{new Date(l.at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span><em>{l.bad > 0 ? `불량 ${l.bad}건` : '전 항목 양호'}</em></li>)}</ul>
        )}
      </div>
    </section>
  )
}

/* ───────── 미납 안내 팝업 ───────── */
const OVER_KEY = 'samwon_dp_overdue_seen'
function OverduePopup({ company }) {
  const [list, setList] = useState(null); const [info, setInfo] = useState({})
  useEffect(() => {
    let on = true
    api.getInsurance().then(d => {
      if (!on) return
      const today = todayKey(); const out = []
      ;(d.overdue || []).forEach(x => out.push({ ...x }))
      ;(d.schedule || []).forEach(r => { if (!r.paid && r.date && r.date < today) out.push({ title: `종합보험 ${r.no}회차`, date: r.date, amount: r.amount }) })
      ;(d.installment || []).forEach(r => { if (!r.paid && r.date && r.date < today) out.push({ title: `차량 할부 ${r.no}회차`, date: r.date, amount: r.amount }) })
      setInfo({ payTo: d.payTo, contact: d.contact }); setList(out)
    }).catch(() => setList([]))
    return () => { on = false }
  }, [])
  const [closed, setClosed] = useState(() => { try { return sessionStorage.getItem(OVER_KEY) === todayKey() } catch { return false } })
  if (closed || !list || list.length === 0) return null
  const total = list.reduce((s, x) => s + (Number(x.amount) || 0), 0)
  const close = () => { try { sessionStorage.setItem(OVER_KEY, todayKey()) } catch {} setClosed(true) }
  return (
    <div className="dp-pop" role="dialog" aria-modal="true" aria-labelledby="dp-pop-t">
      <div className="dp-pop__box">
        <span className="dp-pop__tag">입금 요청</span>
        <h2 id="dp-pop-t">미납 내역이 있습니다</h2>
        <p>아래 금액이 납부 기한을 지났습니다. 확인 후 입금해 주시고, 이미 입금하셨다면 관리팀으로 알려 주십시오.</p>
        <table className="dp-pop__tbl"><tbody>{list.map((x, i) => <tr key={i}><th>{x.title}</th><td>{fmtDate(x.date)}</td><td className="num">{num(x.amount)}원</td></tr>)}</tbody>
          <tfoot><tr><th colSpan="2">합계</th><td className="num">{num(total)}원</td></tr></tfoot></table>
        {info.payTo && <div className="dp-pop__acct"><span>입금 계좌</span><b>{info.payTo.bank} {info.payTo.account}</b><small>예금주 {info.payTo.holder}</small></div>}
        <div className="dp-pop__act">
          <a className="btn btn--ghost" href={`tel:${info.contact?.phone || company?.phone || ''}`}><Phone /> 관리팀 문의</a>
          <Link className="btn btn--primary" to="/driver/insurance" onClick={close}>내역 확인</Link>
          <button type="button" className="dp-pop__x" onClick={close} aria-label="닫기">오늘 그만 보기</button>
        </div>
      </div>
    </div>
  )
}

/* ───────── 포털 공통 레이아웃 ───────── */
export function DriverShell() {
  const c = useDriverApi(); const nav = useNavigate(); const loc = useLocation()
  const s = api.getSession()
  useEffect(() => { document.title = '차주정보 | 삼원종합물류㈜'; window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => { document.body.dataset.portal = '1'; return () => { delete document.body.dataset.portal } }, [])
  if (!s) return <Navigate to="/driver" replace state={{ from: loc.pathname }} />
  const d = s.driver; const ins = d.inspection || {}
  const out = async () => { await api.logout(); nav('/driver', { replace: true }) }
  const isInvoice = /\/invoice$/.test(loc.pathname)
  return (
    <div className="dp">
      <div className="dp-top">
        <div className="wrap dp-top__in">
          <div className="dp-top__who"><span className="dp-top__avatar" aria-hidden="true"><Truck /></span><div><b>{d.name} 기사님</b><span>{d.vehicleNo}{d.tonnage ? ` · ${d.tonnage}` : ''}</span></div></div>
          <nav className="dp-tabs" aria-label="차주정보 메뉴">{MENUS.map(m => <NavLink key={m.to} to={m.to}><Ic d={m.d} /><span>{m.label}</span></NavLink>)}</nav>
          <div className="dp-top__act"><a href={`tel:${c.company.phone}`} className="dp-top__tel"><Phone /> {c.company.phone}</a><button type="button" onClick={out}>로그아웃</button></div>
        </div>
      </div>
      {api.isDemo() && <div className="dp-demo dp-demo--bar">연동 전 예시 데이터입니다. 실제 운송료·공제 내역과 다릅니다.</div>}
      {!isInvoice && <ThanksBar name={d.name} msgs={c.driverGuide?.thanks} />}
      {!isInvoice && <OverduePopup company={c.company} />}
      <div className={`wrap dp-body ${isInvoice ? '' : 'dp-body--side'}`}>
        {!isInvoice && (
          <aside className="dp-side">
            <nav className="dp-side__menu">{MENUS.map(m => <NavLink key={m.to} to={m.to}><Ic d={m.d} /><span>{m.label}</span><ArrowRight /></NavLink>)}</nav>
            <div className="dp-side__card">
              <h4>검사알림</h4>
              <p>안녕하세요. <b>{d.name}</b>님<br />삼원에 오신 것을 환영합니다.</p>
              <table className="dp-insp"><tbody>
                <tr><th>정기검사</th><td>{ins.regular || '-'}</td></tr>
                <tr><th>정기점검</th><td>{ins.check || '-'}</td></tr>
                <tr><th>배출가스</th><td>{ins.emission || '-'}</td></tr>
              </tbody></table>
              <button type="button" className="dp-side__out" onClick={out}>로그아웃</button>
            </div>
          </aside>
        )}
        <main className="dp-main"><Outlet context={{ driver: d, company: c.company }} /></main>
      </div>
      <nav className="dp-mtabs" aria-label="차주정보 하단 메뉴">{MENUS.map(m => <NavLink key={m.to} to={m.to}><Ic d={m.d} /><span>{m.short || m.label}</span></NavLink>)}</nav>
    </div>
  )
}

/* ───────── 운송료내역서 — 월별 목록 ───────── */
export function Statements() {
  const [sp, setSp] = useSearchParams(); const page = Math.max(1, Number(sp.get('p') || 1))
  const st = useLoad(() => api.getStatementList(page), [page]); const d = st.data
  return (
    <section className="dp-sec">
      <CheckReminder />
      <header className="dp-head"><div><span className="sh-en">Statements</span><h1>운송료내역서</h1></div>{d && <span className="dp-head__page">Page ( {d.page} / {d.pages} )</span>}</header>
      <State st={st}>{d && (<>
        {d.page === 1 && d.items[0] && (
          <div className="dp-hl">
            <div className="dp-hl__main"><span>최근 운송료 · {ymFull(d.items[0].month)}분</span><b>{won(d.items[0].net)}</b><em>{d.items[0].paidAt ? `지급일 ${fmtDate(d.items[0].paidAt)}` : '지급 예정'} · {d.items[0].client}</em><Link className="dp-hl__btn" to={`/driver/statements/${d.items[0].month}`}>내역서 보기 <ArrowRight /></Link></div>
            <div className="dp-hl__sub"><div><span>운송료계</span><b>{won(d.items[0].fare)}</b></div><div><span>부가세</span><b>{won(d.items[0].vat)}</b></div><div><span>공제계</span><b className="dp-minus">- {won(d.items[0].deductions)}</b></div></div>
          </div>
        )}
        <div className="dp-table-wrap">
          <table className="dp-table dp-table--grid">
            <thead><tr><th>번호</th><th>운송료 월</th><th>근무업체</th><th className="num">운송료계</th><th className="num">부가세</th><th className="num">공제계</th><th className="num">지급계</th></tr></thead>
            <tbody>
              {d.items.length === 0 && <tr><td colSpan="7" className="dp-empty">내역이 없습니다.</td></tr>}
              {d.items.map((r, i) => (
                <tr key={r.month}>
                  <td data-l="번호" className="num muted">{(d.page - 1) * 10 + i + 1}</td>
                  <td data-l="운송료 월"><Link className="dp-month-btn" to={`/driver/statements/${r.month}`}><b>{ymLabel(r.month)} 운송료</b><small>{r.paidAt ? `지급 ${fmtDate(r.paidAt)}` : '지급 예정'}</small></Link></td>
                  <td data-l="근무업체">{r.client}</td>
                  <td data-l="운송료계" className="num">{num(r.fare)}</td>
                  <td data-l="부가세" className="num">{num(r.vat)}</td>
                  <td data-l="공제계" className="num">{num(r.deductions)}</td>
                  <td data-l="지급계" className="num dp-strong">{num(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={d.page} pages={d.pages} onGo={(p) => setSp({ p })} />
        <p className="small muted dp-foot">운송료 월을 누르면 해당 월의 운송비 내역서(지급·공제·지출 상세·세금계산서 발행 정보·과태 내역)를 확인하고 출력할 수 있습니다.</p>
      </>)}</State>
    </section>
  )
}

/* ───────── 월 운송비 내역서(상세) ───────── */
const Row = ({ k, v, v2, strong, blank }) => <tr className={blank ? 'is-blank' : ''}><th>{k}</th><td className={`num ${strong ? 'dp-strong' : ''}`}>{v}</td>{v2 !== undefined && <td className={`num ${strong ? 'dp-strong' : ''}`}>{v2}</td>}</tr>
export function StatementDetail() {
  const { month } = useParams(); const nav = useNavigate()
  const st = useLoad(() => api.getStatement(month), [month]); const d = st.data
  const rows = (arr, n) => [...arr, ...Array.from({ length: Math.max(0, n - arr.length) }, () => null)]
  const { content: cc } = useContent()
  const client = d && (typeof d.client === 'string' ? { name: d.client } : d.client || {})
  const mgr = d ? resolveManager(client, cc.driverContacts) : {}
  return (
    <section className="dp-sec dp-sheet-wrap">
      <State st={st}>{d && (<>
        <div className="dp-sheet-tools">
          <button type="button" className="dp-print" onClick={() => nav('/driver/statements')}>리스트</button>
          {d.taxInvoice?.type !== 'electronic' && <Link className="dp-print" to={`/driver/statements/${month}/invoice`}>수기세금계산서 출력</Link>}
          <button type="button" className="dp-print dp-print--main" onClick={() => window.print()}>프린트 · PDF</button>
        </div>
        <article className="dp-sheet">
          <h1 className="dp-sheet__title">{ymFull(d.month)} 운송비 내역서</h1>
          <table className="dp-sheet__head">
            <tbody>
              <tr><th rowSpan="5" className="dp-sheet__rowhead">차량보험료<br />회차확인<br />/<br />공제항목<br />확인철저</th><td><b>대표자명 :</b> {d.driver.name} 님</td><td><b>운송료 월 :</b> {ymFull(d.month)} 운송료{d.paidAt ? ` (지급일 ${fmtDate(d.paidAt)})` : ' (지급 예정)'}</td></tr>
              <tr><td><b>차량번호 :</b> {d.driver.vehicleNo}</td><td><b>사업자번호 :</b> {d.driver.bizNo}</td></tr>
              <tr><td><b>은 행 명 :</b> {d.driver.bank}</td><td><b>계좌번호 :</b> {d.driver.account}</td></tr>
              <tr><td><b>근무업체 :</b> {client.name}</td><td><b>거래처 담당 :</b> {mgr.manager || '-'}{mgr.phone && <> · <a href={`tel:${mgr.phone}`}>{mgr.phone}</a></>}</td></tr>
              <tr><td colSpan="2" className="dp-sheet__check">▶ 차량번호 · 사업자등록번호 · 계좌번호 확인 철저 / 세금계산서는 아래 「발행 대상」 사업자번호로 발행</td></tr>
            </tbody>
          </table>
          {d.notice && <p className="dp-sheet__notice">{d.notice}</p>}

          <div className="dp-sheet__cols dp-sheet__cols--2">
            <table className="dp-sheet__t dp-sheet__t--3"><thead><tr><th colSpan="3">지급내역</th></tr><tr className="dp-sheet__sub2"><th>항목</th><th>공급가액</th><th>부가세</th></tr></thead><tbody>
              {rows(d.income || [], 6).map((x, i) => x ? <Row key={i} k={x.title} v={num(x.supply ?? x.amount)} v2={num(x.vat ?? Math.round((x.supply ?? x.amount) * 0.1))} /> : <Row key={i} k="" v="" v2="" blank />)}
              <tr className="dp-sheet__sum"><th>합계</th><td className="num">{num(d.totals.supply)}</td><td className="num">{num(d.totals.vat)}</td></tr>
              <tr className="dp-sheet__sum dp-sheet__sum--total"><th>소득총계 (공급가액 + 부가세)</th><td className="num" colSpan="2">{num(d.totals.income)}</td></tr>
            </tbody></table>
            <table className="dp-sheet__t"><thead><tr><th colSpan="2">공제내역</th></tr><tr className="dp-sheet__sub2"><th>항목</th><th>금액</th></tr></thead><tbody>
              {rows(d.deductions || [], 6).map((x, i) => x ? <Row key={i} k={x.title} v={num(x.amount)} /> : <Row key={i} k="" v="" blank />)}
              <tr className="dp-sheet__sum"><th>공제총계</th><td className="num">{num(d.totals.deductions)}</td></tr>
              <tr className="dp-sheet__sum dp-sheet__sum--total"><th>실지급액</th><td className="num dp-strong">{num(d.totals.net)}</td></tr>
            </tbody></table>
          </div>

          <div className="dp-sheet__tax">
            <div className="dp-sheet__tax-h">※ 세금계산서 발행내역 — <b>발행 대상(공급받는 자)</b></div>
            <div className="dp-sheet__tax-b">
              <div className="dp-sheet__issue"><small>세금계산서 발행 대상 상호</small><b>{d.taxInvoice?.issueTo?.name || '-'}</b><small>사업자등록번호</small><b className="dp-sheet__bizno">{d.taxInvoice?.issueTo?.bizNo || '-'}</b>{d.taxInvoice?.issueTo?.address && <span>{d.taxInvoice.issueTo.address}</span>}<em>※ 홈페이지에 표시된 삼원종합물류㈜ 사업자번호가 아닌 위 번호로 발행하십시오.</em></div>
              <table className="dp-sheet__t"><tbody><Row k="공급가액" v={num(d.taxInvoice?.supply)} /><Row k="부가세" v={num(d.taxInvoice?.vat)} /><Row k="세금계산서 총액" v={num(d.taxInvoice?.total)} strong /><Row k="발행 구분" v={d.taxInvoice?.type === 'electronic' ? '전자세금계산서' : '수기세금계산서 (출력 가능)'} /></tbody></table>
            </div>
          </div>

          <table className="dp-sheet__box"><tbody>
            <tr><th>전체 공지</th><td>{d.noticeBox || ''}</td></tr>
            {d.memo && <tr><th>담당자 메모</th><td className="dp-sheet__memo">{d.memo}</td></tr>}
          </tbody></table>

          <div className="dp-sheet__fines">
            <div className="dp-sheet__fines-h">* 지출내역 상세 (지입료 · 보험료 · 공과금 등)</div>
            <table className="dp-table dp-table--grid dp-table--compact">
              <thead><tr><th>구분</th><th>항목</th><th>기간 · 회차</th><th className="num">금액</th><th>비고</th></tr></thead>
              <tbody>{(d.expenses || []).length === 0 ? <tr><td colSpan="5" className="dp-empty">내역이 없습니다</td></tr> : d.expenses.map((x, i) => <tr key={i}><td data-l="구분"><span className="dp-cat">{x.category}</span></td><td data-l="항목">{x.title}</td><td data-l="기간">{x.period || ''}</td><td data-l="금액" className="num">{num(x.amount)}</td><td data-l="비고" className="muted">{x.note || ''}</td></tr>)}</tbody>
              {(d.expenses || []).length > 0 && <tfoot><tr><td colSpan="3">지출 합계</td><td className="num">{num(d.expenses.reduce((s, x) => s + (x.amount || 0), 0))}</td><td /></tr></tfoot>}
            </table>
          </div>
          <div className="dp-sheet__fines">
            <div className="dp-sheet__fines-h">* 과태내역</div>
            <table className="dp-table dp-table--grid dp-table--compact">
              <thead><tr><th>위반일자</th><th>위반항목</th><th className="num">금액</th><th>납부기한</th><th>비고</th></tr></thead>
              <tbody>{(d.fines || []).length === 0 ? <tr><td colSpan="5" className="dp-empty">내역이 없습니다</td></tr> : d.fines.map((f, i) => <tr key={i}><td data-l="위반일자">{fmtDate(f.date)}</td><td data-l="위반항목">{f.item}</td><td data-l="금액" className="num">{num(f.amount)}</td><td data-l="납부기한">{fmtDate(f.due)}</td><td data-l="비고">{f.note}</td></tr>)}</tbody>
            </table>
          </div>
        </article>
      </>)}</State>
    </section>
  )
}

/* ───────── 수기세금계산서(출력용) ───────── */
export function ManualInvoice() {
  const { month } = useParams(); const nav = useNavigate()
  const st = useLoad(() => api.getStatement(month), [month]); const d = st.data
  const [issueDate, setIssueDate] = useState(() => todayKey())
  const copy = (label) => {
    const t = d.taxInvoice || {}; const to = t.issueTo || {}; const dr = d.driver || {}
    const [y, m] = d.month.split('-'); const sup = String(t.supply ?? 0); const vat = String(t.vat ?? 0)
    const cells = (s, n) => s.padStart(n, ' ').split('')
    return (
      <div className="iv">
        <div className="iv__top"><span className="iv__copy">[{label}]</span><h2>세 금 계 산 서</h2><span className="iv__book">책번호&nbsp;&nbsp;&nbsp;&nbsp;권&nbsp;&nbsp;&nbsp;&nbsp;호<br />일련번호</span></div>
        <table className="iv__party"><tbody>
          <tr><th rowSpan="4" className="iv__side">공<br />급<br />자</th><th>등록번호</th><td colSpan="3" className="iv__big">{dr.bizNo || ''}</td><th rowSpan="4" className="iv__side">공<br />급<br />받<br />는<br />자</th><th>등록번호</th><td colSpan="3" className="iv__big">{to.bizNo || ''}</td></tr>
          <tr><th>상호<br />(법인명)</th><td>{dr.bizName || dr.name}</td><th>성명</th><td>{dr.name}</td><th>상호<br />(법인명)</th><td>{to.name || ''}</td><th>성명</th><td>{to.ceo || ''}</td></tr>
          <tr><th>사업장<br />주소</th><td colSpan="3">{dr.address || ''}</td><th>사업장<br />주소</th><td colSpan="3">{to.address || ''}</td></tr>
          <tr><th>업태</th><td>운수업</td><th>종목</th><td>화물운송</td><th>업태</th><td>{to.bizType || '운수업'}</td><th>종목</th><td>{to.bizItem || '화물운송주선·운송'}</td></tr>
        </tbody></table>
        <table className="iv__amt"><thead><tr><th colSpan="4">작성</th><th colSpan="11">공급가액</th><th colSpan="10">세액</th><th rowSpan="2">비고</th></tr>
          <tr><th>년</th><th>월</th><th>일</th><th>공란수</th>{'십억천백십만천백십일'.split('').map((c, i) => <th key={'s' + i}>{c}</th>)}<th>원</th>{'억천백십만천백십일'.split('').map((c, i) => <th key={'v' + i}>{c}</th>)}<th>원</th></tr></thead>
          <tbody><tr><td>{issueDate.slice(0, 4)}</td><td>{issueDate.slice(5, 7)}</td><td>{issueDate.slice(8, 10)}</td><td>{Math.max(0, 10 - sup.length)}</td>{cells(sup, 10).map((ch, i) => <td key={'a' + i}>{ch.trim()}</td>)}<td />{cells(vat, 9).map((ch, i) => <td key={'b' + i}>{ch.trim()}</td>)}<td /><td /></tr></tbody></table>
        <table className="iv__items"><thead><tr><th>월</th><th>일</th><th>품목</th><th>규격</th><th>수량</th><th>단가</th><th>공급가액</th><th>세액</th><th>비고</th></tr></thead>
          <tbody>
            <tr><td>{m}</td><td>{d.payDate ? d.payDate.slice(8, 10) : ''}</td><td>화물 운송료 ({y}년 {Number(m)}월분) — 차량 {dr.vehicleNo}</td><td /><td>1</td><td className="num">{num(t.supply)}</td><td className="num">{num(t.supply)}</td><td className="num">{num(t.vat)}</td><td /></tr>
            {[1, 2, 3].map(i => <tr key={i}><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>)}
          </tbody></table>
        <table className="iv__total"><thead><tr><th>합계금액</th><th>현금</th><th>수표</th><th>어음</th><th>외상미수금</th><th rowSpan="2" className="iv__recv">이 금액을 <b>청구</b> 함</th></tr></thead><tbody><tr><td className="num iv__big">{num(t.total)}</td><td /><td /><td /><td className="num">{num(t.total)}</td></tr></tbody></table>
      </div>
    )
  }
  return (
    <section className="dp-sec">
      <State st={st}>{d && (<>
        <div className="dp-sheet-tools dp-sheet-tools--left">
          <button type="button" className="dp-print" onClick={() => nav(`/driver/statements/${month}`)}>← 내역서로</button>
          <label className="iv__date">작성일자 <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></label>
          <button type="button" className="dp-print dp-print--main" onClick={() => window.print()}>프린트 · PDF</button>
        </div>
        <div className="dp-demo">수기세금계산서 양식입니다. 출력 후 공급자(기사님) 서명·날인하여 회사에 제출하십시오. 전자세금계산서 의무 발행 대상자는 홈택스에서 전자 발행하셔야 합니다. 공급받는 자 정보가 비어 있거나 다르면 관리팀(02-598-3001)에 확인 후 사용하십시오.</div>
        <div className="iv-sheet">{copy('공급받는자 보관용')}<div className="iv__cut">— — — — — — — — — — — — — — — 절취선 — — — — — — — — — — — — — — —</div>{copy('공급자 보관용')}</div>
      </>)}</State>
    </section>
  )
}

/* ───────── 보험 / 할부 / 공과금 ───────── */
const KV = ({ rows }) => <table className="dp-kv"><tbody>{rows.map(([k, v], i) => <tr key={i}><th>{k}</th><td>{v == null || v === '' ? '' : v}</td></tr>)}</tbody></table>
export function Insurance() {
  const st = useLoad(() => api.getInsurance(), []); const d = st.data
  const w = (v) => (v == null || v === '' ? '' : `${num(v)} 원`)
  return (
    <section className="dp-sec">
      <header className="dp-head"><div><span className="sh-en">Insurance</span><h1>보험 / 할부 / 공과금</h1></div><button type="button" className="dp-print" onClick={() => window.print()}>인쇄 · PDF 저장</button></header>
      <State st={st}>{d && (<>
        {(d.accidentContacts || []).length > 0 && (
          <div className="dp-acc"><b>🚨 사고 접수</b>{d.accidentContacts.map((x, i) => <a key={i} href={`tel:${x.value}`}><span>{x.label}</span><strong>{x.value}</strong></a>)}</div>
        )}
        <div className="dp-ins">
          <div className="dp-ins__box">
            <h3>1. 종합보험</h3>
            {(d.liability?.coverages || []).length > 0 && <div className="dp-cov"><small>가입 담보</small>{d.liability.coverages.map((x, i) => <span key={i}>{x}</span>)}</div>}
            <KV rows={[['가입보험사', d.liability?.insurer], ['계약기간', d.liability?.period], ['책임보험료', w(d.liability?.mandatoryPremium)], ['임의보험료', w(d.liability?.optionalPremium)], ['특성', d.liability?.rate], ['할증', d.liability?.surcharge], ['비고', d.liability?.note]]} />
          </div>
          <div className="dp-ins__box"><h3>2. 적재물보험</h3><KV rows={[['가입보험사', d.cargo?.insurer], ['계약기간', d.cargo?.period], ['연간보험총액', w(d.cargo?.annualTotal)], ['연간총보상한도', w(d.cargo?.annualLimit)], ['사고당보상한도', w(d.cargo?.perAccidentLimit)], ['자기부담금', w(d.cargo?.deductible)], ['납입일자', fmtDate(d.cargo?.payDate)]]} /></div>
          <div className="dp-ins__box">
            <h3>종합보험 납부일정</h3>
            {(d.schedule || []).length > 0 && (() => { const t = d.schedule.length, pd = d.schedule.filter(r => r.paid).length; return (
              <div className="dp-prog"><div className="dp-prog__bar"><i style={{ width: `${Math.round(pd / t * 100)}%` }} /></div><span>{pd} / {t}회 납부 완료 · 잔여 {num(d.schedule.filter(r => !r.paid).reduce((s, r) => s + (r.amount || 0), 0))}원</span></div>) })()}
            <table className="dp-table dp-table--grid dp-table--compact">
              <thead><tr><th>순번</th><th>납부일자</th><th className="num">금액</th><th>납부</th><th>비고 (공제 월)</th></tr></thead>
              <tbody>{(d.schedule || []).map(r => <tr key={r.no}><td data-l="순번" className="num">{r.no}</td><td data-l="납부일자">{fmtDate(r.date)}</td><td data-l="금액" className="num">{num(r.amount)}</td><td data-l="납부" className="dp-star">{r.paid ? '★' : ''}</td><td data-l="비고">{r.deductedMonth ? `${ymLabel(r.deductedMonth)} 운송료에서 공제` : (r.note || (r.paid ? '' : '예정'))}</td></tr>)}</tbody>
              <tfoot><tr><td colSpan="2">합계</td><td className="num">{num((d.schedule || []).reduce((s, r) => s + (r.amount || 0), 0))}</td><td colSpan="2" /></tr></tfoot>
            </table>
          </div>
          <div className="dp-ins__box">
            <h3>3. 차량 할부</h3>
            {(d.installment || []).length === 0 ? <p className="dp-ins__none">할부 내역이 없습니다.</p> : (
              <table className="dp-table dp-table--grid dp-table--compact"><thead><tr><th>회차</th><th>납부일자</th><th className="num">금액</th><th>납부</th><th>비고 (공제 월)</th></tr></thead>
                <tbody>{d.installment.map((r, i) => <tr key={i}><td data-l="회차" className="num">{r.no}</td><td data-l="납부일자">{fmtDate(r.date)}</td><td data-l="금액" className="num">{num(r.amount)}</td><td data-l="납부" className="dp-star">{r.paid ? '★' : ''}</td><td data-l="비고">{r.deductedMonth ? `${ymLabel(r.deductedMonth)} 운송료에서 공제` : (r.note || '')}</td></tr>)}</tbody></table>)}
            <h3 style={{ marginTop: 22 }}>4. 차량공과금 / 환경개선부담금</h3>
            <KV rows={[['자동차세 과세기간 및 금액', d.autoTax?.period ? `${d.autoTax.period} / ${num(d.autoTax.amount)} 원` : ''], ['환경개선부담금 기간 및 금액', d.envCharge?.period ? `${d.envCharge.period} / ${num(d.envCharge.amount)} 원` : '']]} />
            <h3 style={{ marginTop: 22 }}>5. 화물조합비</h3>
            <KV rows={[['부과일자 / 화물조합비', d.unionFee?.date ? `${fmtDate(d.unionFee.date)} / ${num(d.unionFee.amount)} 원` : '']]} />
          </div>
        </div>
        {d.accidentGuide && <div className="dp-guide"><h3>▶ 사고시 운전자 대처요령</h3>{String(d.accidentGuide).split('\n').map((l, i) => <p key={i}>{l || ' '}</p>)}</div>}
      </>)}</State>
    </section>
  )
}

/* ───────── 게시판 ───────── */
const CATS = ['전체', '공지', '차주구인', '자료']
export function Board() {
  const [sp, setSp] = useSearchParams(); const cat = sp.get('c') || '전체'; const q = sp.get('q') || ''; const page = Math.max(1, Number(sp.get('p') || 1))
  const [kw, setKw] = useState(q)
  const st = useLoad(() => api.getPosts({ category: cat === '전체' ? '' : cat, q, page }), [cat, q, page]); const d = st.data
  const go = (o) => setSp({ c: cat, ...(q && { q }), ...o })
  return (
    <section className="dp-sec">
      <header className="dp-head"><div><span className="sh-en">Board</span><h1>게시판</h1></div>
        <form className="dp-search" onSubmit={e => { e.preventDefault(); setSp({ c: cat, q: kw }) }}><input value={kw} onChange={e => setKw(e.target.value)} placeholder="제목 검색" /><button type="submit">검색</button></form></header>
      <div className="dp-cats">{CATS.map(k => <button key={k} type="button" className={k === cat ? 'is-on' : ''} onClick={() => setSp({ c: k })}>{k}</button>)}</div>
      <State st={st}>{d && (<>
        <div className="dp-meta"><span>총게시물 <b>{d.total}</b></span><span>PAGE {d.page} / {d.pages}</span></div>
        <div className="dp-table-wrap">
          <table className="dp-table dp-table--grid dp-board">
            <thead><tr><th>번호</th><th>제목</th><th>이름</th><th>등록일</th><th className="num">조회</th></tr></thead>
            <tbody>
              {d.items.length === 0 && <tr><td colSpan="5" className="dp-empty">게시글이 없습니다.</td></tr>}
              {d.items.map(p => (
                <tr key={p.id} className={p.pinned ? 'is-pinned' : ''}>
                  <td data-l="번호" className="num muted">{p.pinned ? <i className="dp-pin">필독</i> : p.id}</td>
                  <td data-l="제목" className="dp-board__title"><Link to={`/driver/board/${p.id}`}>{(p.hasFile || p.attachments?.length > 0) && <span className="dp-clip" title="첨부파일">💾</span>}<span className={`dp-cat dp-cat--${p.category === '차주구인' ? 'job' : p.category === '공지' ? 'notice' : 'doc'}`}>{p.category}</span>{p.title}</Link></td>
                  <td data-l="이름">{p.author}</td>
                  <td data-l="등록일">{fmtDate(p.date)}</td>
                  <td data-l="조회" className="num">{p.views ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={d.page} pages={d.pages} onGo={(p) => go({ p })} />
      </>)}</State>
    </section>
  )
}
export function Post() {
  const { id } = useParams(); const st = useLoad(() => api.getPost(id), [id]); const p = st.data
  return (
    <section className="dp-sec">
      <State st={st}>{p && (
        <article className="dp-post">
          <header><span className={`dp-cat dp-cat--${p.category === '차주구인' ? 'job' : p.category === '공지' ? 'notice' : 'doc'}`}>{p.category}</span><h1>{p.title}</h1><p>{p.author} · {fmtDate(p.date)} · 조회 {p.views ?? 0}</p></header>
          <div className="dp-post__body">{String(p.body || '').split('\n').map((l, i) => <p key={i}>{l || ' '}</p>)}</div>
          {p.attachments?.length > 0 && <ul className="dp-post__files">{p.attachments.map((a, i) => <li key={i}><a href={a.url} target="_blank" rel="noreferrer">💾 {a.name}</a></li>)}</ul>}
          <footer><Link to="/driver/board" className="btn btn--ghost">목록으로</Link>{p.category === '차주구인' && <a className="btn btn--primary" href="tel:02-598-3001"><Phone /> 배차팀 문의</a>}</footer>
        </article>
      )}</State>
    </section>
  )
}

/* ───────── 기사님 안내 ───────── */
export function Guide() {
  const { content: c } = useContent(); const g = c.driverGuide || {}
  return (
    <section className="dp-sec dp-guide-page">
      <header className="dp-head"><div><span className="sh-en">For Drivers</span><h1>기사님 안내</h1></div></header>
      <div className="dp-gd-hero"><span className="dp-gd-hero__ic"><Truck /></span><div><b>삼원종합물류 임직원 일동</b><p>{g.greeting}</p></div></div>
      <CheckReminder />

      <h2 className="dp-gd-h"><Shield /> 안전운행 수칙</h2>
      <div className="dp-gd-grid">{(g.safety || []).map((s, i) => <div className="dp-gd-card" key={i}><h3><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</h3><ul>{s.items.map((x, k) => <li key={k}>{x}</li>)}</ul></div>)}</div>

      <h2 className="dp-gd-h"><Check /> 기사님이 꼭 지켜야 할 법정 의무</h2>
      <div className="dp-gd-duty">{(g.duties || []).map((x, i) => <div key={i}><b>{x.title}</b><p>{x.desc}</p><small>{x.law}</small></div>)}</div>

      <div className="dp-gd-two">
        <div className="dp-gd-box dp-gd-box--red">
          <h2 className="dp-gd-h">🚨 사고 발생 시 조치 순서</h2>
          <p className="dp-gd-intro">{g.emergency?.intro}</p>
          <ol className="dp-gd-steps">{(g.emergency?.steps || []).map((x, i) => <li key={i}>{x}</li>)}</ol>
          <div className="dp-gd-contacts">{(g.emergency?.contacts || []).map((x, i) => <a key={i} href={/^[\d-]+$/.test(x.value) ? `tel:${x.value}` : undefined}><span>{x.label}</span><b>{x.value}</b></a>)}</div>
        </div>
        <div className="dp-gd-box">
          <h2 className="dp-gd-h">💙 기사님 건강 관리</h2>
          <ul className="dp-gd-health">{(g.health || []).map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
