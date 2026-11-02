// 차주 전용 포털 — 연동 전 예시 데이터(데모 모드). 실제 API 연동 시 사용되지 않습니다.
const pad = (n) => String(n).padStart(2, '0')
export const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` }
export const prevMonth = (ym, k = 1) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 - k, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` }

export const demoDriver = { name: '홍길동', vehicleNo: '경기 12바 3456', tonnage: '5톤 윙바디', company: '삼원운수㈜', manager: '배차 담당 김○○', managerPhone: '02-598-3001', joinedAt: '2021-03-02' }

const routes = [
  ['이천 물류센터', '서울 성동 ○○마트', '공산품 · 파렛트 12'], ['평택 ○○공장', '이천 물류센터', '전자부품'], ['이천 물류센터', '인천 ○○백화점', '유통 상품'],
  ['안성 ○○식품', '수원 ○○점', '신선식품(냉장)'], ['이천 물류센터', '대전 ○○센터', '공산품 · 파렛트 10'], ['여주 ○○제약', '이천 물류센터', '의약품(2~8℃)'],
  ['이천 물류센터', '천안 ○○점', '편의점 상품'], ['용인 ○○산업', '부산 신항', '수출 컨테이너 연계'],
]
export function demoStatement(ym) {
  const [y, m] = ym.split('-').map(Number); const days = new Date(y, m, 0).getDate()
  let seed = y * 100 + m; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  const trips = []
  for (let d = 1; d <= days; d++) {
    if (rnd() < 0.3) continue
    const r = routes[Math.floor(rnd() * routes.length)]
    const fare = 150000 + Math.floor(rnd() * 28) * 10000
    trips.push({ id: `${ym}-${pad(d)}`, date: `${ym}-${pad(d)}`, from: r[0], to: r[1], cargo: r[2], fare, extra: rnd() < 0.2 ? 30000 : 0, note: rnd() < 0.15 ? '대기료 포함' : '' })
  }
  const fareTotal = trips.reduce((s, t) => s + t.fare + t.extra, 0)
  const deductions = demoDeductions(ym).items.reduce((s, x) => s + x.amount, 0)
  const vat = Math.round(fareTotal * 0.1)
  return { month: ym, vehicleNo: demoDriver.vehicleNo, trips, summary: { count: trips.length, fareTotal, vat, deductions, net: fareTotal + vat - deductions, payDate: `${prevMonth(ym, -1)}-15`, status: ym === thisMonth() ? '집계 중' : '지급 완료' } }
}

export function demoDeductions(ym) {
  const items = [
    { category: '보험', title: '화물공제조합 적재물배상책임보험', amount: 86000, dueDate: `${ym}-10`, status: '납부 완료', note: '월 분납' },
    { category: '보험', title: '자동차 종합보험(연납 분할)', amount: 154000, dueDate: `${ym}-10`, status: '납부 완료', note: '12회 중 7회차' },
    { category: '할부', title: '차량 할부금 (○○캐피탈)', amount: 1230000, dueDate: `${ym}-25`, status: ym === thisMonth() ? '납부 예정' : '납부 완료', note: '60회 중 31회차 · 잔여 29회' },
    { category: '공과금', title: '자동차세 (분기분)', amount: Number(ym.split('-')[1]) % 6 === 0 ? 112500 : 0, dueDate: `${ym}-30`, status: '납부 완료', note: '6월 · 12월 부과' },
    { category: '공과금', title: '고속도로 통행료 (하이패스 후불)', amount: 213400, dueDate: `${ym}-20`, status: '납부 완료', note: '운송료에서 공제' },
    { category: '공과금', title: '과태료 · 범칙금', amount: 0, dueDate: '', status: '해당 없음', note: '' },
    { category: '지입료', title: '위·수탁 관리비', amount: 250000, dueDate: `${ym}-15`, status: '납부 완료', note: '운송료에서 공제' },
  ].filter(x => x.amount > 0 || x.category === '공과금')
  const byCat = {}
  items.forEach(x => { byCat[x.category] = (byCat[x.category] || 0) + x.amount })
  return { month: ym, items, totals: byCat, total: items.reduce((s, x) => s + x.amount, 0) }
}

export const demoPosts = [
  { id: 101, category: '공지', title: '11월 운송료 지급일 안내 (11/15 금)', author: '관리팀', date: '2026-11-01', views: 312, pinned: true, body: '11월 운송료는 11월 15일(금)에 지급될 예정입니다.\n\n세금계산서 발행 대상 차주께서는 11월 5일까지 발행을 완료해 주시기 바랍니다. 미발행 시 지급이 익월로 이월될 수 있습니다.\n\n문의: 관리팀 02-598-3001' },
  { id: 102, category: '차주구인', title: '[이천→수도권] 5톤 윙바디 고정 노선 차주 모집 (2대)', author: '배차팀', date: '2026-10-30', views: 540, pinned: true, body: '■ 노선: 이천 물류센터 → 서울·경기 유통점 (일 1~2회전)\n■ 차종: 5톤 윙바디 (연식 2018년 이후)\n■ 운송료: 월 정산, 유류비 별도 지원\n■ 근무: 주 6일, 새벽 상차\n■ 문의: 배차팀 02-598-3001' },
  { id: 103, category: '차주구인', title: '[평택↔이천] 11톤 카고 간선 차주 모집', author: '배차팀', date: '2026-10-28', views: 388, pinned: false, body: '■ 노선: 평택 공장 ↔ 이천 물류센터 (일 2회전)\n■ 차종: 11톤 카고\n■ 운송료: 회전당 정액 + 대기료\n■ 문의: 배차팀 02-598-3001' },
  { id: 104, category: '공지', title: '동절기 안전운행 수칙 및 월동장구 점검 안내', author: '안전관리팀', date: '2026-10-25', views: 201, pinned: false, body: '12월부터 2월까지 동절기 안전운행 기간입니다. 스노우체인·부동액·배터리 점검을 11월 중 완료해 주시기 바랍니다.' },
  { id: 105, category: '자료', title: '2026년 위·수탁 계약서 양식 및 서류 제출 안내', author: '관리팀', date: '2026-10-20', views: 176, pinned: false, body: '계약 갱신 대상 차주께서는 아래 서류를 11월 30일까지 제출해 주시기 바랍니다.\n\n1. 위·수탁 계약서(서명본)\n2. 자동차등록증 사본\n3. 보험가입증명서\n4. 통장 사본' },
  { id: 106, category: '차주구인', title: '[서울 강남권] 1톤 냉장탑차 신선배송 차주 모집', author: '배차팀', date: '2026-10-18', views: 455, pinned: false, body: '■ 지역: 서울 강남·서초·송파\n■ 차종: 1톤 냉장탑차\n■ 운송료: 건당 정산, 월 2회 지급\n■ 문의: 배차팀 02-598-3001' },
  { id: 107, category: '공지', title: '10월 운송료 지급 완료 안내', author: '관리팀', date: '2026-10-15', views: 298, pinned: false, body: '10월 운송료 지급이 완료되었습니다. 내역은 운송료내역서 메뉴에서 확인하실 수 있습니다.' },
]
