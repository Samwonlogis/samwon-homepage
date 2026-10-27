export function SectionHead({ eyebrow, title, lead, center }) {
  return (
    <div className={`section-head ${center ? 'section-head--center' : ''}`} data-reveal="">
      {eyebrow && <span className={center ? 'pill' : 'eyebrow'}>{eyebrow}</span>}
      <h2 className="h-section pre">{title}</h2>
      {center && <span className="bar" />}
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}
