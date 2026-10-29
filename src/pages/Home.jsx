import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import CountUp from '../components/CountUp'
import KoreaMap from '../components/KoreaMap'
import { SectionHead } from '../components/Section'
import { partners } from '../data/partners'
import { ArrowRight, Check, Truck, Spark, Building, Shield, Chart, Route, Clock, Users, Phone } from '../components/Icons'

const ICONS = { truck: Truck, building: Building, shield: Shield, chart: Chart, route: Route, clock: Clock, users: Users, spark: Spark }
const WHY_ICONS = [Truck, Building, Shield, Chart]
const NET_ICONS = [Route, Clock, Users]
const groupHubs = (hubs = []) => {
  const m = new Map()
  hubs.forEach(h => { const g = h.group || h.region || '기타'; if (!m.has(g)) m.set(g, []); m.get(g).push(h) })
  return [...m.entries()]
}

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
      <div className="wrap hero__in hero__in--left">
        <span className="hero__kicker" data-reveal="">{hero.kicker || 'SAMWON LOGISTICS'}</span>
        <h1 className="hero__en pre" data-reveal="" style={{ transitionDelay: '.08s' }}>{hero.enTitle || 'Total Logistics\nPartner, SAMWON'}</h1>
        <p className="hero__ko pre" data-reveal="" style={{ transitionDelay: '.16s' }}>{hero.title}</p>
        <div className="hero__rounds" data-reveal="" style={{ transitionDelay: '.26s' }}>
          <Link className="round-btn" to="/company/intro"><Building /><span>회사소개</span></Link>
          <Link className="round-btn round-btn--accent" to="/contact"><Phone /><span>물류 상담</span></Link>
        </div>
      </div>
      {!videoOk && imgs.length > 1 && <div className="hero__dots">{imgs.map((_, k) => <button key={k} className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-label={`배경 ${k + 1}`} />)}</div>}
      <div className="hero__scroll">SCROLL<span /></div>
    </section>
  )
}

const STRENGTH_IMAGES = ['img/hero_2.jpg', 'img/banner_company.jpg', 'img/biz_warehouse.jpg', 'img/biz_consulting.jpg']

function StrengthSlider({ why }) {
  const items = why.items || []
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused || items.length < 2) return; const t = setInterval(() => setI(v => (v + 1) % items.length), 6000); return () => clearInterval(t) }, [paused, items.length])
  const cur = items[i] || {}
  return (
    <div className="ss" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="ss__media" data-reveal="">
        {items.map((w, k) => <img key={k} src={asset(w.image || STRENGTH_IMAGES[k % STRENGTH_IMAGES.length])} alt="" className={k === i ? 'is-on' : ''} loading="lazy" />)}
        <div className="ss__arrows">
          <button type="button" aria-label="이전" onClick={() => setI((i - 1 + items.length) % items.length)}><ArrowRight style={{ transform: 'rotate(180deg)' }} /></button>
          <button type="button" aria-label="다음" onClick={() => setI((i + 1) % items.length)}><ArrowRight /></button>
        </div>
      </div>
      <div className="ss__text" data-reveal="">
        <span className="ss__en">Core<br />Strength</span>
        <h2 className="ss__ko">{why.title}</h2>
        <div className="ss__tabs" role="tablist">
          {items.map((w, k) => <button key={k} type="button" role="tab" aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => setI(k)}>{String(k + 1).padStart(2, '0')}</button>)}
        </div>
        <div className="ss__body" key={i}>
          {cur.stat && <div className="ss__stat"><b>{cur.stat}</b><span>{cur.statLabel}</span></div>}
          <h3>{cur.title}</h3>
          <p>{cur.desc}</p>
        </div>
        <Link className="link ss__more" to="/company/intro">회사소개 보기 <ArrowRight /></Link>
      </div>
    </div>
  )
}

