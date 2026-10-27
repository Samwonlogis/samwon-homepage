import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV } from './nav'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import { Menu, X, Phone, Truck, Spark } from './Icons'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { content } = useContent()
  const co = content.company
  const loc = useLocation()
  const transparent = loc.pathname === '/'
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => { setOpen(false) }, [loc.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  const isGroupActive = (g) => loc.pathname.startsWith(g.to.split('/').slice(0, 2).join('/'))
  const ext = (url) => /^https?:/.test(url)

  const Portal = ({ url, label, icon, cls }) => ext(url)
    ? <a className={`btn btn--sm ${cls}`} href={url} target="_blank" rel="noreferrer">{icon} {label}</a>
    : <Link className={`btn btn--sm ${cls}`} to={url.startsWith('#') ? '/' + url : url}>{icon} {label}</Link>

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''} ${transparent ? '' : 'is-solid'}`}>
        <div className="wrap header__in">
          <Link to="/" className="header__logo" aria-label="삼원종합물류 홈"><img src={asset('samwon_logo.svg')} alt="SAMWON 삼원종합물류" /></Link>
          <nav className="nav" aria-label="주 메뉴">
            {NAV.map(g => (
              <div className="nav__item" key={g.label}>
                <Link to={g.to} className={`nav__link ${isGroupActive(g) ? 'active' : ''}`}>{g.label}</Link>
                <div className="nav__menu">
                  {g.children.map(c => <NavLink key={c.to} to={c.to} end={c.to === '/business'}>{c.label}</NavLink>)}
                </div>
              </div>
            ))}
          </nav>
          <div className="header__right">
            <div className="header__portals">
              <Portal url={co.driverUrl} label={co.driverLabel} icon={<Truck />} cls="btn--portal" />
              <Portal url={co.s1quickUrl} label={co.s1quickLabel} icon={<Spark />} cls="btn--portal btn--portal-quick" />
            </div>
            <button className="burger" aria-label="메뉴 열기" onClick={() => setOpen(true)}><Menu /></button>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__bg" onClick={() => setOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-label="모바일 메뉴">
          <div className="drawer__head">
            <img src={asset('samwon_logo.svg')} alt="SAMWON" style={{ height: 34 }} />
            <button className="burger" aria-label="닫기" onClick={() => setOpen(false)}><X /></button>
          </div>
          <div className="drawer__portals">
            <Portal url={co.driverUrl} label={co.driverLabel} icon={<Truck />} cls="btn--ghost" />
            <Portal url={co.s1quickUrl} label={co.s1quickLabel} icon={<Spark />} cls="btn--primary" />
          </div>
          {NAV.map(g => (
            <div className="drawer__group" key={g.label}>
              <h4>{g.label}</h4>
              {g.children.map(c => <NavLink key={c.to} to={c.to} end={c.to === '/business'}>{c.label}</NavLink>)}
            </div>
          ))}
          <div className="drawer__foot">
            <Link className="btn btn--dark" to="/contact">물류 상담 신청</Link>
            <a className="btn btn--ghost" href={`tel:${co.phone}`}><Phone /> {co.phone}</a>
          </div>
        </div>
      </div>
    </>
  )
}
