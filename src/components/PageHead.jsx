import { Link, NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { asset } from '../utils/storage'

export default function PageHead({ label, title, desc, crumb = [], subnav, docTitle, image }) {
  useEffect(() => { document.title = `${docTitle || title} | 삼원종합물류㈜`; return () => { document.title = '삼원종합물류㈜ | 공급망의 시작부터 끝까지' } }, [title, docTitle])
  return (
    <>
      <section className="page-head">
        {image && <img src={asset(image)} alt="" />}
        <div className="container">
          <div className="page-head__crumb"><Link to="/">HOME</Link>{crumb.map((c, i) => <span key={i}>› {c}</span>)}</div>
          {label && <div className="page-head__label">{label}</div>}
          <h1>{title}</h1>
          {desc && <p>{desc}</p>}
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
