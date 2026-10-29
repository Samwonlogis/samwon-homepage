import { Link, NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { asset } from '../utils/storage'
import { titleCase } from './Section'

// 서브 페이지 상단 — 좌측 정렬 에디토리얼 배너 (이미지 슬로우 줌)
export default function PageHead({ label, title, desc, crumb = [], subnav, docTitle, image }) {
  useEffect(() => { document.title = `${docTitle || title} | 삼원종합물류㈜`; return () => { document.title = '삼원종합물류㈜ | 공급망의 시작부터 끝까지' } }, [title, docTitle])
  return (
    <>
      <section className="page-head">
        {image && <img src={asset(image)} alt="" />}
        <div className="wrap page-head__in">
          {label && <div className="page-head__label">{titleCase(label)}</div>}
          <h1>{title}</h1>
          {desc && <p>{String(desc).replace(/\n/g, ' ')}</p>}
          <div className="page-head__crumb"><Link to="/">HOME</Link>{crumb.map((c, i) => <span key={i}>{c}</span>)}</div>
        </div>
      </section>
      {subnav && (
        <div className="subnav"><div className="container"><ul>
          {subnav.map(s => <li key={s.to}><NavLink to={s.to} end={s.end}>{s.label}</NavLink></li>)}
        </ul></div></div>
      )}
    </>
  )
}
