import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'

export default function History() {
  const { content: c } = useContent()
  return (
    <>
      <PageHead label="HISTORY" title="연혁" desc="34년, 한 번도 멈추지 않은 물류. 인증·인프라·디지털 전환으로 이어진 성장의 기록" crumb={['회사소개', '연혁']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="container container--narrow">
          <SectionHead eyebrow="SINCE 1992" title="성장의 기록" />
          <div className="timeline">
            {c.history.map((h, i) => (
              <div className="tl" key={i} data-reveal="">
                <div className="tl__year">{h.year}</div>
                <ul>{h.events.map((e, k) => <li key={k}>{e}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
