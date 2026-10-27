import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'

export default function History() {
  const { content: c } = useContent()
  return (
    <>
      <PageHead label="HISTORY" title="회사연혁" desc="1992년 설립 이래 34년간 끊임없이 성장해 온 삼원종합물류의 궤적을 소개합니다" image="img/banner_company.jpg" crumb={['회사소개', '회사연혁']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="wrap wrap--narrow">
          <SectionHead center eyebrow="HISTORY" title="삼원의 34년, 성장의 궤적" lead="화물 운송 주선 사업으로 출발하여 종합물류 그룹으로 도약하기까지, 매 순간 고객의 공급망과 함께 성장해 왔습니다." />
          <div className="tl2">
            {c.history.map((h, i) => (
              <div className={`tl2__row ${i % 2 ? 'is-right' : ''}`} key={i} data-reveal="">
                <div className="tl2__year">{h.year}</div>
                <div className="tl2__card"><ul>{h.events.map((e, k) => <li key={k}>{e}</li>)}</ul></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
