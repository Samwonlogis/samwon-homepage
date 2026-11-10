import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import KoreaMap from '../components/KoreaMap'
import { SectionHead } from '../components/Section'
import { partners } from '../data/partners'
import { ArrowRight } from '../components/Icons'

const groupHubs = (hubs = []) => {
  const m = new Map()
  hubs.forEach(h => { const g = h.group || h.region || '기타'; if (!m.has(g)) m.set(g, []); m.get(g).push(h) })
  return [...m.entries()]
}

function Hero({ hero, facts = [] }) {
  const imgs = (hero.images || []).filter(Boolean)
  const [i, setI] = useState(0)
  const [videoOk, setVideoOk] = useState(!!hero.video)
  const vref = useRef(null)
  useEffect(() => { if (videoOk || imgs.length < 2) return; const t = setInterval(() => setI(v => (v + 1) % imgs.length), 8000); return () => clearInterval(t) }, [imgs.length, videoOk])
  useEffect(() => {
    const v = vref.current; if (!v) return
    if (navigator.connection && navigator.connection.saveData) { setVideoOk(false); return }
    // 재생 거부(NotAllowedError)일 때만 이미지로 대체 — 로딩 중 play() 중단 같은 일시 오류로 영상이 사라지지 않도록 함
    const tryPlay = () => v.play().catch(e => { if (e && e.name === 'NotAllowedError') setVideoOk(false) })
    tryPlay(); const t = setTimeout(tryPlay, 1500); return () => clearTimeout(t)
  }, [hero.video])
  return (
    <section className="hero hero--v7">
      <div className="hero__media">
        {videoOk && hero.video
          ? <video ref={vref} autoPlay muted loop playsInline poster={asset(hero.poster || imgs[0])} onError={() => setVideoOk(false)}>
              <source src={asset(hero.video)} type="video/mp4" />
            </video>
          : imgs.map((src, k) => <img key={k} src={asset(src)} alt="" className={k === i ? 'is-active' : ''} loading={k === 0 ? 'eager' : 'lazy'} />)}
      </div>
      <div className="wrap hero__body">
        {hero.eyebrow && <span className="hero__kicker" data-reveal="">{hero.eyebrow}</span>}
        <h1 className="hero__title pre" data-reveal="" style={{ transitionDelay: '.06s' }}>{hero.title}</h1>
        {hero.subtitle && <p className="hero__sub" data-reveal="" style={{ transitionDelay: '.12s' }}>{hero.subtitle}</p>}
        <div className="hero__cta" data-reveal="" style={{ transitionDelay: '.18s' }}>
          <Link className="btn btn--white" to="/contact/partnership">{hero.primaryCta || '물류 상담 신청'} <ArrowRight /></Link>
          <Link className="btn btn--ghost-white" to="/business">{hero.secondaryCta || '사업영역 보기'}</Link>
        </div>
      </div>
      {facts.length > 0 && (
        <div className="hero__facts">
          <div className="wrap">
            <dl>{facts.map((f, k) => <div key={k}><dd>{f.value}<small>{f.unit}</small></dd><dt>{f.label}</dt></div>)}</dl>
          </div>
        </div>
      )}
    </section>
  )
}

