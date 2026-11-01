import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { asset } from '../utils/storage'
import { titleCase } from './Section'

// logo: 회사소개 계열 SAMWON 로고 배너 — logo="zoom"(회사소개: 클로즈업→줌아웃) / 그 외 true(최종 배치 상태로 고정, 광택만)
// slides: [{ src, tag, cap }] — 여러 현장 사진이 교차 전환되는 배너(사업영역 전체소개)
// 일반 이미지: 원본 비율 그대로 우측 배치(인물·차량이 잘리지 않음)
export default function PageHead({ label, title, desc, crumb = [], subnav, docTitle, image, logo, slides }) {
  useEffect(() => { document.title = `${docTitle || title} | 삼원종합물류㈜`; return () => { document.title = '삼원종합물류㈜ | 공급망의 시작부터 끝까지' } }, [title, docTitle])
  const [cur, setCur] = useState(0)
  const n = slides?.length || 0
  useEffect(() => { if (n < 2) return; const t = setInterval(() => setCur(c => (c + 1) % n), 4200); return () => clearInterval(t) }, [n])
  const photo = (image || n) && !logo
  return (
    <>
      <section className={`page-head${logo ? ' page-head--logo' : ''}${logo === 'zoom' ? ' page-head--zoom' : ''}${photo ? ' page-head--photo' : ''}${n ? ' page-head--slides' : ''}`}>
        {logo && (
          <div className="ph-logo" aria-hidden="true">
            <div className="ph-logo__mark" style={{ '--logo': `url(${asset('samwon_logo.svg')})` }} />
          </div>
        )}
        {image && !logo && !n && <img className="page-head__img" src={asset(image)} alt="" />}
        {n > 0 && slides.map((s, i) => (
          <img key={s.src} className={`page-head__img ph-slide${i === cur ? ' is-on' : ''}`} src={asset(s.src)} alt={s.cap || ''} loading={i < 2 ? 'eager' : 'lazy'} />
        ))}
        <div className="wrap page-head__in">
          {label && <div className="page-head__label">{titleCase(label)}</div>}
          <h1>{title}</h1>
          {desc && <p>{String(desc).replace(/\n/g, ' ')}</p>}
          <div className="page-head__crumb"><Link to="/">HOME</Link>{crumb.map((c, i) => <span key={i}>{c}</span>)}</div>
        </div>
        {n > 0 && (
          <div className="ph-cap" aria-live="polite">
            <span className="ph-cap__no">{String(cur + 1).padStart(2, '0')}<i>/ {String(n).padStart(2, '0')}</i></span>
            <span className="ph-cap__txt"><b>{slides[cur].tag}</b>{slides[cur].cap}</span>
            <span className="ph-cap__bar"><i key={cur} /></span>
          </div>
        )}
      </section>
      {subnav && (
        <div className="subnav"><div className="container"><ul>
          {subnav.map(s => <li key={s.to}><NavLink to={s.to} end={s.end}>{s.label}</NavLink></li>)}
        </ul></div></div>
      )}
    </>
  )
}
