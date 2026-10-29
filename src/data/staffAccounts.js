/**
 * 직원 계정 (차주구인 공고 관리용)
 *
 * 계정은 관리자 모드(/admin) → 「직원 계정 관리」에서 생성⁠·삭제⁠·비밀번호 재설정합니다.
 * 아래 목록은 최초 기본값이며, 관리자 모드에서 저장⁠·전체 반영한 목록이 우선 적용됩니다.
 *
 * role: 'admin'(공고 관리 + 전체 반영) / 'staff'(공고 등록⁠·수정⁠·삭제)
 * 비밀번호는 원문이 아닌 해시(아이디 결합 SHA-256)로만 저장됩니다.
 */
export const DEFAULT_STAFF = [
  // 초기 비밀번호: samwon@3001 (관리자 모드에서 반드시 변경 권장)
  { id: 'admin', name: '관리자', role: 'admin', passwordHash: '7b0110d081cb6b7bcff7c2b48b59b77fb06fed60add4537821351e64e7bc3bb4' },
  // 예시 계정 — 실제 직원 계정 발급 후 관리자 모드에서 삭제하십시오. (초기 비밀번호 samwon1! / samwon2!)
  { id: 'staff01', name: '직원1 (예시)', role: 'staff', passwordHash: '1efc6dab4615db2338a0a6a53d96ae6eac464452450072cb4680272fdd20960c' },
  { id: 'staff02', name: '직원2 (예시)', role: 'staff', passwordHash: '1c65c343ae2c084749d25d4bc768a724afa722b6e828873449c00793cb52fdd8' },
]

/** 문자열을 SHA-256 해시(hex)로 변환 */
export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** 직원 비밀번호 해시 — 아이디를 결합해 계정마다 다른 값이 되도록 함 */
export const hashStaffPassword = (id, password) => sha256Hex(`samwon|${id.trim()}|${password}`)

/** 아이디/비밀번호 검증 — 성공 시 계정 정보(비밀번호 제외), 실패 시 null */
export async function verifyStaffLogin(id, password, accounts = DEFAULT_STAFF) {
  const account = (accounts || []).find((a) => a.id === id.trim() && a.active !== false)
  if (!account) return null
  const hash = await hashStaffPassword(account.id, password)
  const legacy = await sha256Hex(password)
  if (hash !== account.passwordHash && legacy !== account.passwordHash) return null
  return { id: account.id, name: account.name, role: account.role }
}
