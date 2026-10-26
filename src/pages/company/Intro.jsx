import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { COMPANY_NAV } from './companyNav'
import { Shield, Target, Spark, Check, ArrowRight } from '../../components/Icons'

const VI = [Shield, Target, Spark, Check]

export default function Intro() {
  const { content: c } = useContent()
  const it = c.intro, ceo = c.ceo
  return (
    <>
      <PageHead label="COMPANY" title="회사개요" desc="1992년 창립 이래 34년, 6개 전문 계열사가 하나의 책임 단위로 움직이는 종합물류 그룹" crumb={['회사소개', '회사개요']} subnav={COMPANY_NAV} />
      <section className="section">
        <div className="container split">
          <div data-reveal="">
            <span className="eyebrow">{it.eyebrow}</span>
            <h2 className="h-section pre">{it.title}</h2>
            <p className="lead pre">{it.desc}</p>
          </div>
          <div className="photo" data-reveal=""><img src={asset(it.image)} alt="삼원종합물류 운송 차량" /></div>
        </div>
      </section>
      <section className="section section--tint" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="vm-grid" style={{ marginTop: 0 }}>
            <div className="vm" data-reveal=""><span className="eyebrow">VISION</span><h3>{it.vision.desc}</h3></div>
            <div className="vm vm--navy" data-reveal="" style={{ transitionDelay: '.1s' }}><span className="eyebrow">MISSION</span><h3>{it.mission.desc}</h3></div>
          </div>
          <div className="card-grid card-grid--4" style={{ marginTop: 16 }}>
            {it.values.map((v, i) => { const Ic = VI[i % VI.length]; return (
              <div className="card" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}><div className="card__icon"><Ic /></div><h3>{v.title}</h3><p>{v.desc}</p></div>) })}
          </div>
        </div>
      </section>
      <section className="section" id="ceo">
        <div className="container split split--rev" style={{ alignItems: 'start' }}>
          <div data-reveal="">
            <span className="eyebrow">CEO MESSAGE</span>
            <h2 className="h-section">{ceo.headline}</h2>
            <div style={{ marginTop: 24, display: 'grid', gap: 16, color: 'var(--ink-2)', fontSize: '1.02rem' }}>{ceo.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
            <p style={{ marginTop: 28, fontWeight: 800 }}>{c.company.name} {ceo.title} <span className="t-blue" style={{ fontSize: '1.25rem', marginLeft: 6 }}>{ceo.name}</span></p>
          </div>
          <div className="photo photo--portrait" data-reveal="" style={{ maxWidth: 420 }}>
            {ceo.photo ? <img src={asset(ceo.photo)} alt={`${ceo.title} ${ceo.name}`} /> : <div className="placeholder">대표이사 사진 (관리자에서 등록)</div>}
          </div>
        </div>
      </section>
      <section className="section section--tint" style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Link className="btn btn--primary" to="/company/history">연혁 보기 <ArrowRight /></Link>
        </div>
      </section>
    </>
  )
}
