import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import CountUp from '../components/CountUp'
import KoreaMap from '../components/KoreaMap'
import { SectionHead } from '../components/Section'
import { partners } from '../data/partners'
import { ArrowRight, Check } from '../components/Icons'

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
              {hero.videoWebm && <source src={asset(hero.videoWebm)} type="video/webm" />}
              <source src={asset(hero.video)} type="video/mp4" />
            </video>
          : imgs.map((src, k) => <img key={k} src={asset(src)} alt="" className={k === i ? 'is-active' : ''} loading={k === 0 ? 'eager' : 'lazy'} />)}
      </div>
      <div className="hero__in">
        <div className="hero__eyebrow" data-reveal="fade">{hero.eyebrow}</div>
        <h1 className="h-display hero__title pre" data-reveal="">{hero.title}</h1>
        <p className="hero__sub" data-reveal="" style={{ transitionDelay: '.15s' }}>{hero.subtitle}</p>
        <div className="hero__actions" data-reveal="" style={{ transitionDelay: '.3s' }}>
          <Link className="btn btn--white" to="/contact">{hero.primaryCta} <ArrowRight /></Link>
          <Link className="btn btn--ghost-white" to="/business">{hero.secondaryCta}</Link>
        </div>
      </div>
      {!videoOk && imgs.length > 1 && <div className="hero__dots">{imgs.map((_, k) => <button key={k} className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-label={`배경 ${k + 1}`} />)}</div>}
      {videoOk && <div className="hero__scroll">SCROLL<span /></div>}
    </section>
  )
}

export default function Home() {
  const { content: c } = useContent()
  const loop = [...partners, ...partners]
  return (
    <>
      <Hero hero={c.hero} />

      <div className="wrap stats" data-reveal="">
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

      {/* 소개 */}
      <section className="section">
        <div className="wrap intro">
          <div data-reveal="">
            <span className="eyebrow">{c.intro.eyebrow}</span>
            <h2 className="h-section pre">{c.intro.title}</h2>
            <p className="lead">{c.why.lead}</p>
            <Link className="link" to="/company/intro" style={{ marginTop: 28 }}>회사소개 보기 <ArrowRight /></Link>
          </div>
          <div className="photo photo--tall" data-reveal="" style={{ transitionDelay: '.1s' }}><img src={asset(c.intro.image)} alt="삼원종합물류" /></div>
        </div>
      </section>

      {/* Why */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow={c.why.eyebrow} title={c.why.title} />
          <div className="why" style={{ maxWidth: 880, margin: '0 auto' }}>
            {c.why.items.map((w, i) => (
              <div className="why__item" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <div className="why__num">{w.num}</div>
                <div><h3>{w.title}</h3><p>{w.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사업영역 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="BUSINESS AREAS" title={'공급망 전 구간을 하나의 창구로\n연결하는 5대 사업영역'} lead="미들마일에서 라스트마일까지, 운송·보관·플랫폼·컨설팅을 6개 전문 법인이 분담하고 삼원종합물류가 통합 관제합니다." />
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

      {/* 네트워크 */}
      <section className="section section--soft">
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

      {/* 인증 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow={c.certifications.eyebrow} title={c.certifications.title} />
          <div className="certs">
            {c.certifications.items.map((ct, i) => (
              <div className="cert" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                {ct.logo ? <div className="cert__logo"><img src={asset(ct.logo)} alt={ct.name} loading="lazy" /></div> : <div className="badge">{/^\d/.test(ct.code) ? <span>ISO<br />{ct.code}</span> : ct.code}</div>}
                <h3>{ct.name}</h3><div className="org">{ct.org}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 파트너 */}
      <section className="section section--soft">
        <div className="wrap"><SectionHead center eyebrow={c.partnersSection.eyebrow} title={c.partnersSection.title} lead={c.partnersSection.lead} /></div>
        <div className="marquee"><div className="marquee__track">{loop.map((p, i) => <div className="logo-tile" key={i}><img src={p.logo} alt={p.name} loading="lazy" /></div>)}</div></div>
        <div className="marquee marquee--rev"><div className="marquee__track">{[...loop].reverse().map((p, i) => <div className="logo-tile" key={i}><img src={p.logo} alt={p.name} loading="lazy" /></div>)}</div></div>
        <div className="wrap"><p className="small muted" style={{ marginTop: 24, textAlign: 'center' }}>{c.partnersSection.note}</p></div>
      </section>

      {/* 사례 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="CASE STUDIES" title="산업별 운영 사례" />
          <div className="cases">
            {c.caseStudies.map((cs, i) => (
              <div className="case" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <span className="tag">{cs.service}</span><h3>{cs.client}</h3><p>{cs.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
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
