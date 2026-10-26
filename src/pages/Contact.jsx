import { useState } from 'react'
import PageHead from '../components/PageHead'
import { SectionHead } from '../components/Section'
import { useContent } from '../context/ContentContext'
import { Phone, Mail, Pin, Fax, ArrowRight } from '../components/Icons'

export default function Contact() {
  const { content: c } = useContent(); const cp = c.contactPage; const co = c.company
  const [f, setF] = useState({ company: '', name: '', phone: '', email: '', service: '기업물류 (Middle Mile)', msg: '' })
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const body = `회사명: ${f.company}\n담당자: ${f.name}\n연락처: ${f.phone}\n이메일: ${f.email}\n관심 서비스: ${f.service}\n\n문의 내용:\n${f.msg}`
    window.location.href = `mailto:${co.email}?subject=${encodeURIComponent(`[홈페이지 문의] ${f.company} ${f.name}`)}&body=${encodeURIComponent(body)}`
  }
  return (
    <>
      <PageHead label="CONTACT" title={cp.title} desc={cp.lead} crumb={['고객센터']} />
      <section className="section">
        <div className="container contact-grid">
          <div data-reveal="">
            <span className="eyebrow">CONTACT</span><h2 className="h-section">연락처</h2>
            <div className="contact-info">
              <a href={`tel:${co.phone}`}><Phone /><div><b>대표번호</b>{co.phone}</div></a>
              <a href={`tel:${co.quickPhone}`}><Phone /><div><b>에스원퀵 접수</b>{co.quickPhone}</div></a>
              <a href={`mailto:${co.email}`}><Mail /><div><b>이메일</b>{co.email}</div></a>
              <div><Fax /><div><b>팩스</b>{co.fax}</div></div>
              <div><Pin /><div><b>본사</b>{co.address}</div></div>
            </div>
            <h3 className="h-sub" style={{ margin: '40px 0 16px' }}>상담 진행 절차</h3>
            <div className="steps" style={{ gridTemplateColumns: '1fr' }}>
              {cp.processSteps.map((s, i) => <div className="step" key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12 }}><div className="step__n">STEP {i + 1}</div><div><h3 style={{ marginTop: 0 }}>{s.title}</h3><p>{s.desc}</p></div></div>)}
            </div>
          </div>
          <form className="form" onSubmit={submit} data-reveal="">
            <h3 className="h-sub">온라인 문의</h3>
            <p className="small">작성하신 내용은 메일 프로그램을 통해 담당자에게 전달됩니다.</p>
            <div className="row">
              <label>회사명<input required value={f.company} onChange={on('company')} placeholder="예) ○○식품㈜" /></label>
              <label>담당자<input required value={f.name} onChange={on('name')} placeholder="성함" /></label>
            </div>
            <div className="row">
              <label>연락처<input required value={f.phone} onChange={on('phone')} placeholder="010-0000-0000" /></label>
              <label>이메일<input type="email" value={f.email} onChange={on('email')} placeholder="name@company.com" /></label>
            </div>
            <label>관심 서비스<select value={f.service} onChange={on('service')}>
              {['기업물류 (Middle Mile)', '유통물류 (Last Mile)', '주선 · 에스원퀵', '창고운영 · 리스크관리', '물류컨설팅', '기타'].map(x => <option key={x}>{x}</option>)}
            </select></label>
            <label>문의 내용<textarea rows="6" required value={f.msg} onChange={on('msg')} placeholder="물동량, 배송 권역, 운송 주기, 품목 등을 알려주시면 정확한 제안이 가능합니다." /></label>
            <button className="btn btn--primary" type="submit">문의 보내기 <ArrowRight /></button>
          </form>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container container--narrow">
          <SectionHead eyebrow="FAQ" title="자주 묻는 질문" />
          <div className="faq" data-reveal="">{cp.faqs.map((q, i) => <details key={i}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
        </div>
      </section>
    </>
  )
}
