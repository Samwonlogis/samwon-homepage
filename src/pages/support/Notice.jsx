import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams, Navigate, useNavigate } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { verifyStaffLogin } from '../../data/staffAccounts'
import { publishContent, publishFile, getPublishKey } from '../../utils/publish'
import { SUPPORT_NAV } from './supportNav'
import { ArrowRight, X } from '../../components/Icons'

const CATS = ['전체', '공지사항', '삼원소식', '자료실']
const catClass = (c) => c === '공지사항' ? 'nb-cat--notice' : c === '삼원소식' ? 'nb-cat--news' : 'nb-cat--doc'
const fmt = (d = '') => String(d).replace(/-/g, '.')
const today = () => new Date().toISOString().slice(0, 10)
const PER = 10
const SESSION_KEY = 'samwon_staff_session'
const EMPTY = { category: '공지사항', title: '', date: today(), pinned: '', body: '', link: '', attachments: [] }
const HEAD = { label: 'NOTICE', title: '공지사항', desc: '삼원종합물류의 공지사항과 소식, 자료를 안내합니다.', logo: true }
const sortAll = (list) => [...list].sort((a, b) => ((b.pinned === 'Y') - (a.pinned === 'Y')) || String(b.date).localeCompare(String(a.date)))

/* 직원(관리자) 세션 — 차주구인 페이지와 공유 */
function useStaff() {
  const [staff, setStaff] = useState(() => { try { const s = sessionStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null } catch { return null } })
  const login = (u) => { setStaff(u); sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)) }
  const logout = () => { setStaff(null); sessionStorage.removeItem(SESSION_KEY) }
  return { staff, login, logout }
}

/* 로그인 모달 */
function LoginModal({ onClose, onLogin, accounts }) {
  const [f, setF] = useState({ id: '', password: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (!f.id || !f.password) { setErr('아이디와 비밀번호를 입력해 주십시오.'); return }
    setBusy(true); const u = await verifyStaffLogin(f.id, f.password, accounts); setBusy(false)
    if (!u) { setErr('아이디 또는 비밀번호가 일치하지 않습니다.'); return }
    onLogin(u); onClose()
  }
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__bg" onClick={onClose} />
      <form className="modal__box modal__box--sm" onSubmit={submit}>
        <div className="modal__head"><h3>직원 로그인</h3><button type="button" className="burger" onClick={onClose} aria-label="닫기"><X /></button></div>
        <div className="modal__body form" style={{ border: 0, borderRadius: 0 }}>
          <p className="small">공지사항 등록⁠·수정⁠·삭제는 삼원종합물류 임직원 전용 기능입니다.</p>
          <label>아이디<input value={f.id} onChange={e => setF({ ...f, id: e.target.value })} autoComplete="username" /></label>
          <label>비밀번호<input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></label>
          {err && <p className="small" style={{ color: '#c0392b' }}>{err}</p>}
          <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? '확인 중…' : '로그인'}</button>
        </div>
      </form>
    </div>
  )
}

