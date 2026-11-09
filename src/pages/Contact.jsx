import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import { SectionHead } from '../components/Section'
import { useContent } from '../context/ContentContext'
import { SUPPORT_NAV } from './support/supportNav'
import { Phone, Mail, Pin, Fax, Spark, ArrowRight } from '../components/Icons'

// 고객센터 — 에디토리얼 레이아웃: 좌측 큰 타이포 + 운영시간, 우측 연락 채널 리스트(라인 구분) → FAQ(가운데 정렬)
export default function Contact() {
  const { content: c } = useContent(); const cp = c.contactPage; const co = c.company
  const [open, setOpen] = useState(null)
  const rows = [
    { Ic: Phone, k: '대표 전화', v: co.phone, href: `tel:${co.phone}`, d: '물류 상담 · 배차 · 정산 · 일반 문의', main: true },
    { Ic: Spark, k: '에스원퀵 접수', v: co.quickPhone, href: `tel:${co.quickPhone}`, d: '퀵 · 소형 화물 당일 접수' },
    { Ic: Mail, k: '이메일', v: co.email, href: `mailto:${co.email}`, d: '견적 요청 · 서류 접수' },
    { Ic: Fax, k: '팩스', v: co.fax, d: '계약서 · 거래명세서 송부' },
    { Ic: Pin, k: '본사', v: co.address, d: '오시는 길', to: '/company/offices#location' },
  ]
  return (
    <>
      <PageHead label="CUSTOMER CENTER" title={cp.title} desc={cp.lead} image="img/banner_contact.jpg" crumb={['고객센터', '문의하기']} subnav={SUPPORT_NAV} />

      <section className="section ct">
        <div className="wrap ct__grid">
          <div className="ct__intro" data-reveal="">
            <span className="sh-en">Contact</span>
            <h2 className="pre">{'무엇이든\n문의해 주십시오'}</h2>
            <p>전담 담당자가 직접 답변드립니다. 긴급 배차·운행 문의는 대표 전화로 연결됩니다.</p>
            <dl className="ct__hours">
              <div><dt>평일</dt><dd>09:00 – 18:00</dd></div>
              <div><dt>점심</dt><dd>12:30 – 13:30</dd></div>
              <div><dt>휴무</dt><dd>토 · 일 · 공휴일</dd></div>
            </dl>
            {cp.kakao && <div className="ct__kakao"><span>talk</span><div><b>{cp.kakao.title}</b><p>{cp.kakao.desc}</p></div></div>}
          </div>
          <ul className="ct__list" data-reveal="" style={{ transitionDelay: '.08s' }}>
            {rows.map((r, i) => (
              <li key={i} className={r.main ? 'is-main' : ''}>
                <span className="ct__k"><r.Ic />{r.k}</span>
                <div className="ct__v">
                  {r.href ? <a href={r.href}>{r.v}</a> : <b>{r.v}</b>}
                  <span className="ct__d">{r.d}</span>
                </div>
                {r.href && <a className="ct__go" href={r.href} aria-label={`${r.k} 연결`}><ArrowRight /></a>}
                {r.to && <Link className="ct__go" to={r.to} aria-label="오시는 길 보기"><ArrowRight /></Link>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--soft">
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
