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
  const parent = c.subsidiaries.find(s => /^삼원종합물류/.test(s.name)) || c.subsidiaries[0]
  const hq = c.offices.find(o => cat(o.name).type === 'hq') || c.offices[0]
  const GROUPS = [['main', '물류 거점', '차량 운영⁠·상하차 거점', Box], ['retail', '백화점 유통망', '점포 상주 배송 거점', Globe], ['local', '지역 사무소', '권역 영업⁠·운영 지원', Pin]]
  const groups = GROUPS.map(([t, label, sub, Icon]) => ({ t, label, sub, Icon, list: c.offices.filter(o => o !== hq && cat(o.name).type === t) })).filter(g => g.list.length)
  const mapUrl = (a) => `https://map.naver.com/p/search/${encodeURIComponent(a)}`
  const copy = (addr, i) => { navigator.clipboard?.writeText(addr).then(() => { setCopied(i); setTimeout(() => setCopied(null), 1800) }) }

  return (
    <>
      <PageHead label="COMPANY" title="회사소개" desc="34년간 축적한 현장 역량과 6개 전문 계열사의 통합 인프라로 대한민국 공급망을 설계합니다." logo="zoom" crumb={['회사소개', '회사소개']} subnav={COMPANY_NAV} />

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
          <SectionHead eyebrow="MESSAGE FROM THE CHAIRMAN" title="회장 인사말" />
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

      {/* 계열사 현황 — 에디토리얼 구조도 */}
      <section className="section" id="group">
        <div className="wrap">
          <SectionHead eyebrow="GROUP COMPANIES" title="계열사 현황" lead="삼원종합물류를 중심으로 6개 전문 법인이 운송⁠·배송⁠·특수화물⁠·인력⁠·플랫폼을 분담합니다. 하나의 창구로 계약하면 그룹 전체의 역량이 움직입니다." />
          <div className="gc" data-reveal="">
            <aside className="gc__parent">
              <img className="gc__logo" src={asset('samwon_logo.svg')} alt="SAMWON" />
              <span className="gc__kicker">Holding · {parent.role}</span>
              <h3>{parent.name}</h3>
              <p>{parent.desc}</p>
              <dl className="gc__facts">
                <div><dt>창립</dt><dd>1992</dd></div>
                <div><dt>계열 법인</dt><dd>6개사</dd></div>
                <div><dt>운송 네트워크</dt><dd>1,000대 이상</dd></div>
                <div><dt>본사⁠·거점</dt><dd>{parent.location}</dd></div>
              </dl>
            </aside>
            <ol className="gc__list">
              {subs.map((s, i) => (
                <li key={i} className="gc__row">
                  <span className="gc__no">{String(i + 1).padStart(2, '0')}</span>
                  <div className="gc__name"><h4>{s.name}</h4><span>{s.role}</span></div>
                  <p className="gc__desc">{s.desc}</p>
                  <span className="gc__loc">{s.location}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
