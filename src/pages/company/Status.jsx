import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'
import { Pin } from '../../components/Icons'

export default function Status() {
  const { content: c } = useContent()
  return (
    <>
      <PageHead label="GROUP & FLEET" title="계열사 · 운송 규모" desc="운송·배송·창고·인력·플랫폼을 분담하는 6개 법인과 1,500대 운송력" crumb={['회사소개', '계열사 · 운송 규모']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="AFFILIATES" title={'6개 법인, 하나의 창구'} lead="각 법인이 기능별로 전문화되어 있고, 삼원종합물류가 컨트롤타워로 통합 관제합니다. 화주는 하나의 계약, 하나의 담당자로 전 구간을 위탁할 수 있습니다." />
          <div className="sub-grid">
            {c.subsidiaries.map((s, i) => (
              <div className={`sub ${i === 0 ? 'main' : ''}`} key={i} data-reveal="" style={{ transitionDelay: `${i * .05}s` }}>
                <div className="role">{s.role}</div><h3>{s.name}</h3><p>{s.desc}</p>
                {s.location && <div className="loc"><Pin /> {s.location}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container">
          <SectionHead eyebrow="FLEET" title={c.fleet.title} lead={c.fleet.lead} />
          <div className="fleet-bar" data-reveal="">
            <div><span>기업물류 (Middle Mile)</span><b>600대</b></div>
            <div><span>유통물류 (Last Mile)</span><b>900대</b></div>
          </div>
          <p className="small muted" style={{ marginBottom: 28 }}>운영 차량 총 1,500대 · 품목·톤수별 전담 편성</p>
          <div className="fleet-grid">
            {c.fleet.groups.map((f, i) => (
              <div className="fleet" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="range">{f.range}</div><h3>{f.type}</h3><p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
