import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { Target, Handshake, Spark, Star } from '../../components/Icons'
const NAV = [{ to: '/recruitment/talent', label: '인재채용' }, { to: '/recruitment/jobs', label: '차주 모집' }]
const IC = [Target, Handshake, Spark, Star]

export default function Talent() {
  const { content: c } = useContent(); const r = c.recruitment
  return (
    <>
      <PageHead label="CAREERS" title="인재채용" desc={r.subtitle} image="img/banner_careers.jpg" crumb={['채용정보', '인재채용']} subnav={NAV} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="TALENT" title={r.title} />
          <div className="grid grid--4">
            {r.values.map((v, i) => { const Ic = IC[i % IC.length]; return <div className="card" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}><div className="card__icon"><Ic /></div><h3>{v.title}</h3><p>{v.desc}</p></div> })}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="PROCESS" title="채용 절차" />
          <div className="process-row" data-reveal="">{r.process.map((s, i) => <span key={i}>{i + 1}. {s}</span>)}</div>
          <h3 className="h-sub" style={{ margin: '48px 0 16px' }}>진행 중인 채용</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {r.openings.map((o, i) => <div className="job" key={i} data-reveal=""><h3>{o.title}</h3><span>{o.dept}</span><span className="chip">{o.type}</span><span>{o.deadline}</span></div>)}
          </div>
          <p className="small" style={{ marginTop: 20 }}>지원서는 <a className="t-blue" href={`mailto:${c.company.email}`}>{c.company.email}</a>로 보내주시거나, <Link className="t-blue" to="/contact">고객센터</Link>를 통해 문의해 주십시오.</p>
        </div>
      </section>
    </>
  )
}
