import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams, Navigate } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { SUPPORT_NAV } from './supportNav'
import { ArrowRight } from '../../components/Icons'

const CATS = ['전체', '공지사항', '삼원소식', '자료실']
const catClass = (c) => c === '공지사항' ? 'nb-cat--notice' : c === '삼원소식' ? 'nb-cat--news' : 'nb-cat--doc'
const fmt = (d = '') => d.replace(/-/g, '.')
const PER = 10

// 공지사항 게시판 — 관리자 모드 「공지사항 게시판」에서 글 등록(공지사항 · 삼원소식 · 자료실)
export function Notice() {
  const { content: c } = useContent()
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('c') || '전체'; const q = sp.get('q') || ''; const page = Math.max(1, Number(sp.get('p') || 1))
  const [kw, setKw] = useState(q)
  const all = useMemo(() => [...(c.notices || [])].sort((a, b) => ((b.pinned === 'Y') - (a.pinned === 'Y')) || String(b.date).localeCompare(String(a.date))), [c.notices])
  const list = all.filter(n => (cat === '전체' || n.category === cat) && (!q || (n.title + n.body).includes(q)))
  const pages = Math.max(1, Math.ceil(list.length / PER)); const cur = list.slice((page - 1) * PER, page * PER)
  const go = (o) => setSp({ c: cat, ...(q && { q }), ...o })
  return (
    <>
      <PageHead label="NOTICE" title="공지사항" desc="삼원종합물류의 공지사항과 소식, 자료를 안내합니다." image="img/vision.jpg" crumb={['고객센터', '공지사항']} subnav={SUPPORT_NAV} />
      <section className="section">
        <div className="wrap nb">
          <div className="nb-bar" data-reveal="">
            <div className="nb-cats" role="tablist">{CATS.map(k => <button key={k} type="button" role="tab" aria-selected={k === cat} className={k === cat ? 'is-on' : ''} onClick={() => setSp({ c: k })}>{k}<small>{k === '전체' ? all.length : all.filter(n => n.category === k).length}</small></button>)}</div>
            <form className="nb-search" onSubmit={e => { e.preventDefault(); setSp({ c: cat, q: kw }) }}><input value={kw} onChange={e => setKw(e.target.value)} placeholder="제목 · 내용 검색" aria-label="검색어" /><button type="submit">검색</button></form>
          </div>
          <ol className="nb-list" data-reveal="">
            {cur.length === 0 && <li className="nb-empty">등록된 글이 없습니다.</li>}
            {cur.map((n, i) => (
              <li key={n.id} className={n.pinned === 'Y' ? 'is-pinned' : ''}>
                <Link to={`/support/notice/${n.id}`}>
                  <span className="nb-no">{n.pinned === 'Y' ? <i>필독</i> : list.length - ((page - 1) * PER + i)}</span>
                  <span className={`nb-cat ${catClass(n.category)}`}>{n.category}</span>
                  <b>{n.title}</b>
                  <time>{fmt(n.date)}</time>
                </Link>
              </li>
            ))}
          </ol>
          {pages > 1 && <nav className="nb-pages" aria-label="페이지">{Array.from({ length: pages }, (_, k) => <button key={k} type="button" className={k + 1 === page ? 'is-on' : ''} onClick={() => go({ p: k + 1 })}>{k + 1}</button>)}</nav>}
        </div>
      </section>
    </>
  )
}

export function NoticePost() {
  const { id } = useParams(); const { content: c } = useContent()
  const all = useMemo(() => [...(c.notices || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))), [c.notices])
  const idx = all.findIndex(n => String(n.id) === String(id)); const n = all[idx]
  if (!n) return <Navigate to="/support/notice" replace />
  const prev = all[idx + 1]; const next = all[idx - 1]
  return (
    <>
      <PageHead label="NOTICE" title="공지사항" desc="삼원종합물류의 공지사항과 소식, 자료를 안내합니다." image="img/vision.jpg" crumb={['고객센터', '공지사항']} subnav={SUPPORT_NAV} docTitle={n.title} />
      <section className="section">
        <div className="wrap nb">
          <article className="nb-post" data-reveal="">
            <header>
              <span className={`nb-cat ${catClass(n.category)}`}>{n.category}</span>
              <h1>{n.title}</h1>
              <p>{fmt(n.date)} · 삼원종합물류㈜</p>
            </header>
            <div className="nb-post__body">{String(n.body || '').split('\n').map((l, i) => <p key={i}>{l || ' '}</p>)}</div>
            {n.link && <a className="nb-post__link" href={n.link} target="_blank" rel="noreferrer">첨부 · 관련 링크 열기 <ArrowRight /></a>}
            <nav className="nb-post__nav">
              {prev ? <Link to={`/support/notice/${prev.id}`}><small>이전 글</small>{prev.title}</Link> : <span />}
              {next ? <Link to={`/support/notice/${next.id}`} className="is-next"><small>다음 글</small>{next.title}</Link> : <span />}
            </nav>
            <footer><Link to="/support/notice" className="btn btn--ghost">목록으로</Link></footer>
          </article>
        </div>
      </section>
    </>
  )
}