/* 글 작성·수정 모달 (첨부파일 업로드 포함) */
function PostModal({ initial, onClose, onSave }) {
  const [f, setF] = useState({ ...EMPTY, ...initial, attachments: initial?.attachments || [] })
  const [up, setUp] = useState(''); const canUpload = !!getPublishKey()
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const addFiles = async (e) => {
    const files = [...(e.target.files || [])]; e.target.value = ''
    for (const file of files) {
      try { setUp(`업로드 중… ${file.name}`); const a = await publishFile(file, 'notice'); setF(s => ({ ...s, attachments: [...s.attachments, a] })) }
      catch (err) { alert(err.message) }
    }
    setUp('')
  }
  const submit = (e) => { e.preventDefault(); if (!f.title.trim() || !f.body.trim()) { alert('제목과 본문을 입력해 주십시오.'); return } onSave(f) }
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__bg" onClick={onClose} />
      <form className="modal__box" onSubmit={submit}>
        <div className="modal__head"><h3>{initial?.id ? '글 수정' : '새 글 등록'}</h3><button type="button" className="burger" onClick={onClose} aria-label="닫기"><X /></button></div>
        <div className="modal__body form" style={{ border: 0, borderRadius: 0 }}>
          <div className="row">
            <label>분류 *<select value={f.category} onChange={set('category')}>{CATS.slice(1).map(c => <option key={c}>{c}</option>)}</select></label>
            <label>게시일 *<input type="date" value={f.date} onChange={set('date')} required /></label>
          </div>
          <label>제목 *<input value={f.title} onChange={set('title')} placeholder="글 제목" required /></label>
          <label>본문 *<textarea rows="9" value={f.body} onChange={set('body')} placeholder="내용을 입력하십시오. 줄바꿈이 그대로 표시됩니다." required /></label>
          <label>관련 링크 (선택)<input value={f.link} onChange={set('link')} placeholder="https:// 외부 링크가 있으면 입력" /></label>
          <div className="nb-attach">
            <div className="nb-attach__head"><b>첨부파일</b>{canUpload ? <label className="btn btn--ghost btn--sm nb-attach__btn">파일 올리기<input type="file" multiple hidden onChange={addFiles} accept=".pdf,.hwp,.hwpx,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.jpg,.jpeg,.png" /></label> : <span className="small muted">이 PC에 반영 키가 없어 파일 업로드는 할 수 없습니다(링크 첨부는 가능).</span>}</div>
            {up && <p className="small muted">{up}</p>}
            {f.attachments.length > 0 && <ul className="nb-attach__list">{f.attachments.map((a, i) => <li key={i}><span>{a.name}</span>{a.size ? <small>{(a.size / 1024 / 1024).toFixed(1)}MB</small> : null}<button type="button" onClick={() => setF({ ...f, attachments: f.attachments.filter((_, k) => k !== i) })} aria-label="첨부 제거">×</button></li>)}</ul>}
          </div>
          <label className="dp-check"><input type="checkbox" checked={f.pinned === 'Y'} onChange={e => setF({ ...f, pinned: e.target.checked ? 'Y' : '' })} /> 상단 고정(필독)</label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>취소</button><button type="submit" className="btn btn--primary btn--sm">{initial?.id ? '수정 완료' : '등록'}</button></div>
        </div>
      </form>
    </div>
  )
}

/* 직원 도구 모음 + 반영 안내 — 목록·상세 공통 */
function StaffBar({ staff, onLoginOpen, onLogout, onAdd, pending, onPublish, pubBusy, compact }) {
  return (
    <div className={`nb-staff ${compact ? 'nb-staff--compact' : ''}`}>
      {staff
        ? <>
            <div className="staff-chip"><b>{staff.name}</b>{staff.role === 'admin' && <span className="chip">관리자</span>}<button type="button" onClick={onLogout}>로그아웃</button></div>
            {onAdd && <button type="button" className="btn btn--primary btn--sm" onClick={onAdd}>+ 글쓰기</button>}
            {getPublishKey()
              ? <button type="button" className={`btn btn--sm ${pending ? 'btn--primary' : 'btn--ghost'}`} onClick={onPublish} disabled={pubBusy}>{pubBusy ? '반영 중…' : pending ? '홈페이지 전체 반영 (변경 있음)' : '홈페이지 전체 반영'}</button>
              : <span className="small muted">반영 키 미등록 PC — 등록⁠·삭제 내용은 관리자가 반영해야 공개됩니다.</span>}
          </>
        : <button type="button" className="btn btn--ghost btn--sm" onClick={onLoginOpen}>직원 로그인</button>}
    </div>
  )
}

