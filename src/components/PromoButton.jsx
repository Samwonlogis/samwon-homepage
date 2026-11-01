import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { asset } from '../utils/storage'

// 좌하단 고정 '회사홍보영상' 버튼(로고 블루) → 클릭 시 전체 화면 영상 레이어
export default function PromoButton() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])
  if (loc.pathname.startsWith('/admin')) return null
  return (
    <>
      <button type="button" className="promo-fab" onClick={() => setOpen(true)} aria-label="회사홍보영상 재생">
        <span className="promo-fab__ic"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z" /></svg></span>
        <span className="promo-fab__txt">회사홍보영상</span>
      </button>
      {open && (
        <div className="promo-modal" role="dialog" aria-modal="true" aria-label="삼원종합물류 회사홍보영상" onClick={() => setOpen(false)}>
          <div className="promo-modal__in" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="promo-modal__close" onClick={() => setOpen(false)} aria-label="닫기">×</button>
            <video controls autoPlay playsInline poster={asset('video/promo_poster.jpg')}>
              <source src={asset('video/promo.mp4')} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}
