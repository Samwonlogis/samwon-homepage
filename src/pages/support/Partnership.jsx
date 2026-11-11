import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../../components/PageHead'
import { SectionHead } from '../../components/Section'
import { useContent } from '../../context/ContentContext'
import { SUPPORT_NAV } from './supportNav'
import { Phone, ArrowRight, Mail } from '../../components/Icons'

// 제휴문의 — 절차 + 온라인 문의 양식
export default function Partnership() {
  const { content: c } = useContent(); const cp = c.contactPage; const co = c.company
  const [f, setF] = useState({ name: '', phone: '', email: '', company: '', service: '기업물류', msg: '' })
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const body = `담당자: ${f.name}\n연락처: ${f.phone}\n이메일: ${f.email}\n회사명: ${f.company}\n문의 분야: ${f.service}\n\n상세 내용:\n${f.msg}`
    window.location.href = `mailto:${co.email}?subject=${encodeURIComponent(`[홈페이지 제휴문의] ${f.company || f.name}`)}&body=${encodeURIComponent(body)}`
  }
  return (
    <>
      <PageHead label="PARTNERSHIP" title={cp.partnershipTitle || '제휴문의'} desc={cp.partnershipLead} logo crumb={['고객센터', '제휴문의']} subnav={SUPPORT_NAV} />
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="PROCESS" title="제휴 문의 절차" lead="현장 실사 기반의 프로세스로 정확한 견적과 최적의 운영안을 제시합니다." />
          <ol className="stepx stepx--4" data-reveal="">
            {cp.processSteps.map((st, i) => (
              <li key={i}>
                <span className="stepx__no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section--soft">
        <div className="wrap contact-grid contact-grid--13">
          <div className="info-card" data-reveal="">
            <span className="sh-en">Direct Contact</span>
            <h2 className="h-sub">담당자 직접 문의</h2>
            <ul className="info-list">
              <li><span className="card__icon"><Phone /></span><div><b>대표 전화</b><p className="big"><a href={`tel:${co.phone}`}>{co.phone}</a></p></div></li>
              <li><span className="card__icon"><Mail /></span><div><b>이메일</b><p className="t-blue"><a href={`mailto:${co.email}`}>{co.email}</a></p></div></li>
            </ul>
            <p className="small muted">평일 09:00~18:00 · 접수 후 영업일 기준 1일 이내 담당자가 연락드립니다.</p>
          </div>
          <form className="form" onSubmit={submit} data-reveal="" style={{ transitionDelay: '.1s' }}>
            <h3 className="h-sub">온라인 제휴 문의 신청</h3>
            <div className="row">
              <label>담당자 성함 *<input required value={f.name} onChange={on('name')} placeholder="성함을 입력하십시오" /></label>
              <label>연락처 *<input required type="tel" value={f.phone} onChange={on('phone')} placeholder="예: 010-0000-0000" /></label>
            </div>
            <div className="row">
              <label>이메일 주소 *<input required type="email" value={f.email} onChange={on('email')} placeholder="example@mail.com" /></label>
              <label>회사명<input value={f.company} onChange={on('company')} placeholder="회사명을 입력하십시오" /></label>
            </div>
            <label>문의 분야 *<select value={f.service} onChange={on('service')}>
              {['기업물류', '유통물류', '주선 · 에스원퀵 서비스', '창고운영', '물류컨설팅', '기타 제휴 문의'].map(x => <option key={x}>{x}</option>)}
            </select></label>
            <label>상세 내용 *<textarea rows="6" required value={f.msg} onChange={on('msg')} placeholder="문의하실 구체적인 물동량, 주기, 보관 요건 등을 남겨주십시오." /></label>
            <div className="consent">
              <dl>
                <div><dt>수집 항목</dt><dd>담당자 성함, 연락처, 이메일, 문의 분야, 문의 내용 (회사명은 선택)</dd></div>
                <div><dt>이용 목적</dt><dd>물류 상담·제휴 문의 응대 및 결과 안내</dd></div>
                <div><dt>보유 기간</dt><dd>문의 처리 완료 후 1년</dd></div>
              </dl>
              <p>동의를 거부하실 수 있으나, 거부 시 온라인 문의 접수가 제한됩니다. 전화와 이메일 문의는 그대로 이용하실 수 있습니다. <Link to="/privacy">개인정보처리방침 보기</Link></p>
              <label className="consent__check"><input type="checkbox" required /> 개인정보 수집·이용에 동의합니다 (필수)</label>
            </div>
            <button className="btn btn--primary btn--lg" type="submit" style={{ width: '100%' }}>제휴 문의 신청하기 <ArrowRight /></button>
            <p className="small muted" style={{ textAlign: 'center' }}>작성하신 내용은 메일 프로그램을 통해 담당자에게 전달됩니다.</p>
          </form>
        </div>
      </section>
    </>
  )
}
