import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import CountUp from '../components/CountUp'
import KoreaMap from '../components/KoreaMap'
import { SectionHead } from '../components/Section'
import { partners } from '../data/partners'
import { ArrowRight, Check, Truck, Spark } from '../components/Icons'

function Hero({ hero }) {
  const imgs = (hero.images || []).filter(Boolean)
  const [i, setI] = useState(0)
  const [videoOk, setVideoOk] = useState(!!hero.video)
  const vref = useRef(null)
  useEffect(() => { if (videoOk || imgs.length < 2) return; const t = setInterval(() => setI(v => (v + 1) % imgs.length), 8000); return () => clearInterval(t) }, [imgs.length, videoOk])
  useEffect(() => {
    const v = vref.current; if (!v) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches || (navigator.connection && navigator.connection.saveData)) { setVideoOk(false); return }
    v.play().catch(() => setVideoOk(false))
  }, [hero.video])
  return (
    <section className="hero">
      <div className="hero__media">
        {videoOk && hero.video
          ? <video ref={vref} autoPlay muted loop playsInline poster={asset(hero.poster || imgs[0])} onError={() => setVideoOk(false)}>
              <source src={asset(hero.video)} type="video/mp4" />
            </video>
          : imgs.map((src, k) => <img key={k} src={asset(src)} alt="" className={k === i ? 'is-active' : ''} loading={k === 0 ? 'eager' : 'lazy'} />)}
      </div>
      <div className="hero__in">
        <div className="hero__eyebrow" data-reveal="fade">{hero.eyebrow}</div>
        <h1 className="h-display hero__title pre" data-reveal="">{hero.title}</h1>
        <p className="hero__sub" data-reveal="" style={{ transitionDelay: '.15s' }}>{hero.subtitle}</p>
        <div className="hero__actions" data-reveal="" style={{ transitionDelay: '.3s' }}>
          <Link className="btn btn--white btn--lg" to="/contact">{hero.primaryCta} <ArrowRight /></Link>
          <Link className="btn btn--ghost-white btn--lg" to="/business">{hero.secondaryCta}</Link>
        </div>
      </div>
      {!videoOk && imgs.length > 1 && <div className="hero__dots">{imgs.map((_, k) => <button key={k} className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-label={`배경 ${k + 1}`} />)}</div>}
      <div className="hero__scroll">SCROLL<span /></div>
    </section>
  )
}

export default function Home() {
  const { content: c } = useContent()
  const co = c.company
  const ext = (u) => /^https?:/.test(u || '')
  const PortalBtn = ({ url, label, cls }) => ext(url)
    ? <a className={`btn ${cls}`} href={url} target="_blank" rel="noreferrer">{label} <ArrowRight /></a>
    : <Link className={`btn ${cls}`} to={url && !url.startsWith('#') ? url : '/driver'}>{label} <ArrowRight /></Link>
  const loop = [...partners, ...partners]

  return (
    <>
      <Hero hero={c.hero} />

      {/* 1. 핵심 역량 (인증) — 첫 사이트 구성 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="CORE COMPETENCIES" title={c.certifications.title} lead="국가 공인 인증과 국제 표준 경영시스템으로 검증된 운영 품질" />
          <div className="certs">
            {c.certifications.items.map((ct, i) => (
              <div className="cert" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                {ct.logo ? <div className="cert__logo"><img src={asset(ct.logo)} alt={ct.name} loading="lazy" /></div> : <div className="badge">{ct.code}</div>}
                <h3>{ct.name}</h3><div className="org">{ct.org}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 핵심 지표 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="PERFORMANCE" title="삼원의 핵심 지표" />
          <div className="stats__grid" data-reveal="">
            {c.stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat__num"><CountUp value={Number(s.value)} /><small>{s.suffix}</small></div>
                <div className="stat__label">{s.label}</div>
                <div className="stat__sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 사업영역 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="BUSINESS AREAS" title="사업영역" lead="화주의 공급망 전 구간을 커버하는 5대 핵심 물류 서비스" />
          <div className="biz">
            {c.businessAreas.map((b, i) => (
              <Link to={`/business/${b.id}`} className="biz__card" key={b.id} data-reveal="" style={{ transitionDelay: `${i * .07}s` }}>
                <img src={asset(b.image)} alt={b.name} loading="lazy" />
                <div className="biz__in">
                  <div className="biz__en">{b.en}</div>
                  <div className="biz__title">{b.name} <ArrowRight /></div>
                  <p className="biz__desc">{b.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why 삼원 + 소개 */}
      <section className="section section--soft">
        <div className="wrap intro">
          <div data-reveal="">
            <span className="eyebrow">{c.why.eyebrow}</span>
            <h2 className="h-section pre">{c.why.title}</h2>
            <p className="lead">{c.why.lead}</p>
            <div className="why" style={{ marginTop: 32 }}>
              {c.why.items.map((w, i) => (
                <div className="why__item" key={i}><div className="why__num">{w.num}</div><div><h3>{w.title}</h3><p>{w.desc}</p></div></div>
              ))}
            </div>
            <Link className="btn btn--primary" to="/company/intro" style={{ marginTop: 32 }}>회사소개 보기 <ArrowRight /></Link>
          </div>
          <div className="photo photo--tall" data-reveal="" style={{ transitionDelay: '.1s' }}><img src={asset(c.intro.image)} alt="삼원종합물류" /></div>
        </div>
      </section>

      {/* 5. 네트워크 (실제 지도) */}
      <section className="section">
        <div className="wrap network">
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

      {/* 6. 파트너 (컬러) */}
      <section className="section section--soft">
        <div className="wrap"><SectionHead center eyebrow={c.partnersSection.eyebrow} title={c.partnersSection.title} lead={c.partnersSection.lead} /></div>
        <div className="marquee"><div className="marquee__track">{loop.map((p, i) => <div className="logo-tile" key={i}><img src={asset(p.logo)} alt={p.name} loading="lazy" /></div>)}</div></div>
        <div className="marquee marquee--rev"><div className="marquee__track">{[...loop].reverse().map((p, i) => <div className="logo-tile" key={i}><img src={asset(p.logo)} alt={p.name} loading="lazy" /></div>)}</div></div>
        <div className="wrap"><p className="small muted" style={{ marginTop: 24, textAlign: 'center' }}>{c.partnersSection.note}</p></div>
      </section>

      {/* 7. 차주 전용 · 에스원퀵 */}
      <section className="section" id="driver">
        <div className="wrap portals">
          <div className="portal portal--driver" data-reveal="">
            <div className="portal__icon"><Truck /></div>
            <span className="eyebrow">{c.portals.driver.eyebrow}</span>
            <h2>{c.portals.driver.title}</h2>
            <p>{c.portals.driver.desc}</p>
            <PortalBtn url={co.driverUrl} label={c.portals.driver.button} cls="btn--white" />
          </div>
          <div className="portal portal--quick" data-reveal="" style={{ transitionDelay: '.1s' }}>
            <div className="portal__icon"><Spark /></div>
            <span className="eyebrow">{c.portals.s1quick.eyebrow}</span>
            <h2>{c.portals.s1quick.title}</h2>
            <p>{c.portals.s1quick.desc}</p>
            <PortalBtn url={co.s1quickUrl} label={c.portals.s1quick.button} cls="btn--white" />
          </div>
        </div>
      </section>

      {/* 8. 상담 CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta" data-reveal="">
            <img src={asset(c.cta.image)} alt="" loading="lazy" />
            <h2>{c.cta.title}</h2><p>{c.cta.desc}</p>
            <Link className="btn btn--white btn--lg" to="/contact">{c.cta.button} <ArrowRight /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
