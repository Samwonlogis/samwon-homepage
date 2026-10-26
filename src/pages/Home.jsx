import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import CountUp from '../components/CountUp'
import KoreaMap from '../components/KoreaMap'
import { SectionHead } from '../components/Section'
import { partners } from '../data/partners'
import { ArrowRight, ArrowDown, Check } from '../components/Icons'

function Hero({ hero }) {
  const imgs = (hero.images || []).filter(Boolean)
  const [i, setI] = useState(0)
  useEffect(() => { if (imgs.length < 2) return; const t = setInterval(() => setI(v => (v + 1) % imgs.length), 7000); return () => clearInterval(t) }, [imgs.length])
  return (
    <section className="hero">
      <div className="hero__bg">{imgs.map((src, k) => <img key={k} src={asset(src)} alt="" className={k === i ? 'is-active' : ''} loading={k === 0 ? 'eager' : 'lazy'} />)}</div>
      <div className="container hero__in">
        <div className="hero__eyebrow" data-reveal="fade">{hero.eyebrow}</div>
        <h1 className="h-display hero__title pre" data-reveal="" >{hero.title}</h1>
        <p className="hero__sub" data-reveal="" style={{ transitionDelay: '.15s' }}>{hero.subtitle}</p>
        <div className="hero__actions" data-reveal="" style={{ transitionDelay: '.3s' }}>
          <Link className="btn btn--white" to="/contact">{hero.primaryCta} <ArrowRight /></Link>
          <Link className="btn btn--ghost-white" to="/business">{hero.secondaryCta}</Link>
        </div>
      </div>
      {imgs.length > 1 && <div className="hero__dots">{imgs.map((_, k) => <button key={k} className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-label={`배경 ${k + 1}`} />)}</div>}
      <div className="hero__scroll">SCROLL <ArrowDown style={{ width: 14 }} /></div>
    </section>
  )
}

export default function Home() {
  const { content: c } = useContent()
  const loop = [...partners, ...partners]
  return (
    <>
      <Hero hero={c.hero} />

      <div className="container stats" data-reveal="">
        <div className="stats__grid">
          {c.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat__num"><CountUp value={Number(s.value)} /><small>{s.suffix}</small></div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container why">
          <div className="why__head" data-reveal="">
            <span className="eyebrow">{c.why.eyebrow}</span>
            <h2 className="h-section pre">{c.why.title}</h2>
            <p className="lead">{c.why.lead}</p>
            <Link className="btn btn--primary" to="/company/intro" style={{ marginTop: 28 }}>회사소개 보기 <ArrowRight /></Link>
          </div>
          <div className="why__list">
            {c.why.items.map((w, i) => (
              <div className="why__item" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <div className="why__num">{w.num}</div>
                <div><h3>{w.title}</h3><p>{w.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHead eyebrow="BUSINESS AREAS" title={'공급망 전 구간을 하나의 창구로\n연결하는 5대 사업영역'} lead="미들마일에서 라스트마일까지, 운송·보관·플랫폼·컨설팅을 6개 전문 법인이 분담하고 삼원종합물류가 통합 관제합니다." />
          <div className="biz-grid">
            {c.businessAreas.map((b, i) => (
              <Link to={`/business/${b.id}`} className="biz-card" key={b.id} data-reveal="" style={{ transitionDelay: `${i * .07}s` }}>
                <img src={asset(b.image)} alt={b.name} loading="lazy" />
                <div className="biz-card__in">
                  <div className="biz-card__en">{b.en}</div>
                  <div className="biz-card__title">{b.name} <ArrowRight /></div>
                  <p className="biz-card__desc">{b.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container network">
          <div className="map" data-reveal=""><KoreaMap hubs={c.network.hubs} /></div>
          <div data-reveal="">
            <span className="eyebrow">{c.network.eyebrow}</span>
            <h2 className="h-section pre">{c.network.title}</h2>
            <p className="lead">{c.network.lead}</p>
            <ul className="net-points">{c.network.points.map((p, i) => <li key={i}><Check />{p}</li>)}</ul>
            <ul className="hub-list">{c.network.hubs.map((h, i) => <li key={i} className={h.main ? 'main' : ''}><b>{h.name}</b><span>{h.region}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHead center eyebrow={c.certifications.eyebrow} title={c.certifications.title} />
          <div className="cert-grid">
            {c.certifications.items.map((ct, i) => (
              <div className="cert" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className={`badge ${/^\d/.test(ct.code) ? 'badge--iso' : ''}`}><span>{/^\d/.test(ct.code) ? <>ISO<br />{ct.code}</> : ct.code}</span></div>
                <h3>{ct.title}</h3><div className="org">{ct.org}</div><p>{ct.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow={c.partnersSection.eyebrow} title={c.partnersSection.title} lead={c.partnersSection.lead} />
        </div>
        <div className="marquee"><div className="marquee__track">{loop.map((p, i) => <div className="logo-tile" key={i}><img src={p.logo} alt={p.name} loading="lazy" /></div>)}</div></div>
        <div className="marquee marquee--rev"><div className="marquee__track">{[...loop].reverse().map((p, i) => <div className="logo-tile" key={i}><img src={p.logo} alt={p.name} loading="lazy" /></div>)}</div></div>
        <div className="container"><p className="small muted" style={{ marginTop: 20, textAlign: 'center' }}>{c.partnersSection.note}</p></div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHead eyebrow="CASE STUDIES" title="산업별 운영 사례" />
          <div className="case-grid">
            {c.caseStudies.map((cs, i) => (
              <div className="case" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <span className="tag">{cs.service}</span><h3>{cs.client}</h3><p>{cs.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta" data-reveal="">
            <img src={asset(c.cta.image)} alt="" loading="lazy" />
            <h2>{c.cta.title}</h2><p>{c.cta.desc}</p>
            <Link className="btn btn--white" to="/contact">{c.cta.button} <ArrowRight /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