function BizCarousel({ items = [] }) {
  const ref = useRef(null)
  const go = (d) => { const el = ref.current; if (!el) return; const card = el.querySelector('.bc__card'); const w = card ? card.offsetWidth + 24 : 360; el.scrollBy({ left: d * w, behavior: 'smooth' }) }
  return (
    <div className="bc">
      <button type="button" className="bc__nav bc__nav--prev" aria-label="이전" onClick={() => go(-1)}><ArrowRight style={{ transform: 'rotate(180deg)' }} /></button>
      <div className="bc__track" ref={ref}>
        {items.map((b, i) => (
          <Link to={`/business/${b.id}`} className="bc__card" key={b.id} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
            <div className="bc__img"><img src={asset(b.image)} alt={b.name} loading="lazy" /></div>
            <div className="bc__body">
              
              <h3>{b.name}</h3>
              <p>{b.short}</p>
              <span className="bc__more">자세히 보기 <ArrowRight /></span>
            </div>
          </Link>
        ))}
      </div>
      <button type="button" className="bc__nav bc__nav--next" aria-label="다음" onClick={() => go(1)}><ArrowRight /></button>
    </div>
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
      <section className="section" id="certs">
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

      {/* 3. 사업영역 — 대형 영문 타이틀 + 카드 캐러셀 */}
      <section className="section biz-sec">
        <div className="wrap">
          <div className="big-title" data-reveal="">
            <h2>BUSINESS</h2>
            <h3>5대 핵심 물류 서비스</h3>
            <p>화주의 공급망 전 구간을 삼원이 하나의 창구로 책임집니다.</p>
          </div>
        </div>
        <BizCarousel items={c.businessAreas} />
      </section>

      {/* 4. 비전 밴드 */}
      <section className="vband">
        <img src={asset((c.visionPage && c.visionPage.bandImage) || 'img/vision.jpg')} alt="" loading="lazy" />
        <div className="wrap">
          <div className="vband__in" data-reveal="">
            <span className="vband__en">Vision</span>
            <h2>고객의 공급망을<br />끝까지 책임지는 통합물류</h2>
            <p>현장에서 쌓아 온 운영 역량과 6개 계열 법인의 통합 인프라로 <br className="br-pc" />대한민국 대표 통합물류 그룹을 지향합니다.</p>
            <Link className="pill-btn" to="/company/vision">VIEW MORE</Link>
          </div>
        </div>
      </section>

      {/* 5. Core Strength — 번호 탭 슬라이더 */}
      <section className="section strength-sec">
        <div className="wrap">
          <StrengthSlider why={c.why} />
        </div>
      </section>

      {/* 5. 네트워크 — 다크 밴드 + 노선 애니메이션 지도 */}
      <section className="nx">
        <div className="wrap nx__in">
          <div className="nx__copy" data-reveal="">
            <span className="nx__en">Nationwide Network</span>
            <h2 className="pre">{c.network.title}</h2>
            <p className="nx__lead">{c.network.lead}</p>
            <ol className="nx__pts">
              {c.network.points.map((p, i) => { const o = typeof p === 'string' ? { title: p } : p; return (
                <li key={i}><span>{String(i + 1).padStart(2, '0')}</span><div><b>{o.title}</b>{o.desc && <p>{o.desc}</p>}</div></li>) })}
            </ol>
            <dl className="nx__regions">
              {groupHubs(c.network.hubs).map(([g, list]) => (
                <div key={g}><dt>{g}</dt><dd>{list.map(h => h.name).join(' · ')}</dd></div>
              ))}
            </dl>
          </div>
          <div className="nx__map" data-reveal="" style={{ transitionDelay: '.15s' }}>
            <KoreaMap hubs={c.network.hubs} dark />
            <div className="nx__legend"><span><i className="is-main" />주요 거점</span><span><i />권역 운행 거점</span><span><i className="is-route" />간선 노선</span></div>
          </div>
        </div>
      </section>

      {/* 6. 파트너 (컬러) */}
      <section className="section section--soft">
        <div className="wrap"><SectionHead center eyebrow={c.partnersSection.eyebrow} title={c.partnersSection.title} lead={c.partnersSection.lead} /></div>
        <div className="marquee"><div className="marquee__track">{loop.map((p, i) => <div className="logo-tile" key={i}><img src={asset(p.logo)} alt={p.name} /></div>)}</div></div>
        <div className="marquee marquee--rev"><div className="marquee__track">{[...loop].reverse().map((p, i) => <div className="logo-tile" key={i}><img src={asset(p.logo)} alt={p.name} /></div>)}</div></div>
        <div className="wrap"><p className="small muted" style={{ marginTop: 24, textAlign: 'center' }}>{c.partnersSection.note}</p></div>
      </section>

    </>
  )
}
