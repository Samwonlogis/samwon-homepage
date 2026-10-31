/**
 * 관리자 비밀번호 설정
 * 비밀번호는 2026-10-31 변경됨 (원문은 기재하지 않음)
 * 변경 방법: 관리자 화면 하단 "비밀번호 해시 생성기"에 새 비밀번호를 입력해 나온 값을 아래 passwordHash에 붙여넣고 GitHub에 커밋
 * ※ 정적 사이트 특성상 열람 제한 수준의 보호입니다. 비밀번호 원문은 이 파일에 적지 마십시오.
 */
export const adminConfig = {
  passwordHash: '94c47d91f1bebd7b85fb5b4210cb24a8125beaf843e6e4a7a80698817c79ae64',
  sessionKey: 'samwon_admin_session',
}
