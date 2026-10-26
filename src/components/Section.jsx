export function SectionHead({ eyebrow, title, lead, center, light }) {
  return (
    <div className={`section-head ${center ? 'section-head--center' : ''}`} data-reveal="">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="h-section pre">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}
