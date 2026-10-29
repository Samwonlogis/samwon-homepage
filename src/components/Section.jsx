// 영문 라벨을 레퍼런스 스타일(Title Case, Poppins)로 — 3자 이하 약어(SCM·CEO·ISO 등)는 대문자 유지
export const titleCase = (s = '') => String(s).toLowerCase().split(/(\s+|·|&)/).map(w => {
  const up = w.toUpperCase()
  if (/^[A-Z0-9]{2,3}$/.test(up) && !['AND', 'THE', 'OUR', 'WHY', 'FOR', 'US', 'TO', 'OF', 'BY', 'IN', 'ON'].includes(up)) return up
  return w.charAt(0).toUpperCase() + w.slice(1)
}).join('')

export function SectionHead({ eyebrow, title, lead, center }) {
  return (
    <div className={`section-head ${center ? 'section-head--center' : ''}`} data-reveal="">
      {eyebrow && <span className="sh-en">{titleCase(eyebrow)}</span>}
      <h2 className="h-section pre">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}
