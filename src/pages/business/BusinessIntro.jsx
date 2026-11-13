import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { BUSINESS_NAV } from './businessNav'
import { ArrowRight } from '../../components/Icons'

// 사업영역 배너 — 삼원이 운영하는 차종이 각기 다른 현장에서 달리고·싣고·내리는 장면
const FLEET_SCENES = [
  { src: 'img/fleet/container.jpg', tag: '트레일러 · 컨테이너', cap: '항만 컨테이너 운송' },
  { src: 'img/biz_corporate.jpg', tag: '윙바디', cap: '물류센터 파렛트 상차' },
  { src: 'img/fleet/cargo.jpg', tag: '카고', cap: '제조 공장 원자재 상차' },
  { src: 'img/fleet/reefer.jpg', tag: '냉장 · 냉동 탑차', cap: '새벽 점포 신선식품 하차' },
  { src: 'img/biz_distribution.jpg', tag: '배송 밴', cap: '고객사 문 앞 납품' },
  { src: 'img/fleet/1t.jpg', tag: '1톤 탑차', cap: '도심 골목 배송' },
  { src: 'img/biz_brokerage.jpg', tag: '퀵 · 소형 화물', cap: '실시간 배차 긴급 운송' },
  { src: 'img/hero_1.jpg', tag: '대형 트랙터', cap: '전국 간선 장거리 운송' },
]

export default function BusinessIntro() {
  const { content: c } = useContent()
  return (
    <>
      <PageHead label="BUSINESS" title="사업영역" desc="미들마일에서 라스트마일까지, 운송⁠·보관⁠·플랫폼⁠·컨설팅을 하나의 창구로 연결합니다" slides={FLEET_SCENES} crumb={['사업영역']} subnav={BUSINESS_NAV} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="END-TO-END" title={'공급망 전 구간을 책임지는\n5대 사업영역'} lead="각 영역은 전문 법인이 운영하고 삼원종합물류가 통합 관제합니다. 세부 내용은 영역별 페이지에서 확인하실 수 있습니다." />
          <div className="biz-index">
            {c.businessAreas.map((b, i) => (
              <Link to={`/business/${b.id}`} className="biz__card" key={b.id} data-reveal="" style={{ transitionDelay: `${i * .07}s` }}>
                <img src={asset(b.image)} alt={b.name} loading="lazy" />
                <div className="biz__in"><div className="biz__title">{b.name} <ArrowRight /></div><p className="biz__desc">{b.short}</p></div>
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
                <h3>{p.title}</h3><ul>{p.points.map((x, k) => <li key={k}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
