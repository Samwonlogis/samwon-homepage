import PageHead from '../components/PageHead'
import { useContent } from '../context/ContentContext'

export function Privacy() {
  const { content: c } = useContent()
  return (<><PageHead title="개인정보처리방침" crumb={['개인정보처리방침']} />
    <section className="section"><div className="container container--narrow legal">
      <p>{c.company.name}(이하 "회사")는 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>
      <h2>1. 수집하는 개인정보 항목 및 수집 방법</h2><p>회사는 물류 상담, 제휴 문의, 채용 지원 처리를 위해 회사명, 담당자 성명, 연락처, 이메일을 홈페이지 문의 양식, 이메일, 유선을 통해 수집합니다.</p>
      <h2>2. 개인정보의 수집 및 이용 목적</h2><ul><li>물류 상담 및 견적 제안, 계약 체결 및 이행</li><li>채용 지원자 심사 및 연락</li><li>문의 응대 및 고객 관리</li></ul>
      <h2>3. 보유 및 이용 기간</h2><p>수집 목적 달성 후 지체 없이 파기하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
      <h2>4. 개인정보의 제3자 제공</h2><p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 근거한 요청이 있는 경우는 예외로 합니다.</p>
      <h2>5. 정보주체의 권리</h2><p>이용자는 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있으며, 회사는 지체 없이 조치합니다.</p>
      <h2>6. 개인정보 보호책임자</h2><p>개인정보 보호책임자: 관리팀 · 전화 {c.company.phone} · 이메일 {c.company.email}</p>
      <p className="small" style={{ marginTop: 32 }}>본 방침은 게시일로부터 시행됩니다.</p>
    </div></section></>)
}
export function Terms() {
  const { content: c } = useContent()
  return (<><PageHead title="이용약관" crumb={['이용약관']} />
    <section className="section"><div className="container container--narrow legal">
      <h2>제1조 (목적)</h2><p>본 약관은 {c.company.name}(이하 "회사")가 운영하는 홈페이지의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
      <h2>제2조 (서비스의 내용)</h2><p>회사는 회사 및 사업 정보 제공, 물류 상담·제휴 문의 접수, 채용 정보 제공 서비스를 제공합니다.</p>
      <h2>제3조 (저작권)</h2><p>홈페이지에 게시된 콘텐츠의 저작권은 회사에 귀속되며, 거래처 상호 및 상표의 권리는 각 사에 귀속됩니다. 사전 동의 없는 무단 복제·배포를 금지합니다.</p>
      <h2>제4조 (책임의 제한)</h2><p>홈페이지에 게시된 정보는 참고용이며, 실제 계약 조건은 별도 협의에 따릅니다.</p>
      <h2>제5조 (분쟁 해결)</h2><p>본 약관과 관련한 분쟁은 대한민국 법령을 준거법으로 하며, 회사 본사 소재지 관할 법원을 전속 관할로 합니다.</p>
    </div></section></>)
}
export function NotFound() {
  return (<><PageHead title="페이지를 찾을 수 없습니다" />
    <section className="section"><div className="container" style={{ textAlign: 'center' }}><p className="lead" style={{ margin: '0 auto' }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p><a className="btn btn--primary" href="./" style={{ marginTop: 24 }}>홈으로</a></div></section></>)
}
