// 영문 라벨을 레퍼런스 스타일(Title Case, Poppins)로 — 3자 이하 약어(SCM·CEO·ISO 등)는 대문자 유지
export const titleCase = (s = '') => String(s).toLowerCase().split(/(\s+|·|&)/).map(w => {
  const up = w.toUpperCase()
  if (/^[A-Z0-9]{2,3}$/.test(up) && !['AND', 'THE', 'OUR', 'WHY', 'FOR', 'US', 'TO', 'OF', 'BY', 'IN', 'ON'].includes(up)) return up
  return w.charAt(0).toUpperCase() + w.slice(1)
}).join('')

// 섹션 헤드 — 영문 라벨 + 제목(좌), 리드 문장(우). 사이트 전체가 이 한 가지 형식을 씁니다. (center 는 과거 호환용이며 무시)
export function SectionHead({ eyebrow, title, lead, light }) {
  return (
    <header className={`section-head${lead ? ' has-lead' : ''}${light ? ' is-light' : ''}`} data-reveal="">
      <div className="section-head__main">
        {eyebrow && <span className="sh-en">{eyebrow}</span>}
        <h2 className="h-section pre">{title}</h2>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </header>
  )
}
