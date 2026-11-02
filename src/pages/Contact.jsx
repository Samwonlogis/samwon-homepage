import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import { useContent } from '../context/ContentContext'
import { SUPPORT_NAV } from './support/supportNav'
import { Phone, Mail, Pin, Fax, Spark, Truck, Handshake, ArrowRight, Clock } from '../components/Icons'

// 고객센터 — 대표 연락처(큰 카드) · 채널 목록 · 바로가기 · FAQ
export default function Contact() {
  const { content: c } = useContent(); const cp = c.contactPage; const co = c.company
  const [open, setOpen] = useState(0)
  return (
    <>
      <PageHead label="CUSTOMER CENTER" title={cp.title} desc={cp.lead} image="img/banner_contact.jpg" crumb={['고객센터', '고객센터']} subnav={SUPPORT_NAV} />

      {/* 대표 연락 — 좌: 전화 히어로 카드 / 우: 채널 목록 */}
      <section className="section cs">
        <div className="wrap cs-top">
          <div className="cs-hero" data-reveal="">
            <span className="sh-en">Call Center</span>
            <h2>물류 상담 · 배차 · 정산<br />무엇이든 문의해 주십시오</h2>
            <a className="cs-hero__tel" href={`tel:${co.phone}`}><Phone /> {co.phone}</a>
            <div className="cs-hero__time"><Clock /><div><b>평일 09:00 ~ 18:00</b><span>토 · 일 · 공휴일 휴무 / 긴급 운행 문의는 대표 전화로 연결됩니다</span></div></div>
          </div>
          <ul className="cs-ch" data-reveal="" style={{ transitionDelay: '.08s' }}>
            <li><span className="cs-ch__ic"><Spark /></span><div><small>에스원퀵 접수</small><a href={`tel:${co.quickPhone}`}>{co.quickPhone}</a><p>퀵 · 소형 화물 당일 접수</p></div></li>
            <li><span className="cs-ch__ic"><Mail /></span><div><small>이메일</small><a href={`mailto:${co.email}`}>{co.email}</a><p>견적 요청 · 서류 접수</p></div></li>
            <li><span className="cs-ch__ic"><Fax /></span><div><small>팩스</small><b>{co.fax}</b><p>계약서 · 거래명세서 송부</p></div></li>
            <li><span className="cs-ch__ic"><Pin /></span><div><small>본사</small><b>{co.address}</b><p><Link to="/company/offices#location">오시는 길 <ArrowRight /></Link></p></div></li>
          </ul>
        </div>
        {cp.kakao && <div className="wrap"><div className="cs-kakao" data-reveal=""><span className="cs-kakao__ic">talk</span><div><b>{cp.kakao.title}</b><p>{cp.kakao.desc}</p></div></div></div>}
      </section>

      {/* 바로가기 */}
      <section className="section section--soft">
        <div className="wrap">
          <div className="section-head" data-reveal=""><span className="sh-en">Quick Links</span><h2 className="h-section">용건에 맞는 창구로 바로 연결됩니다</h2></div>
          <div className="cs-links">
            {[
              { to: '/contact/partnership', Ic: Handshake, t: '제휴문의', d: '기업 물류 위탁 · 창고 · 컨설팅 견적 신청' },
              { to: '/driver', Ic: Truck, t: '차주 전용', d: '운송료내역서 · 보험/할부/공과금 · 차주 공지' },
              { to: '/recruitment/jobs', Ic: Truck, t: '차주구인', d: '노선별 차주 모집 공고 확인 · 지원' },
              { to: '/support/notice', Ic: Mail, t: '공지사항', d: '공지 · 삼원소식 · 자료실' },
            ].map((x, i) => (
              <Link to={x.to} className="cs-link" key={x.to} data-reveal="" style={{ transitionDelay: `${i * .06}s` }}>
                <span className="cs-link__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="cs-link__ic"><x.Ic /></span>
                <b>{x.t}</b><p>{x.d}</p>
                <span className="cs-link__arrow"><ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap cs-faq">
          <div className="cs-faq__head" data-reveal="">
            <span className="sh-en">FAQ</span>
            <h2 className="h-section">자주 묻는 질문</h2>
            <p className="lead">고객님들이 많이 질문하시는 내용을 요약해 드립니다. 원하는 답을 찾지 못하셨다면 대표 전화나 제휴문의로 연락 주십시오.</p>
            <Link className="btn btn--ghost" to="/contact/partnership">제휴문의 바로가기 <ArrowRight /></Link>
          </div>
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
