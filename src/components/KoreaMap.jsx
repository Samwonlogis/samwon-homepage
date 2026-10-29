import { VIEW, PROVINCES, CITY } from '../data/koreaMap'

// 실제 대한민국 시·도 경계 기반 네트워크 지도 (미니멀 버전)
// hubs: [{ name, region, city, main, label }]
// - 주요 거점(main): 블루 핀 + 라벨 배지
// - 권역 거점: 작은 점 + 도시명 (수도권의 보조 거점은 점만 표시해 혼잡도 최소화)
const CAPITAL = ['서울', '인천', '연천', '이천', '여주']
const SIDE = { '서울': 'left', '인천': 'left', '광주': 'left', '제주': 'right', '부산': 'left', '대구': 'right', '원주': 'right', '강릉': 'left', '대전': 'right', '전주': 'left', '울산': 'left', '청주': 'right', '천안': 'left' }

export default function KoreaMap({ hubs = [] }) {
  const pts = hubs.map(h => ({ ...h, p: CITY[h.city] || null })).filter(h => h.p)
  return (
    <svg viewBox={`-4 -4 ${VIEW.w + 8} ${VIEW.h + 8}`} role="img" aria-label="전국 운송 네트워크 지도">
      <defs>
        <linearGradient id="kmLand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef4fc" /><stop offset="1" stopColor="#dfeaf8" /></linearGradient>
        <radialGradient id="kmGlow"><stop offset="0" stopColor="#1a66c4" stopOpacity=".22" /><stop offset="1" stopColor="#1a66c4" stopOpacity="0" /></radialGradient>
      </defs>
      <g>{PROVINCES.map(p => <path key={p.name} d={p.d} fill="url(#kmLand)" stroke="#fff" strokeWidth=".6" strokeLinejoin="round" />)}</g>

      {/* 수도권 권역 강조 */}
      <circle cx="41" cy="21" r="11" fill="url(#kmGlow)" />

      {pts.filter(h => !h.main).map((h, i) => {
        const [x, y] = h.p
        const showLabel = !CAPITAL.includes(h.city)
        const left = SIDE[h.city] === 'left'
        return (
          <g key={'s' + i} className="km-dot">
            <circle cx={x} cy={y} r="1.5" fill="#fff" stroke="#1a66c4" strokeWidth=".8" />
            {showLabel && <text x={left ? x - 2.6 : x + 2.6} y={y + 1.2} textAnchor={left ? 'end' : 'start'} fontSize="3.9" fontWeight="700" fill="#1f2a3d">{h.label || h.city}</text>}
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
            <circle className="pulse" cx={x} cy={y} r="3.6" fill="none" stroke="#054592" strokeWidth=".7" />
            <circle cx={x} cy={y} r="2.2" fill="#054592" stroke="#fff" strokeWidth=".8" />
            <rect x={bx} y={by} width={w} height="7" rx="3.5" fill="#054592" />
            <text x={bx + w / 2} y={by + 4.9} textAnchor="middle" fontSize="3.8" fontWeight="800" fill="#fff">{text}</text>
          </g>
        )
      })}
    </svg>
  )
}
