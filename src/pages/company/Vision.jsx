import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { COMPANY_NAV } from './companyNav'
import { Truck, Shield, Spark, Handshake, Target, Users, Check } from '../../components/Icons'

const ICONS = { truck: Truck, shield: Shield, spark: Spark }
const VALUE_ICONS = [Handshake, Target, Spark, Shield]

export default function Vision() {
  const { content: c } = useContent()
  const v = c.visionPage || {}
  return (
    <>
      <PageHead label="VISION" title="기업비전" desc="고객의 공급망을 끝까지 책임지는 대한민국 대표 통합물류 그룹" image="img/banner_company.jpg" crumb={['회사소개', '기업비전']} subnav={COMPANY_NAV} />

      {/* 1. 비전 선언 */}
      <section className="vs-intro">
        <div className="wrap">
          <div className="vs-statement" data-reveal="" style={{ marginTop: 0 }}>
            <span className="vs-watermark" aria-hidden="true">Vision</span>
            <p className="vs-statement__top">{v.statementTop}</p>
            <p className="vs-statement__main">{v.statementMain} <em>{v.statementAccent}</em>{v.statementEnd}</p>
          </div>
        </div>
      </section>

      {/* 2. 미션 밴드 */}
      <section className="vs-band">
        <img src={asset(v.bandImage || 'img/vision.jpg')} alt="" />
        <div className="wrap">
          <div className="vs-band__in" data-reveal="">
            <span className="vs-band__label">{v.bandLabel}</span>
            <h3 className="pre">{v.bandTitle}</h3>
            <p>{v.bandDesc}</p>
          </div>
        </div>
      </section>

      {/* 3. 핵심가치 */}
      <section className="section">
        <div className="wrap">
          <div className="title-block" data-reveal="">
            <span className="title-block__en">Core Values</span>
            <h3>삼원종합물류의 핵심가치</h3>
          </div>
          <ul className="vs-values">
            {(v.values || []).map((x, i) => { const Ic = VALUE_ICONS[i % VALUE_ICONS.length]; return (
              <li key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <span className="vs-values__ic"><Ic /></span>
                <span className="vs-values__en">{x.en}</span>
                <h4>{x.title}</h4>
                <p>{x.desc}</p>
              </li>) })}
          </ul>
        </div>
      </section>

      {/* 4. 인프라 */}
      <section className="section section--soft">
        <div className="wrap">
          <div className="title-block" data-reveal="">
            <span className="title-block__en">Infrastructure</span>
            <h3>{v.infraTitle}</h3>
          </div>
          <ul className="vs-infra">
            {(v.infra || []).map((x, i) => { const Ic = ICONS[x.icon] || Users; return (
              <li key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <span className="vs-infra__ic"><Ic /></span>
                <h4>{x.title}</h4>
                <p>{x.desc}</p>
                <b><Check />{x.foot}</b>
              </li>) })}
          </ul>
        </div>
      </section>
    </>
  )
}
