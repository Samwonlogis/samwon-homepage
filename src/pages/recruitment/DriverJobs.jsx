import { useEffect, useState } from 'react'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { verifyStaffLogin } from '../../data/staffAccounts'
import { publishContent, getPublishKey } from '../../utils/publish'
import { Phone, X, Truck, Pin, Clock, Chart } from '../../components/Icons'

const NAV = [{ to: '/recruitment/talent', label: '인재상' }, { to: '/recruitment/jobs', label: '차주구인' }]
const STORE_KEY = 'samwon_driver_jobs_v2'
const SESSION_KEY = 'samwon_staff_session'
const EMPTY = { title: '', type: '일자리', income: '', vehicle: '', location: '', hours: '', desc: '', contactPerson: '', contactPhone: '02-598-3001' }

export default function DriverJobs() {
  const { content: c, updateContent } = useContent(); const r = c.recruitment
  const [postings, setPostings] = useState(null)
  const [filter, setFilter] = useState('전체')
  const [staff, setStaff] = useState(() => { try { const s = sessionStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null } catch { return null } })
  const [loginOpen, setLoginOpen] = useState(false)
  const [login, setLogin] = useState({ id: '', password: '' }); const [loginErr, setLoginErr] = useState(''); const [busy, setBusy] = useState(false)
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null); const [form, setForm] = useState(EMPTY)
  const [pubBusy, setPubBusy] = useState(false); const [pending, setPending] = useState(false)

  useEffect(() => {
    setPostings(r.driverJobs || [])
  }, [r.driverJobs])
  // 공고는 콘텐츠(recruitment.driverJobs)에 저장 → 「전체 반영」 시 모든 방문자에게 공개
  const save = (list) => {
    setPostings(list); setPending(true)
    try { localStorage.removeItem(STORE_KEY) } catch {}
    updateContent({ ...c, recruitment: { ...r, driverJobs: list } })
  }
  const publishJobs = async () => {
    if (!confirm('현재 공고 목록을 홈페이지 전체에 반영하시겠습니까?')) return
    setPubBusy(true)
    try { await publishContent({ ...c, recruitment: { ...r, driverJobs: postings } }, '차주구인 공고 반영'); setPending(false); alert('반영 요청이 완료되었습니다. 1~2분 후 모든 방문자에게 적용됩니다.') }
    catch (e) { alert(e.message) } finally { setPubBusy(false) }
  }

  const doLogin = async (e) => {
    e.preventDefault(); setLoginErr('')
    if (!login.id || !login.password) { setLoginErr('아이디와 비밀번호를 입력해 주십시오.'); return }
    setBusy(true); const u = await verifyStaffLogin(login.id, login.password, c.staffAccounts); setBusy(false)
    if (!u) { setLoginErr('아이디 또는 비밀번호가 일치하지 않습니다.'); return }
    setStaff(u); sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)); setLoginOpen(false); setLogin({ id: '', password: '' })
  }
  const logout = () => { setStaff(null); sessionStorage.removeItem(SESSION_KEY) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setModal(true) }
  const remove = (id) => { if (window.confirm('이 구인 공고를 삭제하시겠습니까?')) save(postings.filter(p => p.id !== id)) }
  const submit = (e) => {
    e.preventDefault()
    if (!form.title || !form.income || !form.vehicle || !form.location) { alert('필수 항목을 입력해 주십시오.'); return }
    if (editing) save(postings.map(p => p.id === editing.id ? { ...form, id: editing.id } : p))
    else save([{ ...form, id: Date.now().toString() }, ...postings])
    setModal(false)
  }
  const list = (postings || []).filter(p => filter === '전체' || p.type === filter)
  const F = ({ k, label, ph, req, full }) => (
    <label className={full ? 'full' : ''}>{label}{req && ' *'}<input required={req} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} /></label>
  )

  return (
    <>
      <PageHead label="DRIVER RECRUIT" title="차주구인" desc={r.driverIntro} image="img/banner_drivers.jpg" crumb={['채용정보', '차주구인']} subnav={NAV} />
      <section className="section">
        <div className="wrap">
          <div className="jobs__head" data-reveal="">
            <div>
              <h2 className="h-section" style={{ marginTop: 0 }}>차주 파트너 모집 공고</h2>
              <p className="lead" style={{ marginTop: 10 }}>고정 노선·안정 물량·투명 정산 기반의 차주 파트너십 기회를 확인하십시오.</p>
            </div>
            <div className="jobs__tools">
              {staff
                ? <div className="staff-chip"><b>{staff.name}</b>{staff.role === 'admin' && <span className="chip">관리자</span>}<button type="button" onClick={logout}>로그아웃</button></div>
                : <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setLoginOpen(true); setLoginErr('') }}>직원 로그인</button>}
              {staff && <button type="button" className="btn btn--primary btn--sm" onClick={openAdd}>+ 새 공고 등록</button>}
            </div>
          </div>

          <div className="filters" data-reveal="">
            {['전체', '일자리', '차량분양'].map(t => <button type="button" key={t} className={filter === t ? 'is-on' : ''} onClick={() => setFilter(t)}>{t}</button>)}
          </div>

          <div className="jobs">
            {postings === null ? null : list.length === 0
              ? <div className="jobs__empty">등록된 공고가 없습니다.</div>
              : list.map((p, i) => (
                <article className="jobcard" key={p.id} data-reveal="" style={{ transitionDelay: `${(i % 2) * .08}s` }}>
                  <span className={`jobcard__badge ${p.type === '차량분양' ? 'is-sale' : ''}`}>{p.type}</span>
                  <h3>{p.title}</h3>
                  <dl className="jobcard__info">
                    <div><dt><Chart /> 급여 / 수입</dt><dd>{p.income}</dd></div>
                    <div><dt><Truck /> 운송 차량</dt><dd>{p.vehicle}</dd></div>
                    <div className="full"><dt><Pin /> 노선 / 지역</dt><dd>{p.location}</dd></div>
                    <div className="full"><dt><Clock /> 근무 시간</dt><dd>{p.hours}</dd></div>
                  </dl>
                  {p.desc && <p className="jobcard__desc">{p.desc}</p>}
                  <div className="jobcard__foot">
                    <div className="jobcard__contact"><span>담당자 {p.contactPerson}</span><b>{p.contactPhone}</b></div>
                    {staff
                      ? <div style={{ display: 'flex', gap: 6 }}><button type="button" className="ed__mini" onClick={() => openEdit(p)}>수정</button><button type="button" className="ed__mini ed__mini--danger" onClick={() => remove(p.id)}>삭제</button></div>
                      : <a className="btn btn--primary btn--sm" href={`tel:${p.contactPhone}`}><Phone /> 전화지원</a>}
                  </div>
                </article>
              ))}
          </div>

          {staff && (
            <div className="jobs-publish">
              <div><b>공고 반영 안내</b><span>{pending ? '변경된 공고가 있습니다. 「홈페이지 전체 반영」을 눌러야 모든 방문자에게 공개됩니다.' : '등록·수정한 공고는 「홈페이지 전체 반영」 후 모든 방문자에게 공개됩니다.'}</span></div>
              {getPublishKey()
                ? <button type="button" className="btn btn--primary btn--sm" onClick={publishJobs} disabled={pubBusy}>{pubBusy ? '반영 중…' : '홈페이지 전체 반영'}</button>
                : <span className="small muted">이 PC에는 반영 키가 등록되어 있지 않습니다. 관리자에게 반영을 요청하십시오.</span>}
            </div>
          )}
        </div>
      </section>

      {/* 공고 등록/수정 모달 */}
      {modal && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__bg" onClick={() => setModal(false)} />
          <form className="modal__box" onSubmit={submit}>
            <div className="modal__head"><h3>{editing ? '공고 내용 수정' : '신규 구인공고 등록'}</h3><button type="button" className="burger" onClick={() => setModal(false)} aria-label="닫기"><X /></button></div>
            <div className="modal__body form" style={{ border: 0, borderRadius: 0 }}>
              <div className="row">
                <label>공고 분류 *<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>일자리</option><option>차량분양</option></select></label>
                <F k="income" label="급여 / 월수입" ph="예: 월 500만원 완제" req />
              </div>
              <F k="title" label="공고 제목" ph="구인공고 제목" req />
              <div className="row"><F k="vehicle" label="운송 차량 정보" ph="예: 5톤 윙바디" req /><F k="location" label="운송 노선 / 근무지" ph="예: 수도권 센터 ~ 경기 전역" req /></div>
              <div className="row"><F k="hours" label="근무 시간 및 근무일" ph="예: 08:00 ~ 18:00 (주 5일)" /><F k="contactPerson" label="담당자 성함" ph="예: 배차 담당" /></div>
              <F k="contactPhone" label="담당자 연락처" ph="02-598-3001" />
              <label>상세 업무 및 안내 사항<textarea rows="4" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="운송 조건, 상하차 방식, 정산 방식 등" /></label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button type="button" className="btn btn--ghost btn--sm" onClick={() => setModal(false)}>취소</button><button type="submit" className="btn btn--primary btn--sm">{editing ? '수정 완료' : '등록 완료'}</button></div>
            </div>
          </form>
        </div>
      )}

      {/* 직원 로그인 모달 */}
      {loginOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__bg" onClick={() => setLoginOpen(false)} />
          <form className="modal__box modal__box--sm" onSubmit={doLogin}>
            <div className="modal__head"><h3>직원 로그인</h3><button type="button" className="burger" onClick={() => setLoginOpen(false)} aria-label="닫기"><X /></button></div>
            <div className="modal__body form" style={{ border: 0, borderRadius: 0 }}>
              <p className="small">차주구인 공고 등록·수정은 삼원종합물류 임직원 전용 기능입니다.</p>
              <label>아이디<input value={login.id} onChange={e => setLogin({ ...login, id: e.target.value })} autoComplete="username" /></label>
              <label>비밀번호<input type="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} autoComplete="current-password" /></label>
              {loginErr && <p className="small" style={{ color: '#c0392b' }}>{loginErr}</p>}
              <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? '확인 중…' : '로그인'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
