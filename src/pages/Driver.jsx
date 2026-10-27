import { useState } from 'react'
import PageHead from '../components/PageHead'
import { useContent } from '../context/ContentContext'
import { Check, Phone, ArrowRight } from '../components/Icons'

/**
 * 차주 전용 페이지
 * - company.driverApi 에 로그인 API 주소를 넣으면 해당 API로 POST { id, password } 요청 후 응답의 redirectUrl 로 이동합니다.
 * - API 연동 전에는 안내 메시지만 표시합니다. 외부 시스템(URL)으로 바로 보내려면 company.driverUrl 에 https:// 주소를 넣으십시오.
 */
export default function Driver() {
  const { content: c } = useContent()
  const co = c.company; const r = c.recruitment; const d = c.portals.driver
  const [f, setF] = useState({ id: '', password: '' })
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setMsg('')
    if (!co.driverApi) { setMsg('차주 전용 시스템 연동 준비 중입니다. 운송료 내역 등 문의는 대표번호로 연락 주십시오.'); return }
    try {
      setBusy(true)
      const res = await fetch(co.driverApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j.redirectUrl) { window.location.href = j.redirectUrl; return }
      setMsg(j.message || '아이디 또는 비밀번호를 확인해 주십시오.')
    } catch { setMsg('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주십시오.') } finally { setBusy(false) }
  }
  return (
    <>
      <PageHead label="DRIVER PARTNERS" title={d.title} desc={d.desc} image="img/banner_business.jpg" crumb={['차주 전용']} />
      <section className="section">
        <div className="wrap contact-grid">
          <div data-reveal="">
            <span className="eyebrow">PARTNER BENEFITS</span>
            <h2 className="h-section">파트너 지원</h2>
            <ul className="check-list" style={{ marginTop: 20 }}>{r.driverBenefits.map((x, i) => <li key={i}><Check />{x}</li>)}</ul>
            <h3 className="h-sub" style={{ margin: '36px 0 12px' }}>지원 자격</h3>
            <ul className="check-list">{r.driverRequirements.map((x, i) => <li key={i}><Check />{x}</li>)}</ul>
            <a className="btn btn--ghost" href={`tel:${co.phone}`} style={{ marginTop: 24 }}><Phone /> 배차 문의 {co.phone}</a>
          </div>
          <form className="form" onSubmit={submit} data-reveal="">
            <h3 className="h-sub">차주 전용 시스템 로그인</h3>
            <p className="small">운송료 내역서 조회, 배차 확인, 정산 안내를 위한 차주 전용 공간입니다.</p>
            <label>아이디<input required value={f.id} onChange={e => setF({ ...f, id: e.target.value })} placeholder="차량번호 또는 아이디" autoComplete="username" /></label>
            <label>비밀번호<input required type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></label>
            {msg && <div className="notice">{msg}</div>}
            <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? '확인 중…' : '로그인'} <ArrowRight /></button>
            <p className="small muted">계정 발급·비밀번호 문의: {co.phone}</p>
          </form>
        </div>
      </section>
    </>
  )
}
