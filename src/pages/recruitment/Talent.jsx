import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { Target, Handshake, Spark, Globe, Chart, Shield, Star, Box, Users, Leaf } from '../../components/Icons'

const NAV = [{ to: '/recruitment/talent', label: '인재상' }, { to: '/recruitment/jobs', label: '차주구인' }]
const VALUE_ICONS = [Target, Handshake, Spark, Globe]
const BENEFIT_ICONS = [Chart, Shield, Star, Box, Users, Leaf]

export default function Talent() {
  const { content: c } = useContent(); const r = c.recruitment
  return (
    <>
      <PageHead label="CAREERS" title="인재상" desc={r.subtitle} image="img/banner_careers.jpg" crumb={['채용정보', '인재상']} subnav={NAV} />

      {/* 핵심 가치 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="CORE VALUES" title={r.title} lead={r.lead} />
          <div className="value-grid">
            {r.values.map((v, i) => { const Ic = VALUE_ICONS[i % VALUE_ICONS.length]; return (
              <div className="value-card" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <div className="value-card__head"><span className="card__icon"><Ic /></span><h3>{v.title}</h3></div>
                <p>{v.desc}</p>
              </div>) })}
          </div>
        </div>
      </section>

      {/* 채용 절차 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="PROCESS" title="채용 절차 안내" />
          <div className="proc">
            {r.process.map((p, i) => (
              <div className="proc__item" key={i} data-reveal="" style={{ transitionDelay: `${i * .1}s` }}>
                <div className="proc__num">{p.step || String(i + 1).padStart(2, '0')}</div>
                <h4>{p.title}</h4>
                {p.desc && <p>{p.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 복리후생 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="WELFARE" title="임직원 복리후생" lead="구성원 한 사람 한 사람의 전문성과 성장이 존중받는 근무 환경을 만들어 갑니다." />
          <div className="grid grid--3">
            {(r.benefits || []).map((b, i) => { const Ic = BENEFIT_ICONS[i % BENEFIT_ICONS.length]; return (
              <div className="benefit" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <span className="card__icon"><Ic /></span>
                <div><h4>{b.title}</h4><p>{b.desc}</p></div>
              </div>) })}
          </div>
          <p className="small" style={{ marginTop: 28, textAlign: 'center' }}>입사 지원: <a className="t-blue" href={`mailto:${c.company.email}`}>{c.company.email}</a> · 문의 {c.company.phone}</p>
        </div>
      </section>
    </>
  )
}
