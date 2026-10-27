// 차종 도식 일러스트 (측면) — 차체 형태 구분용 자체 제작 SVG
const C = { body: '#ffffff', line: '#9fb3cf', cab: '#e8eef7', glass: '#bcd3f0', dark: '#2a3550', blue: '#054592', wheel: '#1f2638', hub: '#c9d3e1', ground: '#dfe6f0' }

function Wheel({ x, y = 78, r = 9 }) {
  return <g><circle cx={x} cy={y} r={r} fill={C.wheel} /><circle cx={x} cy={y} r={r * .45} fill={C.hub} /></g>
}
function Cab({ x = 8, w = 34, h = 44, y = 30 }) {
  return (
    <g>
      <path d={`M${x} ${y + h} V${y + 10} Q${x} ${y} ${x + 10} ${y} H${x + w - 4} Q${x + w} ${y} ${x + w} ${y + 4} V${y + h} Z`} fill={C.cab} stroke={C.line} strokeWidth="1.2" />
      <path d={`M${x + 4} ${y + 18} V${y + 10} Q${x + 4} ${y + 5} ${x + 10} ${y + 5} H${x + w - 6} V${y + 18} Z`} fill={C.glass} />
      <rect x={x + 2} y={y + h - 8} width="6" height="3" rx="1" fill="#f5c46b" />
    </g>
  )
}

export default function VehicleArt({ type = 'box-m' }) {
  const ground = <rect x="0" y="86" width="240" height="2" rx="1" fill={C.ground} />
  let body = null
  switch (type) {
    case 'quick':
      body = (
        <g>
          <rect x="120" y="34" width="34" height="26" rx="4" fill={C.body} stroke={C.line} strokeWidth="1.2" />
          <path d="M92 66 Q100 44 122 44 L132 62 L150 62 Q160 62 162 70 L96 72 Z" fill={C.cab} stroke={C.line} strokeWidth="1.2" />
          <path d="M96 48 L88 30 L94 28" stroke={C.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
          <Wheel x={98} y={76} r={11} /><Wheel x={152} y={76} r={11} />
          <g transform="translate(16 0)">
            <rect x="6" y="40" width="58" height="32" rx="3" fill={C.body} stroke={C.line} strokeWidth="1.2" />
            <path d="M6 72 V52 Q6 40 18 40 H24 V72 Z" fill={C.cab} stroke={C.line} strokeWidth="1.2" />
            <rect x="9" y="45" width="12" height="10" rx="2" fill={C.glass} />
            <Wheel x={18} y={78} r={7} /><Wheel x={52} y={78} r={7} />
          </g>
        </g>
      )
      break
    case 'box-s':
      body = <g><rect x="42" y="22" width="110" height="52" rx="3" fill={C.body} stroke={C.line} strokeWidth="1.2" /><Cab x={14} w={30} h={44} y={30} /><rect x="42" y="72" width="112" height="5" fill={C.dark} /><Wheel x={36} /><Wheel x={128} /></g>
      break
    case 'reefer':
      body = <g><rect x="46" y="16" width="160" height="58" rx="3" fill={C.body} stroke={C.line} strokeWidth="1.2" /><rect x="46" y="10" width="20" height="8" rx="2" fill={C.dark} /><path d="M70 26 l6 6 m0 -6 l-6 6 M73 24 v10 M68 29 h10" stroke={C.blue} strokeWidth="1.4" /><Cab x={10} w={36} h={46} y={28} /><rect x="46" y="72" width="162" height="5" fill={C.dark} /><Wheel x={34} /><Wheel x={160} /><Wheel x={182} /></g>
      break
    case 'wing':
      body = (
        <g>
          <rect x="46" y="44" width="176" height="30" fill={C.body} stroke={C.line} strokeWidth="1.2" />
          <path d="M46 44 L82 10 H206 L222 44 Z" fill="#f3f7fc" stroke={C.line} strokeWidth="1.2" />
          <path d="M60 44 L90 18 H200" stroke={C.blue} strokeWidth="1" opacity=".5" fill="none" />
          <rect x="70" y="56" width="22" height="16" fill="#d9c3a1" /><rect x="96" y="56" width="22" height="16" fill="#d9c3a1" /><rect x="122" y="56" width="22" height="16" fill="#d9c3a1" /><rect x="148" y="56" width="22" height="16" fill="#d9c3a1" /><rect x="174" y="56" width="22" height="16" fill="#d9c3a1" />
          <Cab x={8} w={38} h={46} y={28} /><rect x="46" y="72" width="178" height="5" fill={C.dark} /><Wheel x={32} /><Wheel x={58} /><Wheel x={176} /><Wheel x={200} />
        </g>
      )
      break
    case 'cargo':
      body = <g><rect x="46" y="58" width="168" height="16" fill={C.body} stroke={C.line} strokeWidth="1.2" /><path d="M46 58 V48 M214 58 V48" stroke={C.line} strokeWidth="2" /><rect x="70" y="40" width="70" height="18" fill="#9aa9bd" /><rect x="146" y="46" width="44" height="12" fill="#b9c4d3" /><Cab x={10} w={36} h={46} y={28} /><rect x="46" y="72" width="170" height="5" fill={C.dark} /><Wheel x={34} /><Wheel x={168} /><Wheel x={192} /></g>
      break
    case 'container':
      body = <g><rect x="58" y="20" width="176" height="52" rx="2" fill="#2f5d9e" /><path d={Array.from({ length: 16 }, (_, i) => `M${66 + i * 10.5} 24 V68`).join(' ')} stroke="#5b83bd" strokeWidth="1.4" /><Cab x={4} w={40} h={46} y={28} /><rect x="44" y="70" width="192" height="6" fill={C.dark} /><Wheel x={28} /><Wheel x={58} /><Wheel x={196} /><Wheel x={218} /></g>
      break
    default:
      body = <g><rect x="46" y="18" width="150" height="56" rx="3" fill={C.body} stroke={C.line} strokeWidth="1.2" /><Cab x={10} w={36} h={46} y={28} /><rect x="46" y="72" width="152" height="5" fill={C.dark} /><Wheel x={34} /><Wheel x={150} /><Wheel x={172} /></g>
  }
  return <svg viewBox="0 0 240 92" role="img" aria-hidden="true">{ground}{body}</svg>
}
