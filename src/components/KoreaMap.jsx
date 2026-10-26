// 대한민국 개념 지도 (자체 제작 단순화 벡터) — 거점은 개념도이며 실제 좌표가 아님
export default function KoreaMap({ hubs = [] }) {
  const outline = 'M30 12 C34 9 40 8 44 8 C50 7 56 8 60 11 C64 13 66 19 67 25 C69 32 70 40 71 46 C73 50 74 54 72 58 C70 62 68 66 66 70 C63 74 58 76 54 78 C50 80 46 79 42 80 C38 82 34 82 30 80 C26 78 24 74 23 70 C21 64 20 58 20 52 C21 48 24 46 24 42 C22 38 22 34 24 30 C25 26 22 24 23 20 C25 16 28 14 30 12 Z'
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="전국 운송 네트워크 개념도">
      <defs>
        <linearGradient id="kg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#dbe8fa" /><stop offset="1" stopColor="#b9d1f3" /></linearGradient>
        <pattern id="dots" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".45" fill="#4a8fe8" opacity=".55" /></pattern>
      </defs>
      <path d={outline} fill="url(#kg)" stroke="#9dbdeb" strokeWidth=".6" strokeLinejoin="round" />
      <path d={outline} fill="url(#dots)" />
      <ellipse cx="27" cy="93" rx="5.5" ry="2.4" fill="#c8daf5" stroke="#9dbdeb" strokeWidth=".4" />
      {/* 간선 노선 (이천 허브 기준) */}
      {hubs.filter(h => !h.main).map((h, i) => {
        const c = hubs.find(x => x.main && x.name.includes('이천')) || hubs[0]
        return <line key={i} x1={c.x} y1={c.y} x2={h.x} y2={h.y} stroke="#054592" strokeWidth=".45" strokeDasharray="1.4 1.2" opacity=".5" />
      })}
      {hubs.map((h, i) => (
        <g key={i} className="map__hub">
          {h.main && <circle className="pulse" cx={h.x} cy={h.y} r="4" fill="none" stroke="#054592" strokeWidth=".8" />}
          <circle cx={h.x} cy={h.y} r={h.main ? 2.4 : 1.6} fill={h.main ? '#054592' : '#fff'} stroke="#054592" strokeWidth=".9" />
          <text x={h.x < 27 ? h.x - 3 : h.x + 3.4} y={h.y + 1.2} textAnchor={h.x < 27 ? 'end' : 'start'} fontSize={h.main ? 3.4 : 3} fontWeight={h.main ? 800 : 600}>{h.name}</text>
        </g>
      ))}
      <text x="4" y="97" fontSize="2.4" fill="#8b93a5">※ 권역 네트워크 개념도</text>
    </svg>
  )
}
