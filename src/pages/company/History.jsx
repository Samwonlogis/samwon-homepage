import { useMemo } from 'react'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'

// 회사연혁 — 시대(Era)별 띠 + 연도 카드 그리드(3열)로 압축. 최신 시대가 위
export default function History() {
  const { content: c } = useContent()
  const years = useMemo(() => {
    const map = new Map()
    ;(c.history || []).filter(h => h && h.date).forEach(h => {
      const [y, m = ''] = String(h.date).split('.')
      if (!map.has(y)) map.set(y, [])
      map.get(y).push({ m, text: h.text, key: h.key })
    })
    return [...map.entries()].map(([y, list]) => ({ y: Number(y), list: list.slice().sort((a, b) => (a.m || '99').localeCompare(b.m || '99')) })).sort((a, b) => b.y - a.y)
  }, [c.history])
  const eras = useMemo(() => {
    const src = (c.historyEras || []).slice().sort((a, b) => b.from - a.from)
    const out = src.map(e => ({ ...e, years: years.filter(x => x.y >= e.from && x.y <= e.to) })).filter(e => e.years.length)
    const rest = years.filter(x => !src.some(e => x.y >= e.from && x.y <= e.to))
    if (rest.length) out.unshift({ en: 'RECENT', title: '최근', desc: '', years: rest })
    return out
  }, [years, c.historyEras])
  const count = (c.history || []).length

  return (
    <>
      <PageHead label="HISTORY" title="회사연혁" desc="설립부터 오늘까지, 화주와 함께 걸어온 삼원종합물류의 발자취입니다" logo crumb={['회사소개', '회사연혁']} subnav={COMPANY_NAV} />
      <section className="section hy-sec">
        <div className="wrap">
          <div className="hy-head" data-reveal="">
            <div className="title-block"><span className="title-block__en">Our History</span><h3>삼원종합물류가 걸어온 길</h3></div>
            <ul className="hy-kpi"><li><b>{new Date().getFullYear() - 1992}</b><span>년의 업력</span></li><li><b>{count}</b><span>주요 이정표</span></li><li><b>{eras.length}</b><span>성장 단계</span></li></ul>
          </div>
          {eras.map((e, i) => (
            <section className="hy-era" key={e.title} data-reveal="" style={{ transitionDelay: `${i * .05}s` }}>
              <header className="hy-era__head">
                <span className="hy-era__range">{e.from ? `${e.from} – ${Math.min(e.to, new Date().getFullYear())}` : ''}</span>
                <div><span className="hy-era__en">{e.en}</span><h4>{e.title}</h4></div>
                {e.desc && <p>{e.desc}</p>}
              </header>
              <ol className="hy-grid">
                {e.years.map(({ y, list }) => (
                  <li key={y} className={`hy-card ${list.some(x => x.key) ? 'is-key' : ''}`}>
                    <div className="hy-card__year">{y}</div>
                    <ul>{list.map((x, k) => <li key={k} className={x.key ? 'is-key' : ''}>{x.m ? <span>{Number(x.m)}월</span> : <span>연중</span>}{x.text}</li>)}</ul>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
