import { VIEW, PROVINCES, CITY } from '../data/koreaMap'

// 실제 대한민국 시·도 경계 기반 네트워크 지도. hubs: [{ name, region, city, main }]
export default function KoreaMap({ hubs = [] }) {
  const pts = hubs.map(h => ({ ...h, p: CITY[h.city] || null })).filter(h => h.p)
  const center = pts.find(h => h.main && /이천/.test(h.name)) || pts.find(h => h.main) || pts[0]
  return (
    <svg viewBox={`-6 -4 ${VIEW.w + 12} ${VIEW.h + 8}`} role="img" aria-label="전국 운송 네트워크 지도">
      <defs>
        <linearGradient id="landg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8f0fb" /><stop offset="1" stopColor="#d2e1f7" /></linearGradient>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.6" floodColor="#054592" floodOpacity=".18" /></filter>
      </defs>
      <g filter="url(#soft)">
        {PROVINCES.map(p => <path key={p.name} d={p.d} fill="url(#landg)" stroke="#fff" strokeWidth=".45" strokeLinejoin="round" />)}
      </g>
      {center && pts.filter(h => h !== center).map((h, i) => (
        <line key={i} x1={center.p[0]} y1={center.p[1]} x2={h.p[0]} y2={h.p[1]} stroke="#054592" strokeWidth=".5" strokeDasharray="1.6 1.3" opacity=".45" />
      ))}
      {pts.map((h, i) => {
        const [x, y] = h.p
        const L = { '서울': ['end', -3.8, -2.2], '인천': ['end', -3.6, 2.2], '이천': ['start', 3.6, 4.2], '연천': ['start', 3.6, 1.3], '원주': ['start', 3.6, 1.3], '강릉': ['end', -3.6, 1.3] }[h.city]
        const [anchor, dx, dy] = L || (x > 55 ? ['end', -3.6, 1.3] : ['start', 3.6, 1.3])
        return (
          <g key={i} className="map__hub">
            {h.main && <circle className="pulse" cx={x} cy={y} r="4" fill="none" stroke="#054592" strokeWidth=".9" />}
            <circle cx={x} cy={y} r={h.main ? 2.6 : 1.8} fill={h.main ? '#054592' : '#fff'} stroke="#054592" strokeWidth="1" />
            <text x={x + dx} y={y + dy} textAnchor={anchor} fontSize={h.main ? 3.8 : 3.3} fontWeight={h.main ? 800 : 600}>{h.name}</text>
          </g>
        )
      })}
    </svg>
  )
}
