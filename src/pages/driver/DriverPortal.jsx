import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import * as api from '../../driver/api'
import { ArrowRight, Phone, Truck, Shield, Check } from '../../components/Icons'

const { won, fmtDate } = api
const num = (n) => (n == null || n === '' ? '' : Number(n).toLocaleString('ko-KR'))
const ymLabel = (ym = '') => { const [y, m] = ym.split('-'); return `${String(y).slice(2)}년 ${Number(m)}월` }
const MENUS = [
  { to: '/driver/statements', label: '운송료내역서', d: 'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5' },
  { to: '/driver/insurance', label: '보험 / 할부 / 공과금', short: '보험/할부/공과금', d: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z M9 12l2 2 4-4' },
  { to: '/driver/board', label: '게시판', d: 'M4 5h16v11H8l-4 3z M8 9h8 M8 12h5' },
  { to: '/driver/guide', label: '기사님 안내', short: '안내', d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M12 8v5 M12 16h.01' },
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

/* ───────── 포털 공통 레이아웃: 상단 바 + 좌측 메뉴/검사알림 + 본문 ───────── */
export function DriverShell() {
  const c = useDriverApi(); const nav = useNavigate(); const loc = useLocation()
  const s = api.getSession()
  useEffect(() => { document.title = '차주정보 | 삼원종합물류㈜'; window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => { document.body.dataset.portal = '1'; return () => { delete document.body.dataset.portal } }, [])
  if (!s) return <Navigate to="/driver" replace state={{ from: loc.pathname }} />
  const d = s.driver; const ins = d.inspection || {}
  const out = async () => { await api.logout(); nav('/driver', { replace: true }) }
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
      <ThanksBar name={d.name} msgs={c.driverGuide?.thanks} />
      <div className="wrap dp-body dp-body--side">
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
        <main className="dp-main"><Outlet context={{ driver: d, company: c.company }} /></main>
      </div>
      <nav className="dp-mtabs" aria-label="차주정보 하단 메뉴">{MENUS.map(m => <NavLink key={m.to} to={m.to}><Ic d={m.d} /><span>{m.short || m.label}</span></NavLink>)}</nav>
    </div>
  )
}

/* 감사 문구 띠 — 날짜 기준으로 문구 순환 */
function ThanksBar({ name, msgs = [] }) {
  if (!msgs.length) return null
  const i = Math.floor(Date.now() / 86400000) % msgs.length
  return <div className="dp-thanks"><div className="wrap dp-thanks__in"><span className="dp-thanks__ic"><Check /></span><p><b>{name} 기사님,</b> {msgs[i]}</p><Link to="/driver/guide">기사님 안내 <ArrowRight /></Link></div></div>
}

/* ───────── 기사님 안내 (감사·안전·법정 의무·비상·건강·점검) ───────── */
export function Guide() {
  const { content: c } = useContent(); const g = c.driverGuide || {}
  const [done, setDone] = useState(() => { try { return JSON.parse(sessionStorage.getItem('samwon_dp_check') || '[]') } catch { return [] } })
  const toggle = (i) => { const n = done.includes(i) ? done.filter(x => x !== i) : [...done, i]; setDone(n); try { sessionStorage.setItem('samwon_dp_check', JSON.stringify(n)) } catch {} }
  return (
    <section className="dp-sec dp-guide-page">
      <header className="dp-head"><div><span className="sh-en">For Drivers</span><h1>기사님 안내</h1></div></header>
      <div className="dp-gd-hero"><span className="dp-gd-hero__ic"><Truck /></span><div><b>삼원종합물류 임직원 일동</b><p>{g.greeting}</p></div></div>

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
          <h2 className="dp-gd-h" style={{ marginTop: 22 }}>✅ 오늘의 운행 전 점검 <small>{done.length}/{(g.checklist || []).length}</small></h2>
          <ul className="dp-gd-check">{(g.checklist || []).map((x, i) => <li key={i} className={done.includes(i) ? 'is-done' : ''}><label><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /><span>{x}</span></label></li>)}</ul>
          <p className="small muted">점검 표시는 이 기기에서만 오늘 하루 유지되며 회사로 전송되지 않습니다.</p>
        </div>
      </div>
    </section>
  )
}

/* ───────── 운송료내역서 — 월별 목록 ───────── */
export function Statements() {
  const [sp, setSp] = useSearchParams(); const page = Math.max(1, Number(sp.get('p') || 1))
  const st = useLoad(() => api.getStatementList(page), [page]); const d = st.data
  return (
    <section className="dp-sec">
      <header className="dp-head"><div><span className="sh-en">Statements</span><h1>운송료내역서</h1></div>{d && <span className="dp-head__page">Page ( {d.page} / {d.pages} )</span>}</header>
      <State st={st}>{d && (<>
        {d.page === 1 && d.items[0] && (
          <div className="dp-hl">
            <div className="dp-hl__main"><span>최근 지급월 · {ymLabel(d.items[0].month)}</span><b>{won(d.items[0].net)}</b><em>지급일 {fmtDate(d.items[0].payDate)} · {d.items[0].client}</em><Link className="dp-hl__btn" to={`/driver/statements/${d.items[0].month}`}>내역서 보기 <ArrowRight /></Link></div>
            <div className="dp-hl__sub"><div><span>운송료계</span><b>{won(d.items[0].fare)}</b></div><div><span>부가세</span><b>{won(d.items[0].vat)}</b></div><div><span>공제계</span><b className="dp-minus">- {won(d.items[0].deductions)}</b></div></div>
          </div>
        )}
        <div className="dp-table-wrap">
          <table className="dp-table dp-table--grid">
            <thead><tr><th>번호</th><th>지급월</th><th>근무업체</th><th className="num">운송료계</th><th className="num">부가세</th><th className="num">공제계</th><th className="num">지급계</th></tr></thead>
            <tbody>
              {d.items.length === 0 && <tr><td colSpan="7" className="dp-empty">내역이 없습니다.</td></tr>}
              {d.items.map((r, i) => (
                <tr key={r.month}>
                  <td data-l="번호" className="num muted">{(d.page - 1) * 10 + i + 1}</td>
                  <td data-l="지급월"><Link className="dp-month-btn" to={`/driver/statements/${r.month}`}><b>{ymLabel(r.month)}</b><small>{(r.payDate || r.month).replace(/-/g, '.')}</small></Link></td>
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
        <p className="small muted dp-foot">지급월을 누르면 해당 월의 운송비 내역서(공제·유류비·세금계산서·과태 내역 포함)를 확인하고 출력할 수 있습니다.</p>
      </>)}</State>
    </section>
  )
}

/* ───────── 운송료내역서 — 월 상세(운송비 내역서) ───────── */
const Row = ({ k, v, strong, blank }) => <tr className={blank ? 'is-blank' : ''}><th>{k}</th><td className={`num ${strong ? 'dp-strong' : ''}`}>{v}</td></tr>
export function StatementDetail() {
  const { month } = useParams(); const nav = useNavigate()
  const st = useLoad(() => api.getStatement(month), [month]); const d = st.data
  const rows = (arr, n) => [...arr, ...Array.from({ length: Math.max(0, n - arr.length) }, () => null)]
  return (
    <section className="dp-sec dp-sheet-wrap">
      <State st={st}>{d && (<>
        <div className="dp-sheet-tools"><button type="button" className="dp-print" onClick={() => nav('/driver/statements')}>리스트</button><button type="button" className="dp-print dp-print--main" onClick={() => window.print()}>프린트 · PDF</button></div>
        <article className="dp-sheet">
          <h1 className="dp-sheet__title">{ymLabel(d.month)} 운송비 내역서</h1>
          <table className="dp-sheet__head">
            <tbody>
              <tr><th rowSpan="4" className="dp-sheet__rowhead">차량보험료<br />회차확인<br />/<br />공제항목<br />확인철저</th><td colSpan="2"><b>대표자명 :</b> {d.driver.name} 님</td></tr>
              <tr><td colSpan="2"><b>차량번호 :</b> {d.driver.vehicleNo}</td></tr>
              <tr><td><b>사업자번호 :</b> {d.driver.bizNo}</td><td><b>지급일 :</b> {fmtDate(d.payDate)}</td></tr>
              <tr><td><b>은 행 명 :</b> {d.driver.bank}</td><td><b>계좌번호 :</b> {d.driver.account}</td></tr>
              <tr><td colSpan="3" className="dp-sheet__check">▶ 차량번호, 사업자등록 번호, 계좌번호 확인 철저</td></tr>
            </tbody>
          </table>
          {d.notice && <p className="dp-sheet__notice">{d.notice}</p>}
          <div className="dp-sheet__cols">
            <table className="dp-sheet__t"><thead><tr><th colSpan="2">지급내역(공급가액)</th></tr></thead><tbody>
              {rows(d.income, 8).map((x, i) => x ? <Row key={i} k={x.title} v={num(x.amount)} /> : <Row key={i} k="" v="" blank />)}
              <Row k="부가세" v={num(d.taxInvoice?.vat)} />
              <tr className="dp-sheet__sum"><th>소득총계</th><td className="num">{num(d.totals.income)}</td></tr>
            </tbody></table>
            <table className="dp-sheet__t"><thead><tr><th colSpan="2">공제내역</th></tr></thead><tbody>
              {rows(d.deductions, 9).map((x, i) => x ? <Row key={i} k={x.title} v={num(x.amount)} /> : <Row key={i} k="" v="" blank />)}
              <tr className="dp-sheet__sum"><th>공제총계</th><td className="num">{num(d.totals.deductions)}</td></tr>
            </tbody></table>
            <table className="dp-sheet__t"><thead><tr><th colSpan="2">유류비정보</th></tr></thead><tbody>
              <Row k="유류비" v={num(d.fuel?.fuel ?? 0)} /><Row k="유류부가세" v={num(d.fuel?.vat ?? 0)} /><Row k="유류비합계" v={num(d.fuel?.total ?? 0)} />
              <tr className="dp-sheet__sub"><th colSpan="2">※ 공제보험료상세내역</th></tr>
              <Row k="보험사" v={d.insuranceDetail?.insurer || ''} /><Row k="회차(월)" v={d.insuranceDetail?.round || ''} /><Row k="공제분담보험기간" v={d.insuranceDetail?.period || ''} />
              <tr className="dp-sheet__sub"><th colSpan="2">※ 세금계산서발행내역(부가세)</th></tr>
              <Row k="공급가액" v={num(d.taxInvoice?.supply)} /><Row k="부가세" v={num(d.taxInvoice?.vat)} /><Row k="세금계산서총액" v={num(d.taxInvoice?.total)} />
              <tr className="dp-sheet__sum"><th>실지급액</th><td className="num dp-strong">{num(d.totals.net)}</td></tr>
            </tbody></table>
          </div>
          <table className="dp-sheet__box"><tbody><tr><th>공지사항</th><td>{d.noticeBox || ''}</td></tr></tbody></table>
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

/* ───────── 보험 / 할부 / 공과금 ───────── */
const KV = ({ rows }) => <table className="dp-kv"><tbody>{rows.map(([k, v], i) => <tr key={i}><th>{k}</th><td>{v == null || v === '' ? '' : v}</td></tr>)}</tbody></table>
export function Insurance() {
  const st = useLoad(() => api.getInsurance(), []); const d = st.data
  const w = (v) => (v == null || v === '' ? '' : `${num(v)} 원`)
  return (
    <section className="dp-sec">
      <header className="dp-head"><div><span className="sh-en">Insurance</span><h1>보험 / 할부 / 공과금</h1></div><button type="button" className="dp-print" onClick={() => window.print()}>인쇄 · PDF 저장</button></header>
      <State st={st}>{d && (<>
        <div className="dp-ins">
          <div className="dp-ins__box"><h3>1. 종합보험</h3><KV rows={[['가입보험사', d.liability?.insurer], ['계약기간', d.liability?.period], ['책임보험료', w(d.liability?.mandatoryPremium)], ['임의보험료', w(d.liability?.optionalPremium)], ['특성', d.liability?.rate], ['할증', d.liability?.surcharge], ['비고', d.liability?.note]]} /></div>
          <div className="dp-ins__box"><h3>2. 적재물보험</h3><KV rows={[['가입보험사', d.cargo?.insurer], ['계약기간', d.cargo?.period], ['연간보험총액', w(d.cargo?.annualTotal)], ['연간총보상한도', w(d.cargo?.annualLimit)], ['사고당보상한도', w(d.cargo?.perAccidentLimit)], ['자기부담금', w(d.cargo?.deductible)], ['납입일자', fmtDate(d.cargo?.payDate)]]} /></div>
          <div className="dp-ins__box">
            <h3>종합보험 납부일정</h3>
            {(d.schedule || []).length > 0 && (() => { const t = d.schedule.length, pd = d.schedule.filter(r => r.paid).length; return (
              <div className="dp-prog"><div className="dp-prog__bar"><i style={{ width: `${Math.round(pd / t * 100)}%` }} /></div><span>{pd} / {t}회 납부 완료 · 잔여 {num(d.schedule.filter(r => !r.paid).reduce((s, r) => s + (r.amount || 0), 0))}원</span></div>) })()}
            <table className="dp-table dp-table--grid dp-table--compact">
              <thead><tr><th>순번</th><th>납부일자</th><th className="num">금액</th><th>납부</th><th>비고</th></tr></thead>
              <tbody>{(d.schedule || []).map(r => <tr key={r.no}><td data-l="순번" className="num">{r.no}</td><td data-l="납부일자">{fmtDate(r.date)}</td><td data-l="금액" className="num">{num(r.amount)}</td><td data-l="납부" className="dp-star">{r.paid ? '★' : ''}</td><td data-l="비고">{r.note}</td></tr>)}</tbody>
              <tfoot><tr><td colSpan="2">합계</td><td className="num">{num((d.schedule || []).reduce((s, r) => s + (r.amount || 0), 0))}</td><td colSpan="2" /></tr></tfoot>
            </table>
          </div>
          <div className="dp-ins__box">
            <h3>3. 차량 할부</h3>
            {(d.installment || []).length === 0 ? <p className="dp-ins__none">할부 내역이 없습니다.</p> : (
              <table className="dp-table dp-table--grid dp-table--compact"><thead><tr><th>회차</th><th>납부일자</th><th className="num">금액</th><th>납부</th><th>비고</th></tr></thead>
                <tbody>{d.installment.map((r, i) => <tr key={i}><td data-l="회차" className="num">{r.no}</td><td data-l="납부일자">{fmtDate(r.date)}</td><td data-l="금액" className="num">{num(r.amount)}</td><td data-l="납부" className="dp-star">{r.paid ? '★' : ''}</td><td data-l="비고">{r.note}</td></tr>)}</tbody></table>)}
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
