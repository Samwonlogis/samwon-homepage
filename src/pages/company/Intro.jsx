import { useState } from 'react'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { COMPANY_NAV } from './companyNav'
import { Leaf, Building, Box, Pin, Globe } from '../../components/Icons'

const cat = (name) => {
  if (name.includes('본사')) return { label: '본사 (HQ)', type: 'main', Icon: Building }
  if (/허브|물류센터|차고지/.test(name)) return { label: '물류 거점', type: 'main', Icon: Box }
  if (/백화점|더현대/.test(name)) return { label: '백화점 유통망', type: 'retail', Icon: Globe }
  return { label: '지역 사무소', type: 'local', Icon: Pin }
}

export default function Intro() {
  const { content: c } = useContent()
  const it = c.intro, ceo = c.ceo
  const [filter, setFilter] = useState('all'); const [copied, setCopied] = useState(null)
  const subs = c.subsidiaries.filter(s => !/^삼원종합물류/.test(s.name))
  const offices = c.offices.filter(o => filter === 'all' || cat(o.name).type === filter)
  const copy = (addr, i) => { navigator.clipboard?.writeText(addr).then(() => { setCopied(i); setTimeout(() => setCopied(null), 1800) }) }

  return (
    <>
      <PageHead label="COMPANY" title="회사소개" desc="34년간 축적한 현장 역량과 6개 전문 계열사의 통합 인프라로 대한민국 공급망을 설계합니다." image="img/banner_company.jpg" crumb={['회사소개', '회사소개']} subnav={COMPANY_NAV} />

      {/* 회사 개요 */}
      <section className="section">
        <div className="wrap wrap--narrow" style={{ textAlign: 'center' }}>
          <SectionHead center eyebrow="OVERVIEW" title="회사 개요" />
          <h3 className="h-section pre" style={{ marginTop: 0 }} data-reveal="">{it.title}</h3>
          <div className="overview-text" data-reveal="">{it.desc.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>
      </section>

      {/* 핵심 역량 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="CORE COMPETENCIES" title="핵심 역량" />
          <div className="grid grid--4 grid--m1">
            {(it.coreValues || []).map((v, i) => (
              <div className="card" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                {v.logo ? <div className="card__logo"><img src={asset(v.logo)} alt={v.title} /></div> : <div className="card__icon"><Leaf /></div>}
                <h3>{v.title}</h3><p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사무소 현황 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="OFFICES" title="사무소 현황" />
          <div className="filters filters--center" data-reveal="">
            {[['all', '전체 보기'], ['main', '본사 & 물류거점'], ['retail', '백화점 유통망'], ['local', '지역 사무소']].map(([k, l]) => <button type="button" key={k} className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
          </div>
          <div className="grid grid--3">
            {offices.map((o, i) => { const k = cat(o.name); const Ic = k.Icon; return (
              <div className="office-card" key={o.name} data-reveal="">
                <div className="office-card__head"><span className="card__icon"><Ic /></span><span className="chip">{k.label}</span></div>
                <h3>{o.name}</h3><p>{o.address}</p>
                <div className="office-card__act">
                  <button type="button" className={`btn btn--ghost btn--sm ${copied === i ? 'is-done' : ''}`} onClick={() => copy(o.address, i)}>{copied === i ? '복사 완료' : '주소 복사'}</button>
                  <a className="btn btn--primary btn--sm" href={`https://map.naver.com/p/search/${encodeURIComponent(o.address)}`} target="_blank" rel="noreferrer">지도 보기</a>
                </div>
              </div>) })}
          </div>
        </div>
      </section>

      {/* CEO 인사말 */}
      <section className="section section--soft" id="ceo">
        <div className="wrap">
          <SectionHead center eyebrow="CEO MESSAGE" title="대표이사 인사말" />
          <div className="ceo">
            <div className="ceo__photo" data-reveal="">
              <div className="photo photo--portrait">{ceo.photo ? <img src={asset(ceo.photo)} alt={`${ceo.name} ${ceo.title}`} /> : <img src={asset('img/hero_3.jpg')} alt="삼원종합물류 운송 차량" />}</div>
              <div className="ceo__tag"><b>{ceo.name}</b><span>{ceo.title}</span></div>
            </div>
            <div className="ceo__body" data-reveal="" style={{ transitionDelay: '.1s' }}>
              <h3 className="h-sub ceo__headline">{ceo.headline}</h3>
              <div className="ceo__text">{ceo.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
              <div className="ceo__sign"><b>{c.company.name}</b><span>{ceo.title} <strong>{ceo.name}</strong></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 계열사 현황 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="SUBSIDIARIES" title="계열사 현황" lead="6개 전문 법인이 각 물류 영역의 핵심 역량을 담당하며, 그룹 차원의 통합 시너지를 실현합니다." />
          <div className="subs subs--5">
            {subs.map((s, i) => (
              <div className="sub sub--center" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="role">{s.role}</div><h3>{s.name}</h3><p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
