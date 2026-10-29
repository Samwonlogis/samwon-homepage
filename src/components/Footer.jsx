import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import { Phone, ArrowDown } from './Icons'

// 푸터 — 로고 · 바로가기(오시는 길/인증/고객센터) · 회사 정보 · 저작권
export default function Footer() {
  const { content } = useContent()
  const c = content.company
  return (
    <>
      <footer className="footer ft">
        <div className="wrap">
          <div className="ft__top">
            <img className="ft__logo" src={asset('samwon_logo.svg')} alt="SAMWON" />
            <nav className="ft__nav" aria-label="푸터 바로가기">
              <Link to="/company/offices#location">오시는 길</Link>
              <Link to="/#certs">인증</Link>
              <Link to="/contact">고객센터</Link>
            </nav>
          </div>
          <div className="ft__body">
            <dl className="ft__info">
              <div><dt>본사</dt><dd>{c.address}</dd></div>
              <div><dt>TEL</dt><dd><a href={`tel:${c.phone}`}>{c.phone}</a></dd><dt>FAX</dt><dd>{c.fax}</dd></div>
              <div><dt>E-MAIL</dt><dd><a href={`mailto:${c.email}`}>{c.email}</a></dd></div>
              <div><dt>대표이사</dt><dd>{c.ceo}</dd><dt>사업자등록번호</dt><dd>{c.bizNumber}</dd></div>
            </dl>
            <div className="ft__side">
              <Link to="/privacy" className="ft__privacy">개인정보처리방침</Link>
              <Link to="/terms">이용약관</Link>
            </div>
          </div>
          <div className="ft__bottom">
            <span>{content.footer.copyright}</span>
            <span className="ft__right">
              <Link to="/admin" className="ft__admin">관리자</Link>
              <button type="button" className="ft__top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="맨 위로"><ArrowDown /> TOP</button>
            </span>
          </div>
        </div>
      </footer>
      <nav className="mobile-bar" aria-label="빠른 연락">
        <a href={`tel:${c.phone}`}><Phone /> 전화 상담</a>
        <Link to="/contact">물류 상담 신청</Link>
      </nav>
    </>
  )
}
