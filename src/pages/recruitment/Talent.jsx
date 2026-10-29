import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { asset } from '../../utils/storage'
import { Chart, Shield, Star, Box, Users, Leaf, Mail, Phone } from '../../components/Icons'

const NAV = [{ to: '/recruitment/talent', label: '인재상' }, { to: '/recruitment/jobs', label: '차주구인' }]
const VALUE_IMGS = ['img/talent/execution.jpg', 'img/talent/trust.jpg', 'img/talent/expertise.jpg', 'img/talent/teamwork.jpg']
const BENEFIT_ICONS = [Chart, Shield, Star, Box, Users, Leaf]
// "실행력 (Execution)" → { ko: '실행력', en: 'Execution' }
const split = (t = '') => { const m = t.match(/^(.*?)\s*\((.*)\)\s*$/); return m ? { ko: m[1], en: m[2] } : { ko: t, en: '' } }

export default function Talent() {
  const { content: c } = useContent(); const r = c.recruitment
  return (
    <>
      <PageHead label="CAREERS" title="인재상" desc={r.subtitle} image="img/banner_talent.jpg" crumb={['채용정보', '인재상']} subnav={NAV} />

      {/* 선언 */}
      <section className="section tl-intro">
        <div className="wrap">
          <div className="ov" data-reveal="">
            <div className="ov__head">
              <span className="sh-en">People of Samwon</span>
              <h2 className="pre">{'물류는 결국\n사람이 만듭니다'}</h2>
            </div>
            <div className="ov__text"><p>{r.lead}</p><p>삼원종합물류는 현장의 판단력과 데이터 감각, 그리고 파트너를 존중하는 태도를 갖춘 사람과 함께 대한민국 공급망의 내일을 설계합니다.</p></div>
          </div>
        </div>
      </section>

      {/* 4대 역량 — 이미지 패널 */}
      <section className="section tl-values-sec">
        <div className="wrap">
          <SectionHead eyebrow="CORE VALUES" title={r.title} />
        </div>
        <div className="wrap tv">
          {r.values.map((v, i) => { const t = split(v.title); return (
            <article className="tv__panel" key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
              <img src={asset(v.image || VALUE_IMGS[i % VALUE_IMGS.length])} alt="" loading="lazy" />
              <div className="tv__body">
                <span className="tv__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="tv__en">{t.en}</span>
                <h3>{t.ko}</h3>
                <p>{v.desc}</p>
              </div>
            </article>) })}
        </div>
      </section>

      {/* 채용 절차 */}
      <section className="section section--soft">
        <div className="wrap">
          <SectionHead eyebrow="PROCESS" title="채용 절차 안내" />
          <ol className="tp">
            {r.process.map((p, i) => (
              <li key={i} data-reveal="" style={{ transitionDelay: `${i * .08}s` }}>
                <span className="tp__no">{p.step || String(i + 1).padStart(2, '0')}</span>
                <h4>{p.title}</h4>
                {p.desc && <p>{p.desc}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 복리후생 */}
      <section className="section">
        <div className="wrap tb">
          <div className="tb__head" data-reveal="">
            <span className="sh-en">Welfare</span>
            <h2>임직원 복리후생</h2>
            <p>{r.welfareLead || '구성원 한 사람 한 사람의 전문성과 성장이 존중받는 근무 환경을 만들어 갑니다.'}</p>
          </div>
          <ul className="tb__list">
            {(r.benefits || []).map((b, i) => { const Ic = BENEFIT_ICONS[i % BENEFIT_ICONS.length]; return (
              <li key={i} data-reveal="" style={{ transitionDelay: `${i * .05}s` }}>
                <span className="tb__ic"><Ic /></span>
                <h4>{b.title}</h4><p>{b.desc}</p>
              </li>) })}
          </ul>
        </div>
      </section>

      {/* 지원 안내 밴드 */}
      <section className="tl-apply">
        <img src={asset('img/banner_talent.jpg')} alt="" loading="lazy" />
        <div className="wrap" data-reveal="">
          <span className="sh-en">Join Us</span>
          <h2>삼원과 함께 성장할 동료를 기다립니다</h2>
          <div className="tl-apply__links">
            <a href={`mailto:${c.company.email}`}><Mail /> {c.company.email}</a>
            <a href={`tel:${c.company.phone}`}><Phone /> {c.company.phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
