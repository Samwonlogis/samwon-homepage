/**
 * 직원 계정 목록 (차주구인 게시판 관리용)
 *
 * ── 계정 추가 방법 ──────────────────────────────────────────
 * 1. 관리자(admin) 계정으로 차주구인 페이지에 로그인
 * 2. 화면 하단의 "비밀번호 해시 생성기"에 새 직원의 비밀번호 입력
 * 3. 생성된 해시값을 복사하여 아래 배열에 한 줄 추가
 *    { id: '아이디', name: '이름', role: 'staff', passwordHash: '복사한해시값' },
 * 4. GitHub에서 이 파일(src/data/staffAccounts.js)을 수정 후 커밋(배포)
 *
 * role 종류:
 *   - 'admin' : 공고 등록/수정/삭제 + 해시 생성기 사용 가능
 *   - 'staff' : 공고 등록/수정/삭제 가능
 *
 * ※ 비밀번호 원문은 절대 이 파일에 적지 마세요. 해시값만 저장합니다.
 */
export const staffAccounts = [
  {
    id: 'admin',
    name: '관리자',
    role: 'admin',
    // 초기 비밀번호: samwon@3001 (배포 후 반드시 변경 권장)
    passwordHash: '6f15f0a8b5e9b8ec122715a48cca9862fa272bb2f1f2478bea4b8d391bf8c1d9'
  },
  {
    id: 'staff01',
    name: '직원1 (예시)',
    role: 'staff',
    // 초기 비밀번호: samwon1!
    passwordHash: 'a7e65cf7cb7b824080dcc291d628e2b481f34bc1b3b13ffa850d04366c5a9f3e'
  },
  {
    id: 'staff02',
    name: '직원2 (예시)',
    role: 'staff',
    // 초기 비밀번호: samwon2!
    passwordHash: '3056dc3933001bca5097ad12e9df57627a4e34af89b5b643b0d7f919d3affb1f'
  }
]

/** 문자열을 SHA-256 해시(hex)로 변환 */
export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** 아이디/비밀번호 검증 — 성공 시 계정 객체(비밀번호 제외) 반환, 실패 시 null */
export async function verifyStaffLogin(id, password) {
  const account = staffAccounts.find((a) => a.id === id.trim())
  if (!account) return null
  const hash = await sha256Hex(password)
  if (hash !== account.passwordHash) return null
  return { id: account.id, name: account.name, role: account.role }
}
