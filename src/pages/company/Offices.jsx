import { useMemo, useState } from 'react'
import PageHead from '../../components/PageHead'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'
import { Building, Box, Pin, Globe } from '../../components/Icons'

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
      <PageHead label="OFFICES" title="사무소" desc="서울 본사를 중심으로 전국을 잇는 삼원종합물류의 사업장을 안내합니다." logo crumb={['회사소개', '사무소']} subnav={COMPANY_NAV} />

      <section className="section ofy-sec">
        <div className="wrap">
          <header className="ofy-head" data-reveal="">
            <div className="title-block" style={{ textAlign: 'left', marginBottom: 0 }}><span className="title-block__en">Our Offices</span><h3>사무소 현황</h3></div>
            <p className="ofy-head__lead">서울 본사와 수도권 물류 거점, 백화점 상주 사무소, 지역 사무소를 운영합니다. 목록에서 선택하면 위치를 확인할 수 있습니다.</p>
          </header>

          <div className="ofy-filter" role="tablist" data-reveal="">
            {[{ t: 'all', label: '전체', en: 'ALL' }, ...tabs].map(t => (
              <button key={t.t} type="button" role="tab" aria-selected={tab === t.t} className={tab === t.t ? 'is-on' : ''} onClick={() => { setTab(t.t); setSel(0) }}>
                <span>{t.label}</span><em>{t.t === 'all' ? offices.length : offices.filter(o => o.type === t.t).length}</em>
              </button>
            ))}
          </div>

          <div className="ofy" data-reveal="">
            <ol className="ofy-list">
              {list.map((o, i) => (
                <li key={o.name}>
                  <button type="button" className={cur === o ? 'is-on' : ''} onClick={() => setSel(i)} aria-pressed={cur === o}>
                    <span className="ofy-list__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ofy-list__txt"><b>{o.name}</b><span>{o.address}</span></span>
                    <span className="ofy-list__type">{TYPES.find(t => t.t === o.type)?.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            {cur && (
              <aside className="ofy-view">
                <div className="ofy-map">
                  <iframe key={cur.name} title={`${cur.name} 지도`} src={`https://www.google.com/maps?q=${enc(cur.address)}&z=${cur.address.length > 12 ? 16 : 12}&output=embed&hl=ko`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="ofy-info">
                  <span className="ofy-info__en">{curType.en}</span>
                  <h4>{cur.name}</h4>
                  <dl>
                    <div><dt>주소</dt><dd>{cur.address}</dd></div>
                    {cur.type === 'hq' && <div><dt>대표전화</dt><dd><a href={`tel:${co.phone}`}>{co.phone}</a></dd></div>}
                    {cur.type === 'hq' && <div><dt>팩스</dt><dd>{co.fax}</dd></div>}
                  </dl>
                  <div className="ofy-info__links">
                    <a href={`https://map.naver.com/p/search/${enc(cur.address)}`} target="_blank" rel="noreferrer">네이버 지도 →</a>
                    <a href={`https://map.kakao.com/?q=${enc(cur.address)}`} target="_blank" rel="noreferrer">카카오맵 →</a>
                    <button type="button" onClick={() => copy(cur.address)}>{copied ? '복사 완료' : '주소 복사'}</button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      <section className="section section--soft ofy-loc" id="location">
        <div className="wrap">
          <header className="ofy-head" data-reveal="">
            <div className="title-block" style={{ textAlign: 'left', marginBottom: 0 }}><span className="title-block__en">Location</span><h3>본사 오시는 길</h3></div>
            <div className="ofy-loc__btns">
              <a className="btn btn--naver" href={`https://map.naver.com/p/search/${q}`} target="_blank" rel="noreferrer">네이버 지도</a>
              <a className="btn btn--kakao" href={`https://map.kakao.com/?q=${q}`} target="_blank" rel="noreferrer">카카오맵</a>
            </div>
          </header>
          <div className="ofy-loc__grid" data-reveal="">
            <div className="ofy-map ofy-map--lg"><iframe title="삼원종합물류 본사 지도" src={`https://www.google.com/maps?q=${q}&z=17&output=embed&hl=ko`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
            <dl className="ofy-way">
              <div><dt>주소</dt><dd>{co.address}</dd></div>
              <div><dt>연락처</dt><dd>대표전화 {co.phone}<br />팩스 {co.fax}</dd></div>
              <div><dt>지하철</dt><dd>{d.subway}</dd></div>
              <div><dt>버스</dt><dd>{d.bus}</dd></div>
              <div><dt>주차</dt><dd>{d.parking}</dd></div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
