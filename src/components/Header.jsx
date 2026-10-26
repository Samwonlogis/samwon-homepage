import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV } from './nav'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import { Menu, X, Phone } from './Icons'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { content } = useContent()
  const loc = useLocation()
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => { setOpen(false) }, [loc.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  const isGroupActive = (g) => g.children.some(c => loc.pathname === c.to || (c.to !== '/business' && loc.pathname.startsWith(c.to))) || (g.to === '/business' && loc.pathname.startsWith('/business'))

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header__in">
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
            <a className="btn btn--ghost btn--sm header__cta" href={`tel:${content.company.phone}`}><Phone /> {content.company.phone}</a>
            <Link className="btn btn--primary btn--sm header__cta" to="/contact">물류 상담</Link>
            <button className="burger" aria-label="메뉴 열기" onClick={() => setOpen(true)}><Menu /></button>
          </div>
        </div>
      </header>
      <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__bg" onClick={() => setOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-label="모바일 메뉴">
          <div className="drawer__head">
            <img src={asset('samwon_logo.svg')} alt="SAMWON" style={{ height: 30 }} />
            <button className="burger" aria-label="닫기" onClick={() => setOpen(false)}><X /></button>
          </div>
          {NAV.map(g => (
            <div className="drawer__group" key={g.label}>
              <h4>{g.label}</h4>
              {g.children.map(c => <NavLink key={c.to} to={c.to} end={c.to === '/business'}>{c.label}</NavLink>)}
            </div>
          ))}
          <div className="drawer__foot">
            <Link className="btn btn--primary" to="/contact">물류 상담 신청</Link>
            <a className="btn btn--ghost" href={`tel:${content.company.phone}`}><Phone /> {content.company.phone}</a>
          </div>
        </div>
      </div>
    </>
  )
}
