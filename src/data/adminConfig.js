/**
 * 관리자 비밀번호 설정
 * 초기 비밀번호: samwon@3001  (배포 후 반드시 변경 권장)
 * 변경 방법: 관리자 화면 하단 "비밀번호 해시 생성기"에 새 비밀번호를 입력해 나온 값을 아래 passwordHash에 붙여넣고 GitHub에 커밋
 * ※ 정적 사이트 특성상 열람 제한 수준의 보호입니다. 비밀번호 원문은 이 파일에 적지 마십시오.
 */
export const adminConfig = {
  passwordHash: '6f15f0a8b5e9b8ec122715a48cca9862fa272bb2f1f2478bea4b8d391bf8c1d9',
  sessionKey: 'samwon_admin_session',
}
