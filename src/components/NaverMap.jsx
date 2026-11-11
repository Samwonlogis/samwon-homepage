import { useEffect, useRef, useState } from 'react'

// 네이버 지도 (NAVER Cloud Platform Maps · Dynamic Map + Geocoding)
// - 관리자 화면의 '네이버 지도 Client ID'(company.naverMapClientId)가 있을 때만 지도를 불러옴
// - 키가 없거나 인증에 실패하면 주소와 '네이버 지도에서 보기' 버튼으로 대체
let loader = null
function loadNaver(id) {
  if (window.naver?.maps?.Service) return Promise.resolve(window.naver)
  if (loader) return loader
  loader = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(id)}&submodules=geocoder`
    s.async = true
    s.onload = () => {
      // geocoder 서브모듈은 본 스크립트 로드 직후 비동기로 준비됨
      let n = 0
      const t = setInterval(() => {
        if (window.naver?.maps?.Service) { clearInterval(t); resolve(window.naver) }
        else if (++n > 50) { clearInterval(t); reject(new Error('geocoder')) }
      }, 100)
    }
    s.onerror = () => { loader = null; reject(new Error('load')) }
    document.head.appendChild(s)
  })
  return loader
}

export default function NaverMap({ clientId, address, query, title, zoom = 16, lat, lng, className = '' }) {
  const el = useRef(null)
  const [state, setState] = useState(clientId ? 'loading' : 'off')
  const naverLink = `https://map.naver.com/p/search/${encodeURIComponent(query || address || '')}`

  useEffect(() => {
    if (!clientId) { setState('off'); return }
    let alive = true
    window.navermap_authFailure = () => { if (alive) setState('off') }
    setState('loading')
    loadNaver(clientId).then((naver) => {
      if (!alive || !el.current) return
      const draw = (pos) => {
        if (!alive || !el.current) return
        el.current.innerHTML = ''
        const map = new naver.maps.Map(el.current, { center: pos, zoom, scaleControl: false, mapDataControl: false, zoomControl: true, zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT } })
        new naver.maps.Marker({ position: pos, map, title })
        setState('on')
      }
      if (lat && lng) return draw(new naver.maps.LatLng(lat, lng))
      naver.maps.Service.geocode({ query: address }, (status, res) => {
        const a = status === naver.maps.Service.Status.OK && res?.v2?.addresses?.[0]
        if (a) draw(new naver.maps.LatLng(+a.y, +a.x))
        else if (alive) setState('off')
      })
    }).catch(() => { if (alive) setState('off') })
    return () => { alive = false }
  }, [clientId, address, lat, lng, zoom, title])

  return (
    <div className={`nmap ${className}`} data-state={state}>
      <div ref={el} className="nmap__canvas" role="img" aria-label={`${title || ''} 지도`} />
      {state !== 'on' && (
        <div className="nmap__fallback">
          <b>{title}</b>
          <span>{address}</span>
          <a href={naverLink} target="_blank" rel="noopener noreferrer">네이버 지도에서 보기</a>
        </div>
      )}
    </div>
  )
}
