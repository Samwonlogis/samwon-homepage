import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'

const NAV = [{ to: '/recruitment/talent', label: '인재상' }, { to: '/recruitment/jobs', label: '차주구인' }]
// "실행력 (Execution)" → { ko: '실행력', en: 'Execution' }
const split = (t = '') => { const m = t.match(/^(.*?)\s*\((.*)\)\s*$/); return m ? { ko: m[1], en: m[2] } : { ko: t, en: '' } }

export default function Talent() {
  const { content: c } = useContent(); const r = c.recruitment
  return (
    <>
      <PageHead label="CAREERS" title="인재상" desc={r.subtitle} logo crumb={['채용정보', '인재상']} subnav={NAV} />

      {/* 선언 */}
      <section className="section tl-intro">
        <div className="wrap">
          <div className="ov" data-reveal="">
            <div className="ov__head">
              <h2 className="pre">{'물류는 결국\n사람이 만듭니다'}</h2>
            </div>
            <div className="ov__text"><p>{r.lead}</p><p>삼원종합물류는 현장의 판단력과 데이터 감각, 그리고 파트너를 존중하는 태도를 갖춘 사람과 함께 대한민국 공급망의 내일을 설계합니다.</p></div>
          </div>
        </div>
      </section>

      {/* 4대 역량 — 사진 없이 글자와 선으로 (기업비전 핵심가치와 같은 구성) */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead eyebrow="Core Values" title={r.title} />
          <ul className="vgrid" data-reveal="">
            {r.values.map((v, i) => { const t = split(v.title); return (
              <li key={i}>
                <h3>{t.ko}</h3>
                <p>{v.desc}</p>
              </li>) })}
          </ul>
        </div>
      </section>

      {/* 채용 절차 — 실제 순서이므로 번호 사용 */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Process" title="채용 절차 안내" lead={r.processLead} />
          <ol className="stepx" data-reveal="">
            {r.process.map((p, i) => (
              <li key={i}>
                <span className="stepx__no">{p.step || String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                {p.desc && <p>{p.desc}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 복리후생 */}
      <section className="section section--soft">
        <div className="wrap tb">
          <div className="tb__head" data-reveal="">
            <h2>임직원 복리후생</h2>
            <p>{r.welfareLead || '구성원 한 사람 한 사람의 전문성과 성장이 존중받는 근무 환경을 만들어 갑니다.'}</p>
          </div>
          <ul className="tb__list" data-reveal="">
            {(r.benefits || []).map((b, i) => (
              <li key={i}><h3>{b.title}</h3><p>{b.desc}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* 지원 안내 */}
      <section className="applyx">
        <div className="wrap applyx__in" data-reveal="">
          <div>
            <h2>삼원과 함께 성장할 동료를 기다립니다</h2>
            <p>{r.applyLead || '입사 지원과 채용 관련 문의는 아래 이메일과 전화로 받고 있습니다.'}</p>
          </div>
          <dl>
            <div><dt>이메일 지원</dt><dd><a href={`mailto:${c.company.email}`}>{c.company.email}</a></dd></div>
            <div><dt>채용 문의</dt><dd><a href={`tel:${c.company.phone}`}>{c.company.phone}</a></dd></div>
          </dl>
        </div>
      </section>
    </>
  )
}
