import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import * as api from '../../driver/api'
import { thisMonth, prevMonth } from '../../driver/mock'
import { ArrowRight, Phone } from '../../components/Icons'

const { won, fmtMonth, fmtDate } = api
const MENUS = [
  { to: '/driver/statements', label: '운송료내역서', en: 'Statements', d: 'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5' },
  { to: '/driver/deductions', label: '보험 · 할부 · 공과금', short: '보험/할부/공과금', en: 'Deductions', d: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z M9 12l2 2 4-4' },
  { to: '/driver/board', label: '게시판', en: 'Board', d: 'M4 5h16v11H8l-4 3z M8 9h8 M8 12h5' },
]
const Ic = ({ d }) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>

function useDriverApi() { const { content } = useContent(); api.configure(content.company.driverApi); return content }

/* ───────── 로그인 화면 (/driver) ───────── */
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
          <p>운송료내역서 조회, 보험·할부·공과금 확인, 차주 공지와 구인 정보를 한곳에서 확인하는 차주 전용 공간입니다.</p>
          <ul className="dp-login__feat">
            {MENUS.map(m => <li key={m.to}><Ic d={m.d} /><b>{m.label}</b></li>)}
          </ul>
          <ul className="check-list dp-login__benefit">{(r.driverBenefits || []).slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
        <form className="dp-card dp-login__form" onSubmit={submit} data-reveal="">
          <h2>로그인</h2>
          {api.isDemo() && <div className="dp-demo">연동 전 <b>예시 화면</b>입니다. 차량번호를 입력하고 비밀번호 <b>1234</b>로 로그인하면 예시 데이터를 볼 수 있습니다.</div>}
          <label>차량번호<input required value={f.vehicleNo} onChange={e => setF({ ...f, vehicleNo: e.target.value })} placeholder="차량번호 전체 입력 (예: 경기12바3456)" autoComplete="username" inputMode="text" /></label>
          <label>비밀번호<input required type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="비밀번호 입력" autoComplete="current-password" /></label>
          <label className="dp-check"><input type="checkbox" checked={f.remember} onChange={e => setF({ ...f, remember: e.target.checked })} /> 로그인 상태 유지</label>
          {msg && <div className="notice dp-err">{msg}</div>}
          <button className="btn btn--primary dp-btn" type="submit" disabled={busy}>{busy ? '확인 중…' : '로그인'} <ArrowRight /></button>
          <p className="small muted">비밀번호 분실·계정 문의: <a href={`tel:${co.phone}`}>{co.phone}</a> (관리팀)</p>
          {co.driverLegacyUrl && <a className="dp-legacy" href={co.driverLegacyUrl}>기존 차주정보 사이트로 이동 →</a>}
        </form>
      </div>
    </section>
  )
}

