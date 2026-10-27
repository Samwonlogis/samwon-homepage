import { useEffect } from 'react'

// 스크롤 리빌: 경로 변경 시 + 이후 동적으로 추가되는 [data-reveal] 요소까지 자동 관찰
export function useReveal(deps = []) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in')); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    const observeAll = () => document.querySelectorAll('[data-reveal]:not(.is-in):not([data-observed])').forEach(e => { e.setAttribute('data-observed', '1'); io.observe(e) })
    observeAll()
    const mo = new MutationObserver(() => observeAll())
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, deps)
}
