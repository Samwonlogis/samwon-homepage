import { Link, useParams, Navigate } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { BUSINESS_NAV } from './businessNav'
import { vehicleById } from '../../data/vehicles'
import { VehicleMini } from '../../components/VehicleGuide'
import { ArrowRight, Box, Snow, Truck, Building, Chart, Shield, Spark, Globe, Leaf, Route, Users, Target, Check } from '../../components/Icons'

const ITEM_ICONS = [Box, Truck, Shield, Snow, Building, Spark, Globe, Route]
const FLOW_ICONS = [Target, Box, Truck, Building, Chart]

export default function BusinessPage({ id: fixedId }) {
  const params = useParams()
  const id = fixedId || params.id
  const { content: c } = useContent()
  const p = c.businessPages[id]
  if (!p) return <Navigate to="/business" replace />
  const others = c.businessAreas.filter(b => b.id !== id)
  const vehicles = (p.vehicles || []).map(vehicleById).filter(Boolean)
  const cs = p.caseStudy

  return (
    <>
      <PageHead label={p.label} title={p.title} desc={p.slogan} image={p.image} crumb={['사업영역', p.title]} subnav={BUSINESS_NAV} />

      {/* 1. 개요 */}
      <section className="section">
        <div className="wrap split">
          <div data-reveal="">
            <span className="eyebrow">OVERVIEW</span>
            <h2 className="h-section">{p.slogan}</h2>
            <p className="lead pre">{p.overview}</p>
          </div>
          <div className="photo" data-reveal=""><img src={asset(p.image)} alt={p.title} /></div>
        </div>
      </section>

      {/* 2. 핵심 지표 */}
      {p.metrics && (
        <section className="kpi-band">
          <div className="wrap kpi-band__grid">
            {p.metrics.map((m, i) => (
              <div className="kpi" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <div className="kpi__v">{m.value}</div>
                <div className="kpi__l">{m.label}</div>
                <div className="kpi__d">{m.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. 서비스 흐름 */}
      {p.flow && (
        <section className="section">
          <div className="wrap">
            <SectionHead center eyebrow="SERVICE FLOW" title="서비스는 이렇게 운영됩니다" />
            <ol className="flow">
              {p.flow.map((f, i) => { const Ic = FLOW_ICONS[i % FLOW_ICONS.length]; return (
                <li className="flow__step" key={i} data-reveal="" style={{ transitionDelay: `${i * .1}s` }}>
                  <div className="flow__icon"><Ic /><span>{String(i + 1).padStart(2, '0')}</span></div>
                  <h3>{f.title}</h3><p>{f.desc}</p>
                </li>) })}
            </ol>
          </div>
        </section>
      )}

      {/* 4. 핵심 역량 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="STRENGTHS" title="핵심 역량" />
          <div className="strengths">
            {p.strengths.map((s, i) => (
              <div className="strength" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="strength__n">{String(i + 1).padStart(2, '0')}</div><div><h3>{s.title}</h3><p>{s.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 주요 취급 품목 / 컨설팅 영역 */}
      {p.items && (
        <section className="section">
          <div className="wrap">
            <SectionHead center eyebrow={id === 'consulting' ? 'CONSULTING SCOPE' : 'CARGO'} title={id === 'consulting' ? '컨설팅 영역' : '주요 취급 품목'} />
            <div className="items">
              {p.items.map((it, i) => { const Ic = ITEM_ICONS[i % ITEM_ICONS.length]; return (
                <div className="item" key={i} data-reveal="" style={{ transitionDelay: `${(i % 4) * .06}s` }}>
                  <span className="item__icon"><Ic /></span><b>{it.title}</b><span>{it.desc}</span>
                </div>) })}
            </div>
          </div>
        </section>
      )}

      {/* 6. 투입 차량 / 산출물 */}
      {vehicles.length > 0 && (
        <section className="section section--soft">
          <div className="wrap">
            <SectionHead center eyebrow="FLEET" title="투입 차량" lead="화물 특성과 물량에 맞춰 아래 차종을 조합해 운영합니다." />
            <div className="veh-minis">{vehicles.map(v => <VehicleMini key={v.id} v={v} />)}</div>
            <div style={{ textAlign: 'center', marginTop: 24 }}><Link className="link" to="/company/status#fleet">차종별 제원·운송 제품 보기 <ArrowRight /></Link></div>
          </div>
        </section>
      )}
      {p.deliverables && (
        <section className="section section--soft">
          <div className="wrap">
            <SectionHead center eyebrow="DELIVERABLES" title="컨설팅 산출물" />
            <div className="deliv">{p.deliverables.map((d, i) => <div className="deliv__item" key={i} data-reveal=""><span>{String(i + 1).padStart(2, '0')}</span><b>{d}</b></div>)}</div>
          </div>
        </section>
      )}

      {/* 7. 운영 사례 */}
      {cs && (
        <section className="section">
          <div className="wrap">
            <SectionHead center eyebrow="CASE STUDY" title="운영 사례" lead={cs.client} />
            <div className="case3" data-reveal="">
              <div className="case3__col case3__col--p"><span className="case3__tag">과제</span><p>{cs.problem}</p></div>
              <div className="case3__arrow"><ArrowRight /></div>
              <div className="case3__col case3__col--s"><span className="case3__tag">삼원의 해법</span><p>{cs.solution}</p></div>
              <div className="case3__arrow"><ArrowRight /></div>
              <div className="case3__col case3__col--r"><span className="case3__tag"><Check /> 결과</span><p>{cs.result}</p></div>
            </div>
          </div>
        </section>
      )}

      <section className="quote quote--photo">
        <img src={asset(p.image)} alt="" />
        <div className="wrap"><blockquote data-reveal="">{p.quote}</blockquote></div>
      </section>

      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="MORE" title="다른 사업영역" />
          <div className="grid grid--4">
            {others.map(o => <Link to={`/business/${o.id}`} className="card card--link" key={o.id}><div className="card__img"><img src={asset(o.image)} alt="" loading="lazy" /></div><div className="eyebrow" style={{ fontSize: 11 }}>{o.en}</div><h3 style={{ marginTop: 6 }}>{o.name}</h3><span className="link" style={{ marginTop: 12, fontSize: 15 }}>자세히 보기 <ArrowRight /></span></Link>)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}><Link className="btn btn--primary btn--lg" to="/contact">물류 상담 신청 <ArrowRight /></Link></div>
        </div>
      </section>
    </>
  )
}
