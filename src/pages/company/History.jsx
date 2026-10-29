import { useMemo } from 'react'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'

// 회사연혁 — 연도별로 묶어 두 단으로 한눈에 보여 주는 타임라인
export default function History() {
  const { content: c } = useContent()

  const years = useMemo(() => {
    const map = new Map()
    ;(c.history || []).filter(h => h && h.date)
      .slice().sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .forEach(h => {
        const [y, m = ''] = String(h.date).split('.')
        if (!map.has(y)) map.set(y, [])
        map.get(y).push({ m: m.padStart(2, '0'), text: h.text, key: h.key })
      })
    return [...map.entries()].map(([y, list]) => ({ y, list }))
  }, [c.history])

  // 항목 수 기준으로 두 단을 균등하게 나눔
  const total = years.reduce((n, y) => n + y.list.length, 0)
  let acc = 0
  const cut = years.findIndex(y => (acc += y.list.length) >= total / 2) + 1
  const cols = [years.slice(0, cut), years.slice(cut)]

  return (
    <>
      <PageHead label="HISTORY" title="회사연혁" desc="설립부터 오늘까지, 화주와 함께 걸어온 삼원종합물류의 발자취입니다" image="img/banner_company.jpg" crumb={['회사소개', '회사연혁']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="HISTORY" title="삼원종합물류가 걸어온 길" />
          <div className="hy">
            {cols.map((col, ci) => (
              <ol className="hy__col" key={ci}>
                {col.map(({ y, list }) => (
                  <li className="hy__year" key={y} data-reveal="">
                    <div className="hy__y">{y}</div>
                    <ul className="hy__events">
                      {list.map((e, k) => (
                        <li key={k} className={e.key ? 'is-key' : ''}>
                          <span className="hy__m">{e.m}</span>
                          <p>{e.text}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
