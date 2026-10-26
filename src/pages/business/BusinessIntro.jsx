import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { BUSINESS_NAV } from './businessNav'
import { ArrowRight } from '../../components/Icons'

export default function BusinessIntro() {
  const { content: c } = useContent()
  return (
    <>
      <PageHead label="BUSINESS" title="사업영역" desc="미들마일에서 라스트마일까지, 운송·보관·플랫폼·컨설팅을 하나의 창구로 연결합니다" image="img/banner_business.jpg" crumb={['사업영역']} subnav={BUSINESS_NAV} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="END-TO-END" title={'공급망 전 구간을 책임지는\n5대 사업영역'} lead="각 영역은 전문 법인이 운영하고 삼원종합물류가 통합 관제합니다. 세부 내용은 영역별 페이지에서 확인하실 수 있습니다." />
          <div className="biz-index">
            {c.businessAreas.map((b, i) => (
              <Link to={`/business/${b.id}`} className="biz-card" key={b.id} data-reveal="" style={{ transitionDelay: `${i * .07}s` }}>
                <img src={asset(b.image)} alt={b.name} loading="lazy" />
                <div className="biz-card__in"><div className="biz-card__en">{b.en}</div><div className="biz-card__title">{b.name} <ArrowRight /></div><p className="biz-card__desc">{b.short}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow={c.principles.eyebrow} title={c.principles.title} />
          <div className="principles">
            {c.principles.items.map((p, i) => (
              <div className="principle" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="en">{p.en}</div><h3>{p.title}</h3><ul>{p.points.map((x, k) => <li key={k}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
