import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import { SectionHead } from '../components/Section'
import { useContent } from '../context/ContentContext'
import { SUPPORT_NAV } from './support/supportNav'
import { Phone, Mail, Pin, Fax, Spark, Truck, Handshake, ArrowRight } from '../components/Icons'

// 고객센터 — 연락 창구 안내 · 빠른 바로가기 · FAQ
export default function Contact() {
  const { content: c } = useContent(); const cp = c.contactPage; const co = c.company
  const [open, setOpen] = useState(null)
  return (
    <>
      <PageHead label="CUSTOMER CENTER" title={cp.title} desc={cp.lead} image="img/banner_contact.jpg" crumb={['고객센터', '고객센터']} subnav={SUPPORT_NAV} />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="CONTACT" title={'무엇이든 문의해 주십시오\n담당자가 직접 답변드립니다'} lead="업무 시간: 평일 09:00~18:00 (토·일·공휴일 휴무). 긴급 배차·운행 문의는 대표 전화로 연락 주십시오." />
          <div className="cc-grid">
            <a className="cc-card cc-card--main" href={`tel:${co.phone}`} data-reveal="">
              <span className="card__icon"><Phone /></span><b>대표 전화</b><strong>{co.phone}</strong><p>물류 상담 · 배차 · 정산 · 일반 문의</p>
            </a>
            <a className="cc-card" href={`tel:${co.quickPhone}`} data-reveal="" style={{ transitionDelay: '.06s' }}>
              <span className="card__icon"><Spark /></span><b>에스원퀵 접수</b><strong>{co.quickPhone}</strong><p>퀵 · 소형 화물 당일 접수</p>
            </a>
            <a className="cc-card" href={`mailto:${co.email}`} data-reveal="" style={{ transitionDelay: '.12s' }}>
              <span className="card__icon"><Mail /></span><b>이메일</b><strong className="t-blue">{co.email}</strong><p>견적 요청 · 서류 접수</p>
            </a>
            <div className="cc-card" data-reveal="" style={{ transitionDelay: '.18s' }}>
              <span className="card__icon"><Fax /></span><b>팩스</b><strong>{co.fax}</strong><p>계약서 · 거래명세서 송부</p>
            </div>
            <div className="cc-card cc-card--wide" data-reveal="" style={{ transitionDelay: '.24s' }}>
              <span className="card__icon"><Pin /></span><b>본사</b><strong>{co.address}</strong><p><Link to="/company/offices#location">오시는 길 보기 <ArrowRight /></Link></p>
            </div>
          </div>
          {cp.kakao && <div className="notice cc-kakao" data-reveal=""><b>{cp.kakao.title}</b> — {cp.kakao.desc}</div>}
        </div>
      </section>

      <section className="section section--soft">
        <div className="wrap">
          <SectionHead center eyebrow="QUICK LINKS" title="용건에 맞는 창구로 바로 연결됩니다" />
          <div className="cc-links">
            <Link to="/contact/partnership" className="cc-link" data-reveal=""><span className="card__icon"><Handshake /></span><div><b>제휴문의</b><p>기업 물류 위탁 · 창고 · 컨설팅 견적 신청</p></div><ArrowRight /></Link>
            <Link to="/driver" className="cc-link" data-reveal="" style={{ transitionDelay: '.06s' }}><span className="card__icon"><Truck /></span><div><b>차주 전용</b><p>운송료내역서 · 보험/할부/공과금 · 차주 공지</p></div><ArrowRight /></Link>
            <Link to="/recruitment/jobs" className="cc-link" data-reveal="" style={{ transitionDelay: '.12s' }}><span className="card__icon"><Truck /></span><div><b>차주구인</b><p>노선별 차주 모집 공고 확인 · 지원</p></div><ArrowRight /></Link>
            <Link to="/support/notice" className="cc-link" data-reveal="" style={{ transitionDelay: '.18s' }}><span className="card__icon"><Mail /></span><div><b>공지사항</b><p>공지 · 삼원소식 · 자료실</p></div><ArrowRight /></Link>
          </div>
        </div>
      </section>

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
