import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { partners } from '../../data/partners'
import { COMPANY_NAV } from './companyNav'
import CountUp from '../../components/CountUp'
import VehicleGuide from '../../components/VehicleGuide'

export default function Status() {
  const { content: c } = useContent(); const f = c.fleet
  return (
    <>
      <PageHead label="STATUS" title="주요현황" desc="1,000대 이상의 운송 네트워크와 30개 이상의 장기 파트너사가 만드는 물류 인프라를 소개합니다" image="img/banner_business.jpg" crumb={['회사소개', '주요현황']} subnav={COMPANY_NAV} />

      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="EQUIPMENT FLEET" title={f.title} lead={f.lead} />
          <div className="fleet-total" data-reveal="">
            <span className="fleet-total__label">TOTAL ACTIVE FLEET</span>
            <div className="fleet-total__num"><CountUp value={Number(String(f.total || '1000').replace(/,/g, ''))} /><small>대 이상</small></div>
            <p>{f.totalDesc}</p>
            <div className="fleet-total__split"><span>기업물류</span><span>유통물류</span><span>콜드체인</span><span>특수화물</span></div>
          </div>
          <h3 className="h-sub" id="fleet" style={{ textAlign: 'center', margin: '56px 0 8px' }}>차종별 운송 안내</h3>
          <p className="small" style={{ textAlign: 'center', marginBottom: 28 }}>화물의 크기·무게·온도 조건에 맞춰 최적의 차종을 배정합니다.</p>
          <VehicleGuide />
        </div>
      </section>

      <section className="section section--soft">
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
