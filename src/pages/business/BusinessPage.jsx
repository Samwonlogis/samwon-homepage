import { Link, useParams, Navigate } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { BUSINESS_NAV } from './businessNav'
import { vehicleById } from '../../data/vehicles'
import { VehicleMini, VehicleCtaTile } from '../../components/VehicleGuide'
import { ArrowRight, Box, Snow, Truck, Building, Chart, Shield, Spark, Globe, Leaf, Route, Users, Target, Check, Gift, Star } from '../../components/Icons'

const SPECIAL_ICONS = { gift: Gift, chart: Chart, star: Star, spark: Spark, truck: Truck, snow: Snow, box: Box }

const ITEM_ICONS = [Box, Truck, Shield, Snow, Building, Spark, Globe, Route]
// 품목명 키워드로 의미에 맞는 아이콘 선택
const itemIcon = (t = '') => (
  /창고|레이아웃|보관/.test(t) ? Building :
  /친환경|탄소/.test(t) ? Leaf :
  /차종|적재율/.test(t) ? Truck :
  /운임|정산/.test(t) ? Chart :
  /냉동|냉장|신선|유제|밀키트|콜드/.test(t) ? Snow :
  /의약|의료|약품/.test(t) ? Shield :
  /건자재|원자재|철강|설비|기계|중량/.test(t) ? Building :
  /자동차|부품/.test(t) ? Truck :
  /온라인|이커머스|커머스/.test(t) ? Globe :
  /선물|백화점/.test(t) ? Star :
  /데이터|분석|비용|물류비/.test(t) ? Chart :
  /경로|노선|네트워크|거점/.test(t) ? Route :
  /인력|조직|교육/.test(t) ? Users :
  /전자|가전|생활|편의점|공산품|상품/.test(t) ? Box : null)

export default function BusinessPage({ id: fixedId }) {
  const params = useParams()
  const id = fixedId || params.id
  const { content: c } = useContent()
  const p = c.businessPages[id]
  if (!p) return <Navigate to="/business" replace />
  const others = c.businessAreas.filter(b => b.id !== id)
  const area = c.businessAreas.find(b => b.id === id)
  const vehicles = (p.vehicles || []).map(vehicleById).filter(Boolean)

  return (
    <>
      <PageHead label="Business" title={p.title} desc={area?.short || p.slogan} image={p.image} crumb={['사업영역', p.title]} subnav={BUSINESS_NAV} />

      {/* 1. 개요 + 핵심 지표 — 배너와 같은 사진을 반복하지 않고 지표를 나란히 둠 */}
      <section className="section">
        <div className="wrap bo">
          <div className="bo__text" data-reveal="">
            <span className="sh-en">Overview</span>
            <h2 className="h-section pre">{p.slogan}</h2>
            <p className="lead pre">{p.overview}</p>
          </div>
          {p.metrics?.length > 0
            ? <dl className="bo__facts" data-reveal="">
                {p.metrics.map((m, i) => <div key={i}><dt><b>{m.label}</b>{m.desc}</dt><dd>{m.value}</dd></div>)}
              </dl>
            : <div className="photo" data-reveal=""><img src={asset(p.image)} alt={p.title} /></div>}
        </div>
      </section>

      {/* 3. 서비스 흐름 */}
      {p.flow && (
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="SERVICE FLOW" title="서비스는 이렇게 운영됩니다" />
            <ol className="flow">
              {p.flow.map((f, i) => (
                <li className="flow__step" key={i} data-reveal="" style={{ transitionDelay: `${i * .1}s` }}>
                  <div className="flow__icon"><span>{String(i + 1).padStart(2, '0')}</span></div>
                  <h3>{f.title}</h3><p>{f.desc}</p>
                </li>))}
            </ol>
          </div>
        </section>
      )}

      {/* 4. 핵심 역량 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead eyebrow="STRENGTHS" title="핵심 역량" />
          <div className="strengths strengths--rich">
            {p.strengths.map((s, i) => (
              <div className="strength" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="strength__top"><div className="strength__n">{String(i + 1).padStart(2, '0')}</div><h3>{s.title}</h3></div>
                <p>{s.desc}</p>
                {s.points?.length > 0 && <ul className="strength__pts">{s.points.map((pt, k) => <li key={k}><Check />{pt}</li>)}</ul>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 주요 취급 품목 / 컨설팅 영역 */}
      {p.items && (
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow={id === 'consulting' ? 'CONSULTING SCOPE' : 'CARGO'} title={id === 'consulting' ? '컨설팅 영역' : '주요 취급 품목'} />
            <div className={`items ${p.items.some(it => it.image) ? 'items--photo' : 'items--icon'} items--n${p.items.length}`}>
              {p.items.map((it, i) => { const Ic = itemIcon(it.title) || ITEM_ICONS[i % ITEM_ICONS.length]; return it.image ? (
                <figure className="cargo" key={i} data-reveal="" style={{ transitionDelay: `${(i % 4) * .06}s` }}>
                  <div className="cargo__img"><img src={asset(it.image)} alt={it.title} loading="lazy" /></div>
                  <figcaption><b>{it.title}</b><span>{it.desc}</span></figcaption>
                </figure>
              ) : (
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
            <SectionHead eyebrow="FLEET" title="투입 차량" lead="화물 특성과 물량에 맞춰 아래 차종을 조합해 운영합니다." />
            <div className={`veh-minis ${vehicles.length === 4 ? 'veh-minis--4' : ''}`}>{vehicles.map(v => <VehicleMini key={v.id} v={v} />)}{vehicles.length % 3 !== 0 && vehicles.length !== 4 && <VehicleCtaTile />}</div>
            <div className="sec-foot"><Link className="link" to="/company/status#fleet">차종별 제원⁠·운송 제품 보기 <ArrowRight /></Link></div>
          </div>
        </section>
      )}
      {/* 7. 시즌⁠·특수 배송 */}
      {p.special && (
        <section className="section special-sec">
          <div className="wrap">
            <SectionHead eyebrow="SPECIAL DELIVERY" title={p.special.title} lead={p.special.lead} />
            <div className="special">
              {p.special.items.map((it, i) => { const Ic = SPECIAL_ICONS[it.icon] || Spark; return (
                <div className="special__card" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                  <span className="special__icon"><Ic /></span>
                  <h3>{it.title}</h3><p>{it.desc}</p>
                </div>) })}
            </div>
            <div className="sec-foot"><Link className="btn btn--primary" to="/contact/partnership">시즌 물량 상담 <ArrowRight /></Link></div>
          </div>
        </section>
      )}

      <section className="quote quote--flat">
        <div className="wrap"><blockquote className="pre" data-reveal="">{p.quote}</blockquote></div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="More" title="다른 사업영역" />
          <ul className="morebiz">
            {others.map(o => (
              <li key={o.id}><Link to={`/business/${o.id}`}><b>{o.name}</b><span>{o.short}</span><ArrowRight /></Link></li>
            ))}
          </ul>
          <div className="sec-foot"><Link className="btn btn--primary" to="/contact/partnership">물류 상담 신청 <ArrowRight /></Link></div>
        </div>
      </section>
    </>
  )
}
