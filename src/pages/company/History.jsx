import { useMemo, useState } from 'react'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'
import { Building, Shield, Handshake, Star, Check } from '../../components/Icons'

// 연혁 분류 — 아이콘·색상·라벨
const CATS = {
  found: { label: '설립', Icon: Building, tone: 'navy' },
  license: { label: '사업 허가', Icon: Check, tone: 'sky' },
  partner: { label: '파트너 계약', Icon: Handshake, tone: 'blue' },
  award: { label: '수상 · 표창', Icon: Star, tone: 'gold' },
  cert: { label: '인증', Icon: Shield, tone: 'green' },
}
const FILTERS = [['all', '전체'], ['partner', '파트너 계약'], ['award', '수상 · 표창'], ['cert', '인증'], ['license', '설립 · 허가']]

const parse = (d = '') => { const [y, m] = String(d).split('.'); return { y: Number(y) || 0, m: (m || '').padStart(2, '0') } }

export default function History() {
  const { content: c } = useContent()
  const [filter, setFilter] = useState('all')
  const items = useMemo(() => (c.history || []).filter(h => h && h.date).map(h => ({ ...h, ...parse(h.date) })).sort((a, b) => a.date.localeCompare(b.date)), [c.history])
  const eras = c.historyEras || []
  const first = items[0]?.y
  const count = (k) => items.filter(i => i.cat === k).length
  const stats = [
    { v: first, u: '년', l: '설립 연도', d: '삼원종합물류㈜ 설립' },
    { v: count('partner'), u: '건', l: '주요 파트너 계약', d: '유통·식품·제조 대표 화주' },
    { v: count('award'), u: '회', l: '수상 · 표창', d: '물류대상 · 장관 표창 등' },
    { v: count('cert'), u: '건', l: '공인 인증', d: 'HACCP · 우수물류기업 등' },
  ]
  const show = (i) => filter === 'all' || i.cat === filter || (filter === 'license' && i.cat === 'found')

  return (
    <>
      <PageHead label="HISTORY" title="회사연혁" desc="설립부터 오늘까지, 화주와 함께 쌓아 온 삼원종합물류의 신뢰의 기록입니다" image="img/banner_company.jpg" crumb={['회사소개', '회사연혁']} subnav={COMPANY_NAV} />

      {/* 요약 지표 */}
      <section className="hx-hero">
        <div className="wrap">
          <div className="hx-hero__intro" data-reveal="">
            <span className="hx-hero__tag">OUR JOURNEY</span>
            <h2>한 번의 계약이 30년의 신뢰가 되기까지</h2>
            <p>운송사업 허가로 출발한 삼원종합물류는 대형 유통·식품·제조 화주와의 협력, 국가 공인 인증과 수상을 통해 대한민국 대표 종합물류 기업으로 성장했습니다.</p>
          </div>
          <div className="hx-stats">
            {stats.map((s, i) => (
              <div className="hx-stat" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <div className="hx-stat__v">{s.v}<small>{s.u}</small></div>
                <div className="hx-stat__l">{s.l}</div>
                <div className="hx-stat__d">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 시대별 연혁 */}
      <section className="section hx">
        <div className="wrap">
          <SectionHead center eyebrow="MILESTONES" title="삼원이 걸어온 길" lead="시대별 주요 연혁을 분야별로 살펴보실 수 있습니다." />
          <div className="filters filters--center hx-filters" data-reveal="">
            {FILTERS.map(([k, l]) => <button type="button" key={k} className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
          </div>

          {eras.map((era, ei) => {
            const list = items.filter(i => i.y >= era.from && i.y <= era.to)
            const vis = list.filter(show)
            if (!list.length) return null
            const years = [...new Set(vis.map(i => i.y))]
            const last = list[list.length - 1].y
            return (
              <div className="hx-era" key={ei}>
                <aside className="hx-era__side" data-reveal="">
                  <span className="hx-era__no">{String(ei + 1).padStart(2, '0')}</span>
                  <span className="hx-era__en">{era.en}</span>
                  <div className="hx-era__range">{list[0].y}<i />{last}</div>
                  <h3>{era.title}</h3>
                  <p>{era.desc}</p>
                </aside>
                <div className="hx-era__body">
                  {years.length === 0 && <p className="hx-empty">이 시기에는 선택한 분야의 연혁이 없습니다.</p>}
                  {years.map(y => (
                    <div className="hx-year" key={y} data-reveal="">
                      <div className="hx-year__label"><span>{y}</span></div>
                      <ul className="hx-year__list">
                        {vis.filter(i => i.y === y).map((i, k) => { const cat = CATS[i.cat] || CATS.partner; const Ic = cat.Icon; return (
                          <li key={k} className={`hx-item hx-item--${cat.tone} ${i.key ? 'is-key' : ''}`}>
                            <span className="hx-item__icon"><Ic /></span>
                            <div className="hx-item__body">
                              <div className="hx-item__meta"><b>{i.y}.{i.m}</b><em>{cat.label}</em>{i.key && <strong>주요 연혁</strong>}</div>
                              <p>{i.text}</p>
                            </div>
                          </li>) })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="hx-today" data-reveal="">
            <span className="hx-today__tag">TODAY</span>
            <h3>그리고 지금, 삼원은</h3>
            <div className="hx-today__grid">
              <div><b>6개</b><span>전문 계열 법인</span></div>
              <div><b>1,000대 이상</b><span>전국 운송 네트워크</span></div>
              <div><b>30개 이상</b><span>장기 파트너 화주사</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
