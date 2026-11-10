import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { partners } from '../../data/partners'
import { COMPANY_NAV } from './companyNav'
import VehicleGuide from '../../components/VehicleGuide'

export default function Status() {
  const { content: c } = useContent(); const f = c.fleet
  return (
    <>
      <PageHead label="STATUS" title="주요현황" desc="1,000대 이상의 운송 네트워크와 30개 이상의 장기 파트너사가 만드는 물류 인프라를 소개합니다" logo crumb={['회사소개', '주요현황']} subnav={COMPANY_NAV} />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Fleet" title={f.title} lead={f.lead} />
          <div className="fleetx" data-reveal="">
            <div className="fleetx__main">
              <span>운영 차량</span>
              <strong>{f.total || '1,000'}<small>대 이상</small></strong>
            </div>
            <div className="fleetx__side">
              <p>{f.totalDesc}</p>
              <ul>{(f.segments || ['기업물류', '유통물류', '콜드체인', '특수화물']).map(x => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <div className="subhead" id="fleet">
            <h3 className="h-sub">차종별 운송 안내</h3>
            <p>화물의 크기⁠·무게⁠·온도 조건에 맞춰 차종을 배정합니다.</p>
          </div>
          <VehicleGuide />
        </div>
      </section>

      <section className="section section--soft">
        <div className="wrap">
          <SectionHead eyebrow="Partners" title="주요 거래처 및 파트너" lead="대한민국을 대표하는 유통⁠·제조⁠·제약⁠·식품 기업들이 삼원종합물류의 물류 역량을 신뢰하고 있습니다." />
          <div className="partner-grid">
            {partners.map((p, i) => <div className="logo-tile" key={i} data-reveal="" style={{ transitionDelay: `${(i % 5) * .05}s` }}><img src={asset(p.logo)} alt={p.name} /></div>)}
          </div>
          <p className="clients__note">{c.partnersSection.note}</p>
        </div>
      </section>
    </>
  )
}
