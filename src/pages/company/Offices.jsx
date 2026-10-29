import { useMemo, useState } from 'react'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'
import { Building, Box, Pin, Globe, Route, Truck } from '../../components/Icons'

const TYPES = [
  { t: 'hq', label: '본사', en: 'HEADQUARTERS', Icon: Building },
  { t: 'main', label: '물류 거점', en: 'LOGISTICS HUB', Icon: Box },
  { t: 'retail', label: '백화점 유통망', en: 'RETAIL NETWORK', Icon: Globe },
  { t: 'local', label: '지역 사무소', en: 'REGIONAL OFFICE', Icon: Pin },
]
const typeOf = (name = '') => {
  if (name.includes('본사')) return 'hq'
  if (/허브|물류센터|차고지/.test(name)) return 'main'
  if (/백화점|더현대/.test(name)) return 'retail'
  return 'local'
}

// 사무소 — 사무소 현황(탭 + 지도 선택형) + 맨 아래 본사 오시는 길
export default function Offices() {
  const { content: c } = useContent()
  const d = c.directions || {}; const co = c.company
  const offices = useMemo(() => (c.offices || []).map(o => ({ ...o, type: typeOf(o.name) })), [c.offices])
  const tabs = TYPES.filter(t => offices.some(o => o.type === t.t))
  const [tab, setTab] = useState('all')
  const list = tab === 'all' ? offices : offices.filter(o => o.type === tab)
  const [sel, setSel] = useState(0)
  const cur = list[Math.min(sel, list.length - 1)] || offices[0]
  const [copied, setCopied] = useState(false)
  const copy = (addr) => { navigator.clipboard?.writeText(addr).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) }) }
  const enc = (a) => encodeURIComponent(a || '')
  const q = enc(d.mapQuery || co.address)
  const curType = TYPES.find(t => t.t === cur?.type) || TYPES[0]

  return (
    <>
      <PageHead label="OFFICES" title="사무소" desc="서울 본사를 중심으로 전국을 잇는 삼원종합물류의 사업장을 안내합니다." image="img/banner_company.jpg" crumb={['회사소개', '사무소']} subnav={COMPANY_NAV} />

      <section className="section ofx-sec">
        <div className="wrap">
          <div className="title-block" data-reveal="">
            <span className="title-block__en">Our Offices</span>
            <h3>사무소 현황</h3>
          </div>

          {/* 유형별 요약 */}
          <ul className="ofx-sum" data-reveal="">
            {tabs.map(t => (
              <li key={t.t}>
                <span className="ofx-sum__ic"><t.Icon /></span>
                <div><em>{t.en}</em><b>{t.label}</b></div>
                <strong>{offices.filter(o => o.type === t.t).length}<small>곳</small></strong>
              </li>
            ))}
          </ul>

          {/* 탭 */}
          <div className="ofx-tabs" role="tablist" data-reveal="">
            {[{ t: 'all', label: '전체' }, ...tabs].map(t => (
              <button key={t.t} type="button" role="tab" aria-selected={tab === t.t} className={tab === t.t ? 'is-on' : ''} onClick={() => { setTab(t.t); setSel(0) }}>{t.label}</button>
            ))}
          </div>

          <div className="ofx" data-reveal="">
            <ol className="ofx-list">
              {list.map((o, i) => (
                <li key={o.name}>
                  <button type="button" className={cur === o ? 'is-on' : ''} onClick={() => setSel(i)}>
                    <span className="ofx-list__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ofx-list__txt"><b>{o.name}</b><span>{o.address}</span></span>
                    <span className="ofx-list__tag">{TYPES.find(t => t.t === o.type)?.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            {cur && (
              <div className="ofx-view">
                <div className="ofx-map">
                  <iframe key={cur.name} title={`${cur.name} 지도`} src={`https://www.google.com/maps?q=${enc(cur.address)}&z=${cur.address.length > 12 ? 16 : 12}&output=embed&hl=ko`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="ofx-info">
                  <div>
                    <span className="ofx-info__en">{curType.en}</span>
                    <h4><em>삼원종합물류</em> {cur.name}</h4>
                    <p>{cur.address}{cur.type === 'hq' && <> / {co.phone}</>}</p>
                  </div>
                  <div className="ofx-info__btns">
                    <a href={`https://map.naver.com/p/search/${enc(cur.address)}`} target="_blank" rel="noreferrer">네이버 지도</a>
                    <a href={`https://map.kakao.com/?q=${enc(cur.address)}`} target="_blank" rel="noreferrer">카카오맵</a>
                    <button type="button" onClick={() => copy(cur.address)}>{copied ? '복사 완료' : '주소 복사'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="location">
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <div className="title-block" data-reveal="">
            <span className="title-block__en">Location</span>
            <h3>본사 오시는 길</h3>
          </div>
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
