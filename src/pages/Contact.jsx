import { useState } from 'react'
import PageHead from '../components/PageHead'
import { SectionHead } from '../components/Section'
import { useContent } from '../context/ContentContext'
import { Phone, Mail, Pin, Fax, Truck, Chart, Spark, Handshake, ArrowRight } from '../components/Icons'

const STEP_ICONS = [Phone, Chart, Spark, Handshake]

export default function Contact() {
  const { content: c } = useContent(); const cp = c.contactPage; const co = c.company
  const [f, setF] = useState({ name: '', phone: '', email: '', company: '', service: '기업물류 (Middle Mile)', msg: '' })
  const [open, setOpen] = useState(null)
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const body = `담당자: ${f.name}\n연락처: ${f.phone}\n이메일: ${f.email}\n회사명: ${f.company}\n문의 분야: ${f.service}\n\n상세 내용:\n${f.msg}`
    window.location.href = `mailto:${co.email}?subject=${encodeURIComponent(`[홈페이지 제휴문의] ${f.company || f.name}`)}&body=${encodeURIComponent(body)}`
  }
  return (
    <>
      <PageHead label="CONTACT US" title={cp.title} desc={cp.lead} image="img/banner_contact.jpg" crumb={['고객센터']} />

      {/* 제휴 문의 절차 */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="PROCESS" title="제휴 문의 절차" lead="현장 실사 기반의 프로세스로 정확한 견적과 최적의 운영안을 제시합니다." />
          <div className="proc proc--4">
            {cp.processSteps.map((s, i) => { const Ic = STEP_ICONS[i % STEP_ICONS.length]; return (
              <div className="proc__item" key={i} data-reveal="" style={{ transitionDelay: `${i * .1}s` }}>
                <div className="proc__num proc__num--icon"><Ic /></div>
                <span className="proc__step">STEP {String(i + 1).padStart(2, '0')}</span>
                <h4>{s.title}</h4><p>{s.desc}</p>
              </div>) })}
          </div>
        </div>
      </section>

      {/* 고객센터 안내 + 문의 양식 */}
      <section className="section section--soft">
        <div className="wrap contact-grid contact-grid--13">
          <div className="info-card" data-reveal="">
            <h2 className="h-sub">고객센터 안내</h2>
            <ul className="info-list">
              <li><span className="card__icon"><Phone /></span><div><b>대표 전화</b><p className="big">{co.phone}</p></div></li>
              <li><span className="card__icon"><Spark /></span><div><b>에스원퀵 접수</b><p className="big">{co.quickPhone}</p></div></li>
              <li><span className="card__icon"><Fax /></span><div><b>팩스 번호</b><p>{co.fax}</p></div></li>
              <li><span className="card__icon"><Mail /></span><div><b>이메일</b><p className="t-blue">{co.email}</p></div></li>
              <li><span className="card__icon"><Pin /></span><div><b>본사 소재지</b><p>{co.address}</p></div></li>
              <li><span className="card__icon"><Truck /></span><div><b>차고지</b><p>{c.offices.find(o => /차고지/.test(o.name))?.address || '경기도 연천군 전곡읍'}</p></div></li>
            </ul>
            {cp.kakao && <div className="notice"><b>{cp.kakao.title}</b><br />{cp.kakao.desc}</div>}
          </div>
          <form className="form" onSubmit={submit} data-reveal="" style={{ transitionDelay: '.1s' }}>
            <h3 className="h-sub">온라인 제휴 및 문의 신청</h3>
            <div className="row">
              <label>담당자 성함 *<input required value={f.name} onChange={on('name')} placeholder="성함을 입력하십시오" /></label>
              <label>연락처 *<input required type="tel" value={f.phone} onChange={on('phone')} placeholder="예: 010-0000-0000" /></label>
            </div>
            <div className="row">
              <label>이메일 주소 *<input required type="email" value={f.email} onChange={on('email')} placeholder="example@mail.com" /></label>
              <label>회사명<input value={f.company} onChange={on('company')} placeholder="회사명을 입력하십시오" /></label>
            </div>
            <label>문의 분야 *<select value={f.service} onChange={on('service')}>
              {['기업물류 (Middle Mile)', '유통물류 (Last Mile)', '주선 · 에스원퀵 서비스', '창고운영 및 리스크관리', '물류컨설팅', '기타 제휴 문의'].map(x => <option key={x}>{x}</option>)}
            </select></label>
            <label>상세 내용 *<textarea rows="6" required value={f.msg} onChange={on('msg')} placeholder="문의하실 구체적인 물동량, 주기, 보관 요건 등을 남겨주십시오." /></label>
            <button className="btn btn--primary btn--lg" type="submit" style={{ width: '100%' }}>제휴 문의 신청하기 <ArrowRight /></button>
            <p className="small muted" style={{ textAlign: 'center' }}>작성하신 내용은 메일 프로그램을 통해 담당자에게 전달됩니다.</p>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap wrap--narrow">
          <SectionHead center eyebrow="FAQ" title="자주 묻는 질문" lead="고객님들이 많이 질문하시는 내용을 요약해 드립니다." />
          <div className="faq-cards" data-reveal="">
            {cp.faqs.map((q, i) => (
              <div className={`faq-card ${open === i ? 'is-open' : ''}`} key={i}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)}><span><em>Q.</em>{q.q}</span><i /></button>
                <div className="faq-card__a"><div>{q.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
