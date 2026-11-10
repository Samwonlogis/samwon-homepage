import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { COMPANY_NAV } from './companyNav'

export default function Vision() {
  const { content: c } = useContent()
  const v = c.visionPage || {}
  const body = (v.statementBody && v.statementBody.length)
    ? v.statementBody
    : [`${v.statementTop || ''} ${v.statementMain || ''} ${v.statementAccent || ''}${v.statementEnd || ''}`.trim()]
  return (
    <>
      <PageHead label="VISION" title="기업비전" desc="고객의 공급망을 끝까지 책임지는 대한민국 대표 통합물류 그룹" logo crumb={['회사소개', '기업비전']} subnav={COMPANY_NAV} />

      {/* 1. 비전 선언 — 회사개요와 같은 좌측 정렬 편집 구성 */}
      <section className="section">
        <div className="wrap">
          <div className="ov" data-reveal="">
            <div className="ov__head">
              <span className="sh-en">Vision</span>
              <h2 className="pre">{`${v.statementMain || ''}\n${v.statementAccent || ''}`}</h2>
            </div>
            <div className="ov__text">{body.map((p, i) => <p key={i}>{p}</p>)}</div>
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

      {/* 3. 핵심가치 — 아이콘 없이 글자와 선으로만 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Core Values" title="삼원종합물류의 핵심가치" lead={v.valuesLead} />
          <ul className="vgrid" data-reveal="">
            {(v.values || []).map((x, i) => (
              <li key={i}>
                <span className="vgrid__en">{x.en}</span>
                <h3>{x.title}</h3>
                <p>{x.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. 운영 기반 — 항목 / 설명 / 근거 3열 표 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead eyebrow="Infrastructure" title={v.infraTitle} lead={v.infraLead} />
          <dl className="spec" data-reveal="">
            {(v.infra || []).map((x, i) => (
              <div key={i}>
                <dt>{x.title}</dt>
                <dd><p>{x.desc}</p><b>{x.foot}</b></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
