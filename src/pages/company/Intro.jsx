import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { COMPANY_NAV } from './companyNav'
import { Leaf, Building, Box, Pin, Globe, Phone, ArrowRight } from '../../components/Icons'

const cat = (name) => {
  if (name.includes('본사')) return { label: '본사 (HQ)', type: 'hq', Icon: Building }
  if (/허브|물류센터|차고지/.test(name)) return { label: '물류 거점', type: 'main', Icon: Box }
  if (/백화점|더현대/.test(name)) return { label: '백화점 유통망', type: 'retail', Icon: Globe }
  return { label: '지역 사무소', type: 'local', Icon: Pin }
}

export default function Intro() {
  const { content: c } = useContent()
  const it = c.intro, ceo = c.ceo
  const [copied, setCopied] = useState(null)
  const subs = c.subsidiaries.filter(s => !/^삼원종합물류/.test(s.name))
  const hq = c.offices.find(o => cat(o.name).type === 'hq') || c.offices[0]
  const GROUPS = [['main', '물류 거점', '차량 운영⁠·상하차 거점', Box], ['retail', '백화점 유통망', '점포 상주 배송 거점', Globe], ['local', '지역 사무소', '권역 영업⁠·운영 지원', Pin]]
  const groups = GROUPS.map(([t, label, sub, Icon]) => ({ t, label, sub, Icon, list: c.offices.filter(o => o !== hq && cat(o.name).type === t) })).filter(g => g.list.length)
  const mapUrl = (a) => `https://map.naver.com/p/search/${encodeURIComponent(a)}`
  const copy = (addr, i) => { navigator.clipboard?.writeText(addr).then(() => { setCopied(i); setTimeout(() => setCopied(null), 1800) }) }

  return (
    <>
      <PageHead label="COMPANY" title="회사소개" desc="34년간 축적한 현장 역량과 6개 전문 계열사의 통합 인프라로 대한민국 공급망을 설계합니다." image="img/banner_company.jpg" crumb={['회사소개', '회사소개']} subnav={COMPANY_NAV} />

      {/* 회사 개요 — 좌측 정렬 에디토리얼 */}
      <section className="section">
        <div className="wrap">
          <div className="ov" data-reveal="">
            <div className="ov__head">
              <span className="sh-en">Overview</span>
              <h2 className="pre">{it.title}</h2>
            </div>
            <div className="ov__text">{it.desc.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>
          </div>
        </div>
      </section>

      {/* 핵심 역량 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead eyebrow="CORE COMPETENCIES" title="핵심 역량" />
          <ul className="lc">
            {(it.coreValues || []).map((v, i) => (
              <li key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <span className="lc__no">{String(i + 1).padStart(2, '0')}</span>
                {v.logo ? <div className="lc__logo"><img src={asset(v.logo)} alt={v.title} /></div> : <div className="lc__ic"><Leaf /></div>}
                <h3>{v.title}</h3><p>{v.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CEO 인사말 */}
      <section className="section" id="ceo">
        <div className="wrap">
          <SectionHead eyebrow="CEO MESSAGE" title="대표이사 인사말" />
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
          <SectionHead eyebrow="SUBSIDIARIES" title="계열사 현황" lead="6개 전문 법인이 각 물류 영역의 핵심 역량을 담당하며, 그룹 차원의 통합 시너지를 실현합니다." />
          <ol className="subx">
            {subs.map((s, i) => (
              <li key={i} data-reveal="" style={{ transitionDelay: `${i * .05}s` }}>
                <span className="subx__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="subx__role">{s.role}</span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
