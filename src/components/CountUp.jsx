import { useEffect, useRef, useState } from 'react'
export default function CountUp({ value, duration = 1600 }) {
  const [n, setN] = useState(0); const ref = useRef(null); const done = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const run = () => {
      if (done.current) return; done.current = true
      const start = performance.now()
      const tick = (t) => { const p = Math.min(1, (t - start) / duration); const e = 1 - Math.pow(1 - p, 3); setN(Math.round(value * e)); if (p < 1) requestAnimationFrame(tick) }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el); return () => io.disconnect()
  }, [value, duration])
  return <span ref={ref}>{n.toLocaleString()}</span>
}