/* ───────── 포털 공통 레이아웃 (로그인 필요) ───────── */
export function DriverShell() {
  const c = useDriverApi(); const nav = useNavigate(); const loc = useLocation()
  const s = api.getSession()
  useEffect(() => { document.title = '차주정보 | 삼원종합물류㈜'; window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => { document.body.dataset.portal = '1'; return () => { delete document.body.dataset.portal } }, [])
  if (!s) return <Navigate to="/driver" replace state={{ from: loc.pathname }} />
  const out = async () => { await api.logout(); nav('/driver', { replace: true }) }
  return (
    <div className="dp">
      <div className="dp-top">
        <div className="wrap dp-top__in">
          <div className="dp-top__who">
            <span className="dp-top__avatar">{s.driver.name?.[0] || '차'}</span>
            <div><b>{s.driver.name} 기사님</b><span>{s.driver.vehicleNo} · {s.driver.tonnage}{s.driver.company ? ` · ${s.driver.company}` : ''}</span></div>
          </div>
          <nav className="dp-tabs" aria-label="차주정보 메뉴">
            {MENUS.map(m => <NavLink key={m.to} to={m.to}><Ic d={m.d} /><span>{m.label}</span></NavLink>)}
          </nav>
          <div className="dp-top__act">
            <a href={`tel:${c.company.phone}`} className="dp-top__tel"><Phone /> {c.company.phone}</a>
            <button type="button" onClick={out}>로그아웃</button>
          </div>
        </div>
      </div>
      {api.isDemo() && <div className="dp-demo dp-demo--bar">연동 전 예시 데이터입니다. 실제 운송료·공제 내역과 다릅니다.</div>}
      <div className="wrap dp-body"><Outlet context={{ driver: s.driver, company: c.company }} /></div>
      <nav className="dp-mtabs" aria-label="차주정보 하단 메뉴">
        {MENUS.map(m => <NavLink key={m.to} to={m.to}><Ic d={m.d} /><span>{m.short || m.label}</span></NavLink>)}
      </nav>
    </div>
  )
}

/* ───────── 공통: 월 선택 ───────── */
function MonthPicker({ value, onChange }) {
  const months = useMemo(() => Array.from({ length: 13 }, (_, i) => prevMonth(thisMonth(), i)), [])
  const i = months.indexOf(value)
  return (
    <div className="dp-month">
      <button type="button" onClick={() => onChange(prevMonth(value, 1))} aria-label="이전 달">‹</button>
      <select value={value} onChange={e => onChange(e.target.value)} aria-label="조회 월">{months.map(m => <option key={m} value={m}>{fmtMonth(m)}</option>)}{i < 0 && <option value={value}>{fmtMonth(value)}</option>}</select>
      <button type="button" onClick={() => onChange(prevMonth(value, -1))} disabled={value >= thisMonth()} aria-label="다음 달">›</button>
    </div>
  )
}
function useLoad(fn, deps) {
  const [st, set] = useState({ loading: true, data: null, error: '' })
  useEffect(() => { let on = true; set(s => ({ ...s, loading: true, error: '' })); fn().then(d => on && set({ loading: false, data: d, error: '' })).catch(e => on && set({ loading: false, data: null, error: e.message })); return () => { on = false } }, deps) // eslint-disable-line
  return st
}
const State = ({ st, children }) => st.loading ? <div className="dp-state">불러오는 중…</div> : st.error ? <div className="dp-state dp-state--err">{st.error}</div> : children

/* ───────── 운송료내역서 ───────── */
export function Statements() {
  const [sp, setSp] = useSearchParams(); const month = sp.get('m') || thisMonth()
  const setMonth = (m) => setSp({ m })
  const st = useLoad(() => api.getStatement(month), [month])
  const d = st.data
  return (
    <section className="dp-sec">
      <header className="dp-head">
        <div><span className="sh-en">Statements</span><h1>운송료내역서</h1></div>
        <div className="dp-head__tools"><MonthPicker value={month} onChange={setMonth} /><button type="button" className="dp-print" onClick={() => window.print()}>인쇄 · PDF 저장</button></div>
      </header>
      <State st={st}>{d && (<>
        <div className="dp-sum">
          <div className="dp-sum__item"><span>운송 건수</span><b>{d.summary.count}<small>건</small></b></div>
          <div className="dp-sum__item"><span>운송료 합계</span><b>{won(d.summary.fareTotal)}</b></div>
          <div className="dp-sum__item"><span>부가세</span><b>{won(d.summary.vat)}</b></div>
          <div className="dp-sum__item"><span>공제 합계</span><b className="dp-minus">- {won(d.summary.deductions)}</b><Link to={`/driver/deductions?m=${month}`}>내역 보기</Link></div>
          <div className="dp-sum__item dp-sum__item--net"><span>실지급액</span><b>{won(d.summary.net)}</b><em>{d.summary.status} · 지급(예정)일 {fmtDate(d.summary.payDate)}</em></div>
        </div>
        <div className="dp-table-wrap">
          <table className="dp-table">
            <thead><tr><th>일자</th><th>상차지</th><th>하차지</th><th>화물</th><th className="num">운송료</th><th className="num">추가</th><th>비고</th></tr></thead>
            <tbody>
              {d.trips.length === 0 && <tr><td colSpan="7" className="dp-empty">해당 월 운송 내역이 없습니다.</td></tr>}
              {d.trips.map(t => <tr key={t.id}><td data-l="일자">{fmtDate(t.date).slice(5)}</td><td data-l="상차지">{t.from}</td><td data-l="하차지">{t.to}</td><td data-l="화물">{t.cargo}</td><td data-l="운송료" className="num">{won(t.fare)}</td><td data-l="추가" className="num">{t.extra ? won(t.extra) : '-'}</td><td data-l="비고" className="muted">{t.note || ''}</td></tr>)}
            </tbody>
            <tfoot><tr><td colSpan="4">합계 ({d.summary.count}건)</td><td className="num">{won(d.trips.reduce((s, t) => s + t.fare, 0))}</td><td className="num">{won(d.trips.reduce((s, t) => s + t.extra, 0))}</td><td /></tr></tfoot>
          </table>
        </div>
        <p className="small muted dp-foot">운송료 내역에 이의가 있으시면 지급일 전까지 배차 담당자 또는 관리팀으로 연락 주십시오. 본 내역서는 세금계산서 발행 기준 자료입니다.</p>
      </>)}</State>
    </section>
  )
}

/* ───────── 보험 · 할부 · 공과금 ───────── */
export function Deductions() {
  const [sp, setSp] = useSearchParams(); const month = sp.get('m') || thisMonth()
  const st = useLoad(() => api.getDeductions(month), [month])
  const d = st.data; const cats = ['보험', '할부', '공과금', '지입료']
  return (
    <section className="dp-sec">
      <header className="dp-head">
        <div><span className="sh-en">Deductions</span><h1>보험 · 할부 · 공과금</h1></div>
        <div className="dp-head__tools"><MonthPicker value={month} onChange={m => setSp({ m })} /><button type="button" className="dp-print" onClick={() => window.print()}>인쇄 · PDF 저장</button></div>
      </header>
      <State st={st}>{d && (<>
        <div className="dp-sum">
          {cats.filter(k => d.totals[k] != null).map(k => <div className="dp-sum__item" key={k}><span>{k}</span><b>{won(d.totals[k])}</b></div>)}
          <div className="dp-sum__item dp-sum__item--net"><span>이달 공제 합계</span><b>{won(d.total)}</b><em>운송료에서 공제 후 지급</em></div>
        </div>
        <div className="dp-table-wrap">
          <table className="dp-table">
            <thead><tr><th>구분</th><th>항목</th><th className="num">금액</th><th>납부일</th><th>상태</th><th>비고</th></tr></thead>
            <tbody>{d.items.map((x, i) => <tr key={i}><td data-l="구분"><span className={`dp-cat dp-cat--${cats.indexOf(x.category)}`}>{x.category}</span></td><td data-l="항목">{x.title}</td><td data-l="금액" className="num">{x.amount ? won(x.amount) : '-'}</td><td data-l="납부일">{fmtDate(x.dueDate)}</td><td data-l="상태"><span className={`dp-status ${x.status.includes('완료') ? 'is-ok' : x.status.includes('예정') ? 'is-due' : ''}`}>{x.status}</span></td><td data-l="비고" className="muted">{x.note}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="small muted dp-foot">보험 갱신, 할부 완납, 공과금 이의 신청은 관리팀으로 문의해 주십시오. 과태료·범칙금은 통지서 수령 후 익월 운송료에서 공제됩니다.</p>
      </>)}</State>
    </section>
  )
}

/* ───────── 게시판 ───────── */
const CATS = ['전체', '공지', '차주구인', '자료']
export function Board() {
  const [sp, setSp] = useSearchParams(); const cat = sp.get('c') || '전체'; const q = sp.get('q') || ''
  const [kw, setKw] = useState(q)
  const st = useLoad(() => api.getPosts({ category: cat === '전체' ? '' : cat, q }), [cat, q])
  return (
    <section className="dp-sec">
      <header className="dp-head">
        <div><span className="sh-en">Board</span><h1>게시판</h1></div>
        <form className="dp-search" onSubmit={e => { e.preventDefault(); setSp({ c: cat, q: kw }) }}><input value={kw} onChange={e => setKw(e.target.value)} placeholder="제목 검색" /><button type="submit">검색</button></form>
      </header>
      <div className="dp-cats">{CATS.map(k => <button key={k} type="button" className={k === cat ? 'is-on' : ''} onClick={() => setSp({ c: k })}>{k}</button>)}</div>
      <State st={st}>{st.data && (
        <ul className="dp-posts">
          {st.data.items.length === 0 && <li className="dp-empty">게시글이 없습니다.</li>}
          {st.data.items.map(p => (
            <li key={p.id} className={p.pinned ? 'is-pinned' : ''}>
              <Link to={`/driver/board/${p.id}`}>
                <span className={`dp-cat dp-cat--${p.category === '차주구인' ? 'job' : p.category === '공지' ? 'notice' : 'doc'}`}>{p.category}</span>
                <b>{p.pinned && <i className="dp-pin">필독</i>}{p.title}</b>
                <span className="dp-posts__meta">{p.author} · {fmtDate(p.date)} · 조회 {p.views}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}</State>
    </section>
  )
}
export function Post() {
  const { id } = useParams(); const st = useLoad(() => api.getPost(id), [id]); const p = st.data
  return (
    <section className="dp-sec">
      <State st={st}>{p && (
        <article className="dp-post">
          <header><span className={`dp-cat dp-cat--${p.category === '차주구인' ? 'job' : p.category === '공지' ? 'notice' : 'doc'}`}>{p.category}</span><h1>{p.title}</h1><p>{p.author} · {fmtDate(p.date)} · 조회 {p.views}</p></header>
          <div className="dp-post__body">{String(p.body || '').split('\n').map((l, i) => <p key={i}>{l || ' '}</p>)}</div>
          {p.attachments?.length > 0 && <ul className="dp-post__files">{p.attachments.map((a, i) => <li key={i}><a href={a.url} target="_blank" rel="noreferrer">{a.name}</a></li>)}</ul>}
          <footer><Link to="/driver/board" className="btn btn--ghost">목록으로</Link>{p.category === '차주구인' && <a className="btn btn--primary" href="tel:02-598-3001"><Phone /> 배차팀 문의</a>}</footer>
        </article>
      )}</State>
    </section>
  )
}
