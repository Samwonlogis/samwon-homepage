import { Link, useParams, Navigate } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { BUSINESS_NAV } from './businessNav'
import { ArrowRight } from '../../components/Icons'

export default function BusinessPage({ id: fixedId }) {
  const params = useParams()
  const id = fixedId || params.id
  const { content: c } = useContent()
  const p = c.businessPages[id]
  if (!p) return <Navigate to="/business" replace />
  const others = c.businessAreas.filter(b => b.id !== id)
  return (
    <>
      <PageHead label={p.label} title={p.title} desc={p.slogan} image={p.image} crumb={['사업영역', p.title]} subnav={BUSINESS_NAV} />
      <section className="section">
        <div className="container split">
          <div data-reveal="">
            <span className="eyebrow">OVERVIEW</span>
            <h2 className="h-section">{p.slogan}</h2>
            <p className="lead pre">{p.overview}</p>
          </div>
          <div className="photo" data-reveal=""><img src={asset(p.image)} alt={p.title} /></div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="STRENGTHS" title="핵심 역량" />
          <div className="strengths">
            {p.strengths.map((s, i) => (
              <div className="strength" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="strength__n">{String(i + 1).padStart(2, '0')}</div><div><h3>{s.title}</h3><p>{s.desc}</p></div>
              </div>
            ))}
          </div>
          {p.process && (
            <>
              <h3 className="h-sub" style={{ margin: '48px 0 18px' }}>운영 프로세스</h3>
              <div className="steps">{p.process.map((s, i) => <div className="step" key={i} data-reveal=""><div className="step__n">STEP {i + 1}</div><h3>{s}</h3></div>)}</div>
            </>
          )}
        </div>
      </section>
      <section className="quote"><div className="container"><blockquote data-reveal="">{p.quote}</blockquote></div></section>
      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="MORE" title="다른 사업영역" />
          <div className="grid grid--4">
            {others.map(o => <Link to={`/business/${o.id}`} className="card" key={o.id}><div className="eyebrow eyebrow--plain" style={{ fontSize: 11 }}>{o.en}</div><h3 style={{ marginTop: 8 }}>{o.name}</h3><p>{o.short}</p><span className="t-blue" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginTop: 14, fontWeight: 700, fontSize: 14 }}>자세히 보기 <ArrowRight style={{ width: 16 }} /></span></Link>)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}><Link className="btn btn--primary" to="/contact">물류 상담 신청 <ArrowRight /></Link></div>
        </div>
      </section>
    </>
  )
}