// 사업영역 — 좌측 사진(선택 항목에 따라 전환) + 우측 5개 사업 목록. 다섯 개를 한눈에 보이게 하기 위해 캐러셀 대신 목록형
function Services({ items = [] }) {
  const [on, setOn] = useState(0)
  return (
    <div className="svc" data-reveal="">
      <div className="svc__photo" aria-hidden="true">
        {items.map((b, k) => <img key={b.id} src={asset(b.image)} alt="" className={k === on ? 'is-on' : ''} loading={k === 0 ? 'eager' : 'lazy'} />)}
        <span className="svc__cap">{String(on + 1).padStart(2, '0')} — {items[on]?.en}</span>
      </div>
      <ol className="svc__list">
        {items.map((b, k) => (
          <li key={b.id} className={k === on ? 'is-on' : ''} onMouseEnter={() => setOn(k)} onFocus={() => setOn(k)}>
            <Link to={`/business/${b.id}`}>
              <span className="svc__no">{String(k + 1).padStart(2, '0')}</span>
              <img className="svc__thumb" src={asset(b.image)} alt="" loading="lazy" />
              <span className="svc__txt"><h3>{b.name}</h3><p>{b.short}</p></span>
              <ArrowRight />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

const fmtDate = (d = '') => String(d).replace(/-/g, '.')

export default function Home() {
  const { content: c } = useContent()
  const co = c.company
  const loop = [...partners, ...partners]
  const news = [...(c.notices || [])].filter(n => n && n.title).sort((x, y) => String(y.date).localeCompare(String(x.date))).slice(0, 4)

  return (
    <>
      <Hero hero={c.hero} facts={c.home?.facts} />

      {/* 1. 사업영역 */}
      <section className="section" id="business">
        <div className="wrap">
          <SectionHead eyebrow="Business" title={c.home?.businessTitle || '화주의 공급망 전 구간을\n다섯 개 사업으로 맡습니다'} lead={c.home?.businessLead} />
          <Services items={c.businessAreas} />
        </div>
      </section>

      {/* 2. 비전 밴드 */}
      <section className="vband">
        <img src={asset(c.home?.visionBandImage || 'img/hero_3.jpg')} alt="" loading="lazy" />
        <div className="wrap">
          <div className="vband__in" data-reveal="">
            <span className="vband__en">Vision</span>
            <h2>고객의 공급망을<br />끝까지 책임지는 통합물류</h2>
            <p>현장에서 쌓아 온 운영 역량과 6개 계열 법인의 통합 인프라로 <br className="br-pc" />대한민국 대표 통합물류 그룹을 지향합니다.</p>
            <Link className="btn btn--ghost-white" to="/company/vision">기업비전 보기 <ArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* 3. 삼원을 선택하는 이유 + 인증 */}
      <section className="section" id="why">
        <div className="wrap">
          <SectionHead eyebrow="Why Samwon" title={c.why.title} lead={c.why.lead} />
          <ol className="why4" data-reveal="">
            {(c.why.items || []).map((w, k) => (
              <li key={k}>
                <span className="why4__no">{String(k + 1).padStart(2, '0')}</span>
                {w.stat && <strong className="why4__stat">{w.stat}<small>{w.statLabel}</small></strong>}
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </li>
            ))}
          </ol>
          <div className="certrow" id="certs" data-reveal="">
            <span className="certrow__label">인증 현황</span>
            <ul>
              {c.certifications.items.map((ct, i) => (
                <li key={i}>
                  {ct.logo && <img src={asset(ct.logo)} alt="" loading="lazy" />}
                  <span><b>{ct.name}</b>{ct.org}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. 네트워크 — 다크 밴드 + 노선 지도 */}
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
                <div key={g}><dt>{g}</dt><dd>{list.map(h => h.name).join(' · ')}</dd></div>
              ))}
            </dl>
          </div>
          <div className="nx__map" data-reveal="" style={{ transitionDelay: '.15s' }}>
            <KoreaMap hubs={c.network.hubs} dark />
            <div className="nx__legend"><span><i className="is-main" />주요 거점</span><span><i />권역 운행 거점</span><span><i className="is-route" />간선 노선</span></div>
          </div>
        </div>
      </section>

      {/* 5. 거래처 */}
      <section className="section section--soft clients">
        <div className="wrap"><SectionHead eyebrow={c.partnersSection.eyebrow} title={c.partnersSection.title} lead={c.partnersSection.lead} /></div>
        <div className="marquee"><div className="marquee__track">{loop.map((p, i) => <div className="logo-tile" key={i}><img src={asset(p.logo)} alt={p.name} /></div>)}</div></div>
        <div className="marquee marquee--rev"><div className="marquee__track">{[...loop].reverse().map((p, i) => <div className="logo-tile" key={i}><img src={asset(p.logo)} alt={p.name} /></div>)}</div></div>
        <div className="wrap"><p className="clients__note">{c.partnersSection.note}</p></div>
      </section>

      {/* 6. 새 소식 + 상담 안내 */}
      <section className="section" id="news">
        <div className="wrap hn">
          <div className="hn__news" data-reveal="">
            <header className="hn__head">
              <div><span className="sh-en">News</span><h2 className="h-section">새 소식</h2></div>
              <Link className="link" to="/support/notice">전체 보기 <ArrowRight /></Link>
            </header>
            <ul className="hn__list">
              {news.map(n => (
                <li key={n.id}>
                  <Link to={`/support/notice/${n.id}`}>
                    <span className="hn__cat">{n.category}</span>
                    <b>{n.title}</b>
                    <time dateTime={n.date}>{fmtDate(n.date)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <aside className="hn__cta" data-reveal="" style={{ transitionDelay: '.1s' }}>
            <span className="sh-en">Contact</span>
            <h2>물류 상담</h2>
            <p>{c.home?.contactLead || '물동량과 배송 권역을 알려 주시면 담당자가 차량 편성과 견적을 안내해 드립니다.'}</p>
            <a className="hn__tel" href={`tel:${co.phone}`}>{co.phone}</a>
            <dl>
              <div><dt>에스원퀵 접수</dt><dd><a href={`tel:${co.quickPhone}`}>{co.quickPhone}</a></dd></div>
              <div><dt>이메일</dt><dd><a href={`mailto:${co.email}`}>{co.email}</a></dd></div>
              <div><dt>상담 시간</dt><dd>평일 09:00 – 18:00</dd></div>
            </dl>
            <Link className="btn btn--white" to="/contact/partnership">상담 신청하기 <ArrowRight /></Link>
          </aside>
        </div>
      </section>
    </>
  )
}
