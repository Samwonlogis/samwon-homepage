import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useReveal } from '../hooks/useReveal'

export default function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    const t = setTimeout(() => { const el = document.getElementById(decodeURIComponent(hash.slice(1))); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }) }, 120)
    return () => clearTimeout(t)
  }, [pathname, hash])
  useReveal([pathname])
  return (<><Header /><main><Outlet /></main><Footer /></>)
}
