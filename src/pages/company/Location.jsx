import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'
import { Pin, Route, Building, Truck } from '../../components/Icons'

export default function Location() {
  const { content: c } = useContent(); const d = c.directions; const co = c.company
  const q = encodeURIComponent(d.mapQuery || co.address)
  return (
    <>
      <PageHead label="LOCATION" title="찾아오시는 길" desc="삼원종합물류 서울 본사(서초구) 방문 안내입니다." image="img/banner_company.jpg" crumb={['회사소개', '찾아오시는 길']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <SectionHead center eyebrow="LOCATION & MAP" title="본사 오시는 길" />
          <div className="map-embed map-embed--wide" data-reveal="">
            <iframe title="삼원종합물류 본사 지도" src={`https://www.google.com/maps?q=${q}&z=17&output=embed&hl=ko`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <div className="map-links" data-reveal="">
            <a className="btn btn--naver" href={`https://map.naver.com/p/search/${q}`} target="_blank" rel="noreferrer">네이버 지도로 열기</a>
            <a className="btn btn--kakao" href={`https://map.kakao.com/?q=${q}`} target="_blank" rel="noreferrer">카카오맵으로 열기</a>
          </div>
          <div className="transit" data-reveal="">
            <h3 className="h-sub">교통편 및 주차 안내</h3>
            <div className="transit__grid">
              <div className="transit__item"><span className="card__icon"><Pin /></span><div><h4>본사 주소</h4><p>{co.address}</p><p className="small">대표전화 {co.phone} · 팩스 {co.fax}</p></div></div>
              <div className="transit__item"><span className="card__icon"><Route /></span><div><h4>지하철로 오시는 길</h4><p>{d.subway}</p></div></div>
              <div className="transit__item"><span className="card__icon"><Building /></span><div><h4>주차 안내</h4><p>{d.parking}</p></div></div>
              <div className="transit__item"><span className="card__icon"><Truck /></span><div><h4>버스로 오시는 길</h4><p>{d.bus}</p></div></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <SectionHead center eyebrow="OFFICES" title="사업장 안내" />
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            {c.offices.map((o, i) => <div className={`office ${o.main ? 'main' : ''}`} key={i} data-reveal=""><b>{o.name}</b><span>{o.address}</span></div>)}
          </div>
        </div>
      </section>
    </>
  )
}
