import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { COMPANY_NAV } from './companyNav'

export default function Location() {
  const { content: c } = useContent()
  const d = c.directions
  const q = encodeURIComponent(d.mapQuery || c.company.address)
  return (
    <>
      <PageHead label="LOCATION" title="오시는 길" desc="서울 본사 및 사업장 안내" image="img/banner_company.jpg" crumb={['회사소개', '오시는 길']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="map-embed" data-reveal="">
            <iframe title="서울 본사 지도" src={`https://www.google.com/maps?q=${q}&output=embed&hl=ko`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <div data-reveal="">
            <span className="eyebrow">HEAD OFFICE</span>
            <h2 className="h-section">서울 본사</h2>
            <p className="lead">{c.company.address}</p>
            <div className="info-rows">
              <div><b>전화</b><span>{c.company.phone}</span></div>
              <div><b>팩스</b><span>{c.company.fax}</span></div>
              <div><b>이메일</b><span>{c.company.email}</span></div>
              <div><b>지하철</b><span>{d.subway}</span></div>
              <div><b>버스</b><span>{d.bus}</span></div>
              <div><b>주차</b><span>{d.parking}</span></div>
            </div>
            <a className="btn btn--ghost" style={{ marginTop: 24 }} href={`https://map.naver.com/p/search/${q}`} target="_blank" rel="noreferrer">네이버 지도에서 열기</a>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container container--narrow">
          <SectionHead eyebrow="OFFICES" title="사업장 안내" />
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            {c.offices.map((o, i) => <div className={`office ${o.main ? 'main' : ''}`} key={i} data-reveal=""><b>{o.name}</b><span>{o.address}</span></div>)}
          </div>
        </div>
      </section>
    </>
  )
}
