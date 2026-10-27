import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/storage'
import { Phone } from './Icons'

export default function Footer() {
  const { content } = useContent()
  const c = content.company
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <img className="footer__logo" src={asset('samwon_logo.svg')} alt="SAMWON" />
              <p className="footer__desc">{content.footer.description}</p>
              <ul style={{ marginTop: 18 }}>
                <li>{c.address}</li>
                <li>TEL {c.phone} · FAX {c.fax}</li>
                <li>{c.email}</li>
                <li>대표이사 {c.ceo} · 사업자등록번호 {c.bizNumber}</li>
              </ul>
            </div>
            <div><h4>회사소개</h4><ul>
              <li><Link to="/company/intro">회사소개</Link></li><li><Link to="/company/history">회사연혁</Link></li>
              <li><Link to="/company/status">주요현황</Link></li><li><Link to="/company/location">찾아오시는 길</Link></li></ul></div>
            <div><h4>사업영역</h4><ul>
              <li><Link to="/business/corporate">기업물류</Link></li><li><Link to="/business/distribution">유통물류</Link></li>
              <li><Link to="/business/brokerage">주선 · 퀵서비스</Link></li><li><Link to="/business/warehouse">창고운영 · 리스크관리</Link></li>
              <li><Link to="/business/consulting">물류컨설팅</Link></li></ul></div>
            <div><h4>고객센터</h4><ul>
              <li><Link to="/contact">물류 상담 · 제휴 문의</Link></li><li><Link to="/recruitment/talent">인재상</Link></li>
              <li><Link to="/recruitment/jobs">차주구인</Link></li>
              <li><Link to="/driver">차주 전용</Link></li>
              <li style={{ marginTop: 14 }}><Link className="btn btn--white btn--sm" to="/contact"><Phone /> 상담 신청</Link></li></ul></div>
          </div>
          <div className="footer__bottom">
            <div>{content.footer.copyright}</div>
            <div><Link to="/privacy">개인정보처리방침</Link><Link to="/terms">이용약관</Link><Link to="/admin" className="footer__admin">관리자</Link></div>
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