function useNoticeAdmin() {
  const { content: c, updateContent } = useContent()
  const { staff, login, logout } = useStaff()
  const [loginOpen, setLoginOpen] = useState(false); const [modal, setModal] = useState(null)
  const [pending, setPending] = useState(false); const [pubBusy, setPubBusy] = useState(false)
  const save = (list) => { setPending(true); updateContent({ ...c, notices: list }) }
  const upsert = (f) => {
    const list = c.notices || []
    const item = { ...f, id: f.id || `n${Date.now()}` }
    save(f.id ? list.map(n => n.id === f.id ? item : n) : [item, ...list]); setModal(null); return item
  }
  const remove = (id) => { if (window.confirm('이 글을 삭제하시겠습니까?')) { save((c.notices || []).filter(n => n.id !== id)); return true } return false }
  const publish = async () => {
    if (!confirm('현재 공지사항 목록을 홈페이지 전체에 반영하시겠습니까?')) return
    setPubBusy(true)
    try { await publishContent(c, '공지사항 반영'); setPending(false); alert('반영 요청이 완료되었습니다. 1~2분 후 모든 방문자에게 적용됩니다.') }
    catch (e) { alert(e.message) } finally { setPubBusy(false) }
  }
  const bar = (extra) => <StaffBar staff={staff} onLoginOpen={() => setLoginOpen(true)} onLogout={logout} pending={pending} onPublish={publish} pubBusy={pubBusy} {...extra} />
  const modals = <>
    {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onLogin={login} accounts={c.staffAccounts} />}
    {modal && <PostModal initial={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={upsert} />}
  </>
  return { c, staff, bar, modals, openNew: () => setModal('new'), openEdit: (n) => setModal(n), remove }
}

/* ───────── 목록 ───────── */
export function Notice() {
  const { c, staff, bar, modals, openNew, openEdit, remove } = useNoticeAdmin()
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('c') || '전체'; const q = sp.get('q') || ''; const page = Math.max(1, Number(sp.get('p') || 1))
  const [kw, setKw] = useState(q)
  const all = useMemo(() => sortAll(c.notices || []), [c.notices])
  const list = all.filter(n => (cat === '전체' || n.category === cat) && (!q || (n.title + n.body).includes(q)))
  const pages = Math.max(1, Math.ceil(list.length / PER)); const cur = list.slice((page - 1) * PER, page * PER)
  const go = (o) => setSp({ c: cat, ...(q && { q }), ...o })
  useEffect(() => { window.scrollTo({ top: 0 }) }, [page])
  return (
    <>
      <PageHead {...HEAD} crumb={['고객센터', '공지사항']} subnav={SUPPORT_NAV} />
      <section className="section">
        <div className="wrap nb">
          <div className="nb-bar" data-reveal="">
            <div className="nb-cats" role="tablist">{CATS.map(k => <button key={k} type="button" role="tab" aria-selected={k === cat} className={k === cat ? 'is-on' : ''} onClick={() => setSp({ c: k })}>{k}<small>{k === '전체' ? all.length : all.filter(n => n.category === k).length}</small></button>)}</div>
            <form className="nb-search" onSubmit={e => { e.preventDefault(); setSp({ c: cat, q: kw }) }}><input value={kw} onChange={e => setKw(e.target.value)} placeholder="제목 · 내용 검색" aria-label="검색어" /><button type="submit">검색</button></form>
          </div>
          <div className="nb-meta"><span>전체 <b>{list.length}</b>건 · {page}/{pages} 페이지</span>{bar({ onAdd: openNew })}</div>
          <ol className="nb-list" data-reveal="">
            <li className="nb-list__head"><span>번호</span><span>분류</span><span>제목</span><span>등록일</span>{staff && <span>관리</span>}</li>
            {cur.length === 0 && <li className="nb-empty">등록된 글이 없습니다.</li>}
            {cur.map((n, i) => (
              <li key={n.id} className={n.pinned === 'Y' ? 'is-pinned' : ''}>
                <Link to={`/support/notice/${n.id}`} className={staff ? 'has-tools' : ''}>
                  <span className="nb-no">{n.pinned === 'Y' ? <i>필독</i> : list.length - ((page - 1) * PER + i)}</span>
                  <span className={`nb-cat ${catClass(n.category)}`}>{n.category}</span>
                  <b>{n.title}{n.attachments?.length > 0 && <em className="nb-clip" title="첨부파일">📎</em>}</b>
                  <time>{fmt(n.date)}</time>
                  {staff && <span className="nb-tools" onClick={e => e.preventDefault()}><button type="button" className="ed__mini" onClick={() => openEdit(n)}>수정</button><button type="button" className="ed__mini ed__mini--danger" onClick={() => remove(n.id)}>삭제</button></span>}
                </Link>
              </li>
            ))}
          </ol>
          <nav className="nb-pages" aria-label="페이지">
            <button type="button" disabled={page <= 1} onClick={() => go({ p: page - 1 })} aria-label="이전 페이지">‹</button>
            {Array.from({ length: pages }, (_, k) => <button key={k} type="button" className={k + 1 === page ? 'is-on' : ''} onClick={() => go({ p: k + 1 })}>{k + 1}</button>)}
            <button type="button" disabled={page >= pages} onClick={() => go({ p: page + 1 })} aria-label="다음 페이지">›</button>
          </nav>
        </div>
      </section>
      {modals}
    </>
  )
}

/* ───────── 상세 ───────── */
export function NoticePost() {
  const { id } = useParams(); const nav = useNavigate()
  const { c, staff, bar, modals, openEdit, remove } = useNoticeAdmin()
  const all = useMemo(() => sortAll(c.notices || []), [c.notices])
  const idx = all.findIndex(n => String(n.id) === String(id)); const n = all[idx]
  if (!n) return <Navigate to="/support/notice" replace />
  const prev = all[idx + 1]; const next = all[idx - 1]
  return (
    <>
      <PageHead {...HEAD} crumb={['고객센터', '공지사항']} subnav={SUPPORT_NAV} docTitle={n.title} />
      <section className="section">
        <div className="wrap nb">
          <article className="nb-post" data-reveal="">
            <header>
              <div className="nb-post__top"><span className={`nb-cat ${catClass(n.category)}`}>{n.category}</span>{staff && <span className="nb-tools"><button type="button" className="ed__mini" onClick={() => openEdit(n)}>수정</button><button type="button" className="ed__mini ed__mini--danger" onClick={() => { if (remove(n.id)) nav('/support/notice') }}>삭제</button></span>}</div>
              <h1>{n.title}</h1>
              <p>{fmt(n.date)} · 삼원종합물류㈜</p>
            </header>
            <div className="nb-post__body">{String(n.body || '').split('\n').map((l, i) => <p key={i}>{l || ' '}</p>)}</div>
            {(n.attachments?.length > 0 || n.link) && (
              <div className="nb-files">
                <b>첨부</b>
                <ul>
                  {(n.attachments || []).map((a, i) => <li key={i}><a href={a.url} download target="_blank" rel="noreferrer">📎 {a.name}{a.size ? <small> ({(a.size / 1024 / 1024).toFixed(1)}MB)</small> : null}</a></li>)}
                  {n.link && <li><a href={n.link} target="_blank" rel="noreferrer">🔗 관련 링크 열기 <ArrowRight /></a></li>}
                </ul>
              </div>
            )}
            <nav className="nb-post__nav">
              {prev ? <Link to={`/support/notice/${prev.id}`}><small>이전 글</small>{prev.title}</Link> : <span />}
              {next ? <Link to={`/support/notice/${next.id}`} className="is-next"><small>다음 글</small>{next.title}</Link> : <span />}
            </nav>
            <footer><Link to="/support/notice" className="btn btn--ghost">목록으로</Link>{bar({ compact: true })}</footer>
          </article>
        </div>
      </section>
      {modals}
    </>
  )
}
