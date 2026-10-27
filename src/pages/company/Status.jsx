import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { partners } from '../../data/partners'
import { COMPANY_NAV } from './companyNav'
import CountUp from '../../components/CountUp'

export default function Status() {
  const { content: c } = useContent(); const f = c.fleet
  return (
    <>
      <PageHead label="STATUS" title="주요현황" desc="1,500대 운송 네트워크와 30개 이상의 장기 파트너사가 만드는 물류 인프라를 소개합니다" image="img/banner_business.jpg" crumb={['회사소개', '주요현황']} subnav={COMPANY_NAV} />

      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="EQUIPMENT FLEET" title={f.title} lead={f.lead} />
          <div className="fleet-total" data-reveal="">
            <span className="fleet-total__label">TOTAL ACTIVE FLEET</span>
            <div className="fleet-total__num"><CountUp value={Number(String(f.total || '1500').replace(/,/g, ''))} /><small>대</small></div>
            <p>{f.totalDesc}</p>
            <div className="fleet-total__split"><span>기업물류 <b>600대</b></span><span>유통물류 <b>900대</b></span></div>
          </div>
          <div className="grid grid--4">
            {f.groups.map((g, i) => (
              <div className="fleet" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <div className="range">{g.range}</div><h3>{g.type}</h3><p>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="AFFILIATES" title="계열사 현황" lead="각 법인이 기능별로 전문화되어 있고, 삼원종합물류가 컨트롤타워로 통합 관제합니다." />
          <div className="subs">
            {c.subsidiaries.map((s, i) => (
              <div className={`sub ${i === 0 ? 'main' : ''}`} key={i} data-reveal="" style={{ transitionDelay: `${i * .05}s` }}>
                <div className="role">{s.role}</div><h3>{s.name}</h3><p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="PARTNERS" title="주요 거래처 및 파트너" lead="대한민국을 대표하는 유통·제조·제약·식품 기업들이 삼원종합물류의 물류 역량을 신뢰하고 있습니다." />
          <div className="partner-grid">
            {partners.map((p, i) => <div className="logo-tile" key={i} data-reveal="" style={{ transitionDelay: `${(i % 5) * .05}s` }}><img src={asset(p.logo)} alt={p.name} /></div>)}
          </div>
          <p className="small muted" style={{ marginTop: 20, textAlign: 'center' }}>{c.partnersSection.note}</p>
        </div>
      </section>
    </>
  )
}
