import { useMemo } from 'react'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'

// 회사연혁 — 중앙 세로선을 기준으로 좌우 교차, 최신 연도부터
export default function History() {
  const { content: c } = useContent()
  const years = useMemo(() => {
    const map = new Map()
    ;(c.history || []).filter(h => h && h.date)
      .slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .forEach(h => {
        const [y, m = ''] = String(h.date).split('.')
        if (!map.has(y)) map.set(y, [])
        map.get(y).push({ m: m.padStart(2, '0'), text: h.text, key: h.key })
      })
    return [...map.entries()].map(([y, list]) => ({ y, list: list.slice().sort((a, b) => a.m.localeCompare(b.m)) }))
  }, [c.history])
  const eras = c.historyEras || []
  const eraStart = (y) => eras.find(e => Number(y) === Math.max(...years.filter(x => Number(x.y) >= e.from && Number(x.y) <= e.to).map(x => Number(x.y))))

  return (
    <>
      <PageHead label="HISTORY" title="회사연혁" desc="설립부터 오늘까지, 화주와 함께 걸어온 삼원종합물류의 발자취입니다" image="img/banner_company.jpg" crumb={['회사소개', '회사연혁']} subnav={COMPANY_NAV} />
      <section className="section hz-sec">
        <div className="wrap">
          <div className="title-block" data-reveal="">
            <span className="title-block__en">Our History</span>
            <h3>삼원종합물류가 걸어온 길</h3>
          </div>
          <ol className="hz">
            {years.map(({ y, list }, i) => { const era = eraStart(y); return (
              <li key={y} className={`hz__row ${i % 2 ? 'is-right' : 'is-left'}`} data-reveal="">
                {era && <span className="hz__era"><i />{era.title}</span>}
                <span className="hz__dot" aria-hidden="true" />
                <div className="hz__body">
                  <div className="hz__year">{y}</div>
                  <ul>
                    {list.map((e, k) => <li key={k} className={e.key ? 'is-key' : ''}><span>{Number(e.m)}월</span>{e.text}</li>)}
                  </ul>
                </div>
              </li>) })}
          </ol>
        </div>
      </section>
    </>
  )
}
