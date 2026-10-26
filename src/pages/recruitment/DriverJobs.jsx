import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { Check, Phone } from '../../components/Icons'
const NAV = [{ to: '/recruitment/talent', label: '인재채용' }, { to: '/recruitment/jobs', label: '차주 모집' }]

export default function DriverJobs() {
  const { content: c } = useContent(); const r = c.recruitment
  return (
    <>
      <PageHead label="DRIVER PARTNERS" title="차주 모집" desc={r.driverIntro} crumb={['채용정보', '차주 모집']} subnav={NAV} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="OPEN POSITIONS" title="모집 중인 운송 물량" lead="고정 물량 기준으로 공고합니다. 상세 조건은 대표번호로 문의하시면 전담 배차 관리자가 안내해 드립니다." />
          <div className="card-grid">
            {r.driverJobs.map((j, i) => (
              <div className="driver-job" key={i} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <span className={`chip ${j.type === '차량분양' ? 'chip--accent' : ''}`} style={{ justifySelf: 'start', display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: j.type === '차량분양' ? '#fff1e6' : 'var(--blue-50)', color: j.type === '차량분양' ? '#c45a0f' : 'var(--blue)', fontWeight: 700, fontSize: 12.5 }}>{j.type}</span>
                <h3>{j.title}</h3>
                <dl><dt>차량</dt><dd>{j.vehicle}</dd><dt>구간</dt><dd>{j.area}</dd><dt>시간</dt><dd>{j.hours}</dd></dl>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div data-reveal="">
            <span className="eyebrow">REQUIREMENTS</span><h2 className="h-section">지원 자격</h2>
            <ul className="check-list" style={{ marginTop: 20 }}>{r.driverRequirements.map((x, i) => <li key={i}><Check />{x}</li>)}</ul>
          </div>
          <div data-reveal="">
            <span className="eyebrow">BENEFITS</span><h2 className="h-section">파트너 지원</h2>
            <ul className="check-list" style={{ marginTop: 20 }}>{r.driverBenefits.map((x, i) => <li key={i}><Check />{x}</li>)}</ul>
            <a className="btn btn--primary" href={`tel:${c.company.phone}`} style={{ marginTop: 20 }}><Phone /> 유선 지원 {c.company.phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
