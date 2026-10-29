import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'
import { Building, Box, Pin, Globe, Route, Truck, ArrowRight } from '../../components/Icons'

const cat = (name) => {
  if (name.includes('본사')) return { label: '본사 (HQ)', type: 'hq', Icon: Building }
  if (/허브|물류센터|차고지/.test(name)) return { label: '물류 거점', type: 'main', Icon: Box }
  if (/백화점|더현대/.test(name)) return { label: '백화점 유통망', type: 'retail', Icon: Globe }
  return { label: '지역 사무소', type: 'local', Icon: Pin }
}

// 사무소 — 사무소 현황 + 맨 아래 본사 오시는 길
export default function Offices() {
  const { content: c } = useContent()
  const d = c.directions || {}; const co = c.company
  const [copied, setCopied] = useState(null)
  const hq = c.offices.find(o => cat(o.name).type === 'hq') || c.offices[0]
  const GROUPS = [['main', '물류 거점', '차량 운영·상하차 거점', Box], ['retail', '백화점 유통망', '점포 상주 배송 거점', Globe], ['local', '지역 사무소', '권역 영업·운영 지원', Pin]]
  const groups = GROUPS.map(([t, label, sub, Icon]) => ({ t, label, sub, Icon, list: c.offices.filter(o => o !== hq && cat(o.name).type === t) })).filter(g => g.list.length)
  const mapUrl = (a) => `https://map.naver.com/p/search/${encodeURIComponent(a)}`
  const copy = (addr, i) => { navigator.clipboard?.writeText(addr).then(() => { setCopied(i); setTimeout(() => setCopied(null), 1800) }) }
  const q = encodeURIComponent(d.mapQuery || co.address)

  return (
    <>
      <PageHead label="OFFICES" title="사무소" desc="서울 본사를 중심으로 전국을 잇는 삼원종합물류의 사업장을 안내합니다." image="img/banner_company.jpg" crumb={['회사소개', '사무소']} subnav={COMPANY_NAV} />

      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="OFFICES" title="사무소 현황" lead="서울 본사를 중심으로 물류 거점, 백화점 유통망, 지역 사무소가 하나의 네트워크로 움직입니다." />
          <div className="ofc">
            {hq && (
              <div className="ofc-hq" data-reveal="">
                <div className="ofc-hq__main">
                  <span className="ofc-hq__tag"><Building /> HEADQUARTERS</span>
                  <h3>{hq.name}</h3>
                  <p className="ofc-hq__addr">{hq.address}</p>
                  <dl className="ofc-hq__info">
                    <div><dt>대표 전화</dt><dd><a href={`tel:${c.company.phone}`}>{c.company.phone}</a></dd></div>
                    <div><dt>팩스</dt><dd>{c.company.fax}</dd></div>
                    <div><dt>이메일</dt><dd>{c.company.email}</dd></div>
                  </dl>
                </div>
                <div className="ofc-hq__act">
                  <a className="btn btn--white btn--sm" href={mapUrl(hq.address)} target="_blank" rel="noreferrer"><Pin /> 지도 보기</a>
                  <button type="button" className="btn btn--line-w btn--sm" onClick={() => copy(hq.address, 'hq')}>{copied === 'hq' ? '복사 완료' : '주소 복사'}</button>
                  <a className="btn btn--line-w btn--sm" href="#location">오시는 길 <ArrowRight /></a>
                </div>
              </div>
            )}
            <div className="ofc-groups">
              {groups.map((g, gi) => (
                <div className="ofc-group" key={g.t} data-reveal="" style={{ transitionDelay: `${gi * .08}s` }}>
                  <div className="ofc-group__head">
                    <span className="ofc-group__icon"><g.Icon /></span>
                    <div><b>{g.label}</b><span>{g.sub}</span></div>
                    <em>{g.list.length}</em>
                  </div>
                  <ul>
                    {g.list.map(o => { const key = o.name; return (
                      <li key={key}>
                        <div><b>{o.name}</b><span>{o.address}</span></div>
                        <div className="ofc-row__act">
                          <button type="button" aria-label="주소 복사" title="주소 복사" onClick={() => copy(o.address, key)} className={copied === key ? 'is-done' : ''}>{copied === key ? '✓' : '복사'}</button>
                          <a href={mapUrl(o.address)} target="_blank" rel="noreferrer" aria-label={`${o.name} 지도 보기`} title="지도 보기"><Pin /></a>
                        </div>
                      </li>) })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft" id="location">
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <SectionHead center eyebrow="LOCATION" title="본사 오시는 길" lead={co.address} />
          <div className="map-embed map-embed--wide" data-reveal="">
            <iframe title="삼원종합물류 본사 지도" src={`https://www.google.com/maps?q=${q}&z=17&output=embed&hl=ko`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <div className="map-links" data-reveal="">
            <a className="btn btn--naver" href={`https://map.naver.com/p/search/${q}`} target="_blank" rel="noreferrer">네이버 지도로 열기</a>
            <a className="btn btn--kakao" href={`https://map.kakao.com/?q=${q}`} target="_blank" rel="noreferrer">카카오맵으로 열기</a>
          </div>
          <div className="way" data-reveal="">
            <div className="way__item"><span className="way__ic"><Pin /></span><div><h4>본사 주소</h4><p>{co.address}</p><p className="way__sub">대표전화 {co.phone} · 팩스 {co.fax}</p></div></div>
            <div className="way__item"><span className="way__ic"><Route /></span><div><h4>지하철</h4><p>{d.subway}</p></div></div>
            <div className="way__item"><span className="way__ic"><Truck /></span><div><h4>버스</h4><p>{d.bus}</p></div></div>
            <div className="way__item"><span className="way__ic"><Building /></span><div><h4>주차</h4><p>{d.parking}</p></div></div>
          </div>
        </div>
      </section>
    </>
  )
}
