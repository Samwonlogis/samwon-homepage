import PageHead from '../components/PageHead'
import { useContent } from '../context/ContentContext'

import { PRIVACY, TERMS } from '../data/legal'

const Table = ({ t }) => (
  <div className="lg-table-wrap"><table className="lg-table"><thead><tr>{t.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table></div>
)
const Block = ({ s, cpo }) => (
  <section className="lg-sec" id={s.h.replace(/\s/g, '')}>
    <h2>{s.h}</h2>
    {(s.p || []).map((x, i) => <p key={i}>{x}</p>)}
    {s.table && <Table t={s.table} />}
    {s.list && <ol className="lg-list">{s.list.map((x, i) => <li key={i}>{x}</li>)}</ol>}
    {s.cpo && (
      <div className="lg-cpo">
        <div><b>개인정보 보호책임자</b><span>{cpo.title} {cpo.name}</span></div>
        <div><b>담당 부서</b><span>{cpo.dept}</span></div>
        <div><b>전화</b><span><a href={`tel:${cpo.phone}`}>{cpo.phone}</a></span></div>
        <div><b>이메일</b><span><a href={`mailto:${cpo.email}`}>{cpo.email}</a></span></div>
      </div>
    )}
    {(s.p2 || []).map((x, i) => <p key={'b' + i}>{x}</p>)}
  </section>
)

export function Privacy() {
  const { content: c } = useContent(); const d = PRIVACY
  return (<><PageHead label="PRIVACY POLICY" title="개인정보처리방침" desc={`시행일 ${d.effective.replace(/-/g, '.')} · 버전 ${d.version}`} crumb={['개인정보처리방침']} />
    <section className="section"><div className="wrap lg">
      <nav className="lg-toc" aria-label="목차">{d.sections.filter(s => s.h.startsWith('제')).map(s => <a key={s.h} href={'#' + s.h.replace(/\s/g, '')}>{s.h.replace(/\s*\(.*\)/, '')}</a>)}</nav>
      <div className="lg-body">
        {d.sections.map((s, i) => <Block key={i} s={{ ...s, p: (s.p || []).map(x => x.replace('삼원종합물류㈜', c.company.name || '삼원종합물류㈜')) }} cpo={d.cpo} />)}
        <p className="lg-foot">본 방침에 대한 문의: {d.cpo.dept} {d.cpo.phone} · {d.cpo.email}</p>
      </div>
    </div></section></>)
}
export function Terms() {
  const d = TERMS
  return (<><PageHead label="TERMS OF SERVICE" title="이용약관" desc={`시행일 ${d.effective.replace(/-/g, '.')} · 버전 ${d.version}`} crumb={['이용약관']} />
    <section className="section"><div className="wrap lg">
      <nav className="lg-toc" aria-label="목차">{d.articles.filter(s => s.h.startsWith('제')).map(s => <a key={s.h} href={'#' + s.h.replace(/\s/g, '')}>{s.h.replace(/\s*\(.*\)/, '')}</a>)}</nav>
      <div className="lg-body">{d.articles.map((s, i) => <Block key={i} s={s} />)}</div>
    </div></section></>)
}
export function NotFound() {
  return (<><PageHead title="페이지를 찾을 수 없습니다" />
    <section className="section"><div className="container" style={{ textAlign: 'center' }}><p className="lead" style={{ margin: '0 auto' }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p><a className="btn btn--primary" href="./" style={{ marginTop: 24 }}>홈으로</a></div></section></>)
}
