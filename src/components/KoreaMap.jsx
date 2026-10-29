import { VIEW, PROVINCES, CITY } from '../data/koreaMap'

// 실제 대한민국 시·도 경계 기반 네트워크 지도 (미니멀 버전)
// hubs: [{ name, region, city, main, label }]
// - 주요 거점(main): 블루 핀 + 라벨 배지
// - 권역 거점: 작은 점 + 도시명 (수도권의 보조 거점은 점만 표시해 혼잡도 최소화)
const CAPITAL = ['서울', '인천', '연천', '이천', '여주']
const SIDE = { '서울': 'left', '인천': 'left', '광주': 'left', '제주': 'right', '부산': 'left', '대구': 'right', '원주': 'right', '강릉': 'left', '대전': 'right', '전주': 'left', '울산': 'left', '청주': 'right', '천안': 'left' }

export default function KoreaMap({ hubs = [], dark = false }) {
  const pts = hubs.map(h => ({ ...h, p: CITY[h.city] || null })).filter(h => h.p)
  const hub = CITY['이천']
  // 이천 중앙 허브 → 각 권역 거점 간선 노선 (완만한 곡선)
  const routes = dark ? pts.filter(h => h.city !== '이천' && h.city !== '서울').map(h => {
    const [x, y] = h.p; const [hx, hy] = hub
    const mx = (x + hx) / 2, my = (y + hy) / 2, dx = x - hx, dy = y - hy
    const k = .18
    return `M${hx},${hy} Q${mx - dy * k},${my + dx * k} ${x},${y}`
  }) : []
  const C = dark ? { land0: '#17305c', land1: '#122650', stroke: '#2a4a80', dot: '#7aa7e6', text: '#dce8fb', main: '#4d8fe0', badge: '#ffffff', badgeText: '#0b1830' } : { land0: '#eef4fc', land1: '#dfeaf8', stroke: '#fff', dot: '#1a66c4', text: '#1f2a3d', main: '#054592', badge: '#054592', badgeText: '#fff' }
  return (
    <svg viewBox={`-4 -4 ${VIEW.w + 8} ${VIEW.h + 8}`} role="img" aria-label="전국 운송 네트워크 지도">
      <defs>
        <linearGradient id="kmLand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.land0} /><stop offset="1" stopColor={C.land1} /></linearGradient>
        <radialGradient id="kmGlow"><stop offset="0" stopColor="#1a66c4" stopOpacity=".22" /><stop offset="1" stopColor="#1a66c4" stopOpacity="0" /></radialGradient>
      </defs>
      <g>{PROVINCES.map(p => <path key={p.name} d={p.d} fill="url(#kmLand)" stroke={C.stroke} strokeWidth=".6" strokeLinejoin="round" />)}</g>
      {routes.map((d, i) => <path key={"r" + i} className="km-route" d={d} fill="none" stroke="#7aa7e6" strokeWidth=".55" strokeLinecap="round" style={{ animationDelay: `${i * .35}s` }} />)}

      {/* 수도권 권역 강조 */}
      <circle cx="41" cy="21" r="11" fill="url(#kmGlow)" />

      {pts.filter(h => !h.main).map((h, i) => {
        const [x, y] = h.p
        const showLabel = !CAPITAL.includes(h.city)
        const left = SIDE[h.city] === 'left'
        return (
          <g key={'s' + i} className="km-dot">
            <circle cx={x} cy={y} r="1.5" fill={dark ? "#0b1830" : "#fff"} stroke={C.dot} strokeWidth=".8" />
            {showLabel && <text x={left ? x - 2.6 : x + 2.6} y={y + 1.2} textAnchor={left ? 'end' : 'start'} fontSize="3.9" fontWeight="700" fill={C.text}>{h.label || h.city}</text>}
          </g>
        )
      })}

      {pts.filter(h => h.main).map((h, i) => {
        const [x, y] = h.p
        const text = h.label || h.name
        const w = text.length * 3.9 + 5.5
        const left = SIDE[h.city] === 'left'
        const bx = left ? x - 3 - w : x + 3
        const by = left ? y - 8.5 : y + 1.2
        return (
          <g key={'m' + i} className="km-main">
            <circle className="pulse" cx={x} cy={y} r="3.6" fill="none" stroke={C.main} strokeWidth=".7" />
            <circle cx={x} cy={y} r="2.2" fill={C.main} stroke="#fff" strokeWidth=".8" />
            <rect x={bx} y={by} width={w} height="7" rx="3.5" fill={C.badge} />
            <text x={bx + w / 2} y={by + 4.9} textAnchor="middle" fontSize="3.8" fontWeight="800" fill={C.badgeText}>{text}</text>
          </g>
        )
      })}
    </svg>
  )
}
