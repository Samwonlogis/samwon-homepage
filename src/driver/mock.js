// 차주 전용 포털 — 연동 전 예시 데이터(데모 모드). 실제 API 연동 시 사용되지 않습니다.
// 구조는 기존 차주정보 사이트(운송료내역서 · 보험/할부/공과금 · 게시판)와 동일하게 맞춤
const pad = (n) => String(n).padStart(2, '0')
export const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` }
export const prevMonth = (ym, k = 1) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 - k, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` }
const lastDay = (ym) => { const [y, m] = ym.split('-').map(Number); return `${ym}-${pad(new Date(y, m, 0).getDate())}` }

export const demoDriver = {
  name: '홍길동', vehicleNo: '경기 12바 3456', tonnage: '5톤 윙바디', company: '(주)○○백화점 ○○점',
  bizNo: '209-70-00000', bizName: '홍길동', address: '경기도 이천시 ○○로 00', bank: '농협', account: '302-0000-0000-00',
  taxType: 'manual', // electronic: 전자세금계산서 발행 대상 / manual: 수기세금계산서
  inspection: { regular: '2026.07.16 ~ 2026.09.11', check: '', emission: '2026.08.13 ~ 2026.10.13' },
}
const demoClient = { name: '(주)○○백화점 ○○점', manager: '○○○ 과장', phone: '02-0000-0000', bizName: '삼원운수㈜', bizNo: '000-00-00000', address: '경기도 이천시 율면 석산리 505' }

/* 운송료내역서 — 월별 목록 */
export function demoStatementList() {
  const out = []
  for (let k = 0; k < 24; k++) {
    const ym = prevMonth(thisMonth(), k)
    let seed = Number(ym.replace('-', '')); const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
    const fare = 4300000; const vat = fare * 0.1
    const ded = [322180, 579800, 392180, 335340, 777130, 688440, 658320, 905220][Math.floor(rnd() * 8)]
    out.push({ month: ym, payDate: lastDay(ym), paidAt: k > 0 ? `${prevMonth(ym, -1)}-15` : '', client: demoDriver.company, fare, vat, deductions: ded, net: fare + vat - ded })
  }
  return out
}

/* 운송료내역서 — 월 상세(운송비 내역서) */
export function demoStatement(ym) {
  const row = demoStatementList().find(r => r.month === ym) || demoStatementList()[0]
  const emp = 17230, acc = 18950; const fee = row.deductions - emp - acc
  return {
    month: row.month, payDate: row.payDate, paidAt: row.paidAt,
    client: demoClient,
    driver: { name: demoDriver.name, vehicleNo: demoDriver.vehicleNo, bizNo: demoDriver.bizNo, bizName: demoDriver.bizName, address: demoDriver.address, bank: demoDriver.bank, account: demoDriver.account, taxType: demoDriver.taxType },
    notice: '◆ 년1회 운수종사자는 직무 보수교육을 이수/교육 주관 "시도 교통연수원" ☞ 미 이수시 과징금(일반화물: 100만원/본인+회사 부담금, 운행정지 10일) ◆ 자부담금 대인, 대물 등 대물은 사고 접보 비용 1~2회 30만원/3회 50만원 변경 ◆ 적재중량 1,000kg 이상 디지털운행기록장치 부착 및 분기별 자료 제출 의무(과태료 100만원)',
    income: [{ title: '운송료', supply: row.fare, vat: row.vat }],
    deductions: [{ title: '고용보험', amount: emp }, { title: '산재보험', amount: acc }, { title: '수수료(지입료)', amount: fee }],
    expenses: [
      { category: '지입료', title: '위·수탁 관리비(수수료)', period: `${ym} 분`, amount: fee, note: '운송료에서 공제' },
      { category: '보험료', title: '고용보험 (운수종사자 본인 부담분)', period: `${ym} 분`, amount: emp, note: '' },
      { category: '보험료', title: '산재보험 (운수종사자 본인 부담분)', period: `${ym} 분`, amount: acc, note: '' },
      { category: '보험료', title: '종합보험(공제) 분납금', period: ym.endsWith('-03') || ym.endsWith('-05') || ym.endsWith('-07') || ym.endsWith('-09') ? ym : '', amount: 0, note: '해당 월 없음' },
    ].filter(x => x.amount > 0),
    taxInvoice: { type: demoDriver.taxType, issueTo: { name: demoClient.bizName, bizNo: demoClient.bizNo, address: demoClient.address }, supply: row.fare, vat: row.vat, total: row.fare + row.vat },
    totals: { supply: row.fare, vat: row.vat, income: row.fare + row.vat, deductions: row.deductions, net: row.net },
    noticeBox: '사업자등록번호, 계좌번호, 차량번호, 성명 확인. 세금계산서는 아래 「세금계산서 발행 대상」 사업자번호로 발행해 주십시오.',
    memo: ym === thisMonth() ? '11월 15일 이후 상차지 변경(○○물류센터) 안내드립니다. 확인 부탁드립니다. — 배차팀' : '',
    fines: ym.endsWith('-09') ? [{ date: `${ym}-14`, item: '속도위반(20km/h 이하)', amount: 40000, due: `${prevMonth(ym, -1)}-30`, note: '익월 운송료 공제' }] : [],
  }
}

/* 보험 / 할부 / 공과금 */
export function demoInsurance() {
  const sched = [0, 2, 4, 6, 8, 10].map((m, i) => { const d = new Date(2026, 2 + m, 27); return { no: i + 1, date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, amount: i === 0 ? 454950 : 257620, paid: d < new Date(), note: '' } })
  return {
    liability: { insurer: '경기화물공제조합', period: '2026-03-27 ~ 2027-03-27', coverages: ['대인Ⅰ(책임)', '대인Ⅱ', '대물 2억', '자기신체사고', '무보험차상해', '긴급출동'], mandatoryPremium: 340470, optionalPremium: 1402580, rate: '70 %', surcharge: '0 %', note: '' },
    schedule: sched.map(r => ({ ...r, deductedMonth: r.paid ? r.date.slice(0, 7) : '' })),
    accidentContacts: [{ label: '사고접수(공제조합 콜센터)', value: '1577-8278' }, { label: '화물공제조합 경기지부', value: '031-828-9911' }, { label: '화물공제조합 서울지부', value: '02-3433-8023' }],
    cargo: { insurer: '', period: '', annualTotal: null, annualLimit: null, perAccidentLimit: null, deductible: null, payDate: '' },
    installment: [],
    autoTax: { period: '2026-01-01 ~ 2026-12-31', amount: 13160 },
    envCharge: { period: '', amount: 0 },
    unionFee: { date: '2026-01-01', amount: 28200 },
    accidentGuide: '◆ 유의사항 (※ 당황하지 마시고 침착하게 대처하세요)\n가. 일방적으로 과실을 인정하거나 손해배상 약속을 하지 않습니다. (보험사 판단에 맡깁니다)\n나. 경찰 출동이나 자동차 견인 등을 함부로 하지 않습니다.\n다. 당사자끼리 처리하기로 한 사고의 경우도 사고 접수를 하여 추후 즉시 경찰에 신고합니다.\n라. 사고 관련 사항은 반드시 메모하여 두고, 가능하면 사진을 찍고 목격자의 인적사항을 확보해 둡니다.\n마. 피해자와 합의할 경우는 상대방이 누구인가를 명확히 파악하여 합니다.\n바. 합의서 작성은 나중에 꼭 생각해서 신중하게 합니다.\n\n◆ 처리요령\n가. 보행인 충격사고: 인근 병원에 구호조치(피해자 안심 및 구호조치) → 경찰관서 신고 → 보험회사 통보\n나. 차량 대 차량 사고: 사고장소 및 최종정차위치 표시(스프레이 등), 사진 촬영, 상대차량 차종·번호·소유자 확인, 운전자 인적사항·연락처·보험가입회사 파악, 부상자가 있는 경우 병원 후송 및 경찰 신고\n다. 차량 단독사고: 손괴 피해물의 종류·위치·파손 정도 확인, 100m 후방에 고장표지판 설치, 인근 정비공장에 견인 및 보험회사 통보',
  }
}

/* 게시판 */
export const demoPosts = [
  { id: 72, category: '공지', title: '나누리 노트 [일상 점검] 플랫폼 사용 안내', author: '삼원종합물류', date: '2026-10-13', views: 2, pinned: false, hasFile: true, body: '운수종사자 일상점검 기록을 위한 플랫폼 사용 방법을 안내드립니다. 첨부 파일을 확인하시고 매일 운행 전 점검 결과를 기록해 주시기 바랍니다.', attachments: [{ name: '나누리노트_사용안내.pdf', url: '#' }] },
  { id: 71, category: '공지', title: '화물복지재단 「2026년 디지털운행기록장치(DTG) 지원사업」 신청 기한 연장 안내', author: '삼원종합물류', date: '2026-09-28', views: 16, pinned: false, hasFile: true, body: '디지털운행기록장치 지원사업 신청 기한이 연장되었습니다. 대상 차주께서는 첨부 공문을 참고하여 기한 내 신청 바랍니다.', attachments: [{ name: 'DTG_지원사업_공문.pdf', url: '#' }] },
  { id: 70, category: '공지', title: '화물복지재단 「2026년 희망바퀴 장학사업」 선발계획 안내', author: '삼원종합물류', date: '2026-08-22', views: 11, pinned: false, hasFile: true, body: '화물운송 종사자 자녀 대상 장학사업 선발 계획을 안내드립니다.', attachments: [{ name: '희망바퀴_장학사업_안내.hwp', url: '#' }] },
  { id: 69, category: '공지', title: '2026년 상반기 미래로 장학금 신청 안내', author: '삼원종합물류', date: '2026-08-05', views: 11, pinned: false, hasFile: true, body: '상반기 장학금 신청 안내입니다.', attachments: [] },
  { id: 68, category: '공지', title: '운수종사자 일상점검표 일부개정형 시행 안내', author: '삼원종합물류', date: '2026-07-15', views: 13, pinned: false, hasFile: true, body: '일상점검표 서식이 일부 개정되어 시행됩니다.', attachments: [] },
  { id: 67, category: '공지', title: '2026년 디지털운행기록장치 지원사업 대상 차량 확대 안내', author: '삼원종합물류', date: '2026-07-13', views: 6, pinned: false, hasFile: true, body: '지원 대상 차량이 확대되었습니다.', attachments: [] },
  { id: 66, category: '공지', title: '2026년 운행기록장치 점검 센터', author: '삼원종합물류', date: '2026-06-19', views: 9, pinned: false, hasFile: false, body: '운행기록장치 점검 센터 목록입니다.', attachments: [] },
  { id: 65, category: '공지', title: '화물복지재단 2026년 장학사업 선발계획 안내', author: '삼원종합물류', date: '2026-05-18', views: 7, pinned: false, hasFile: true, body: '', attachments: [] },
  { id: 64, category: '공지', title: '운행기록장치 연장운영 센터 안내', author: '삼원종합물류', date: '2026-04-07', views: 7, pinned: false, hasFile: false, body: '', attachments: [] },
  { id: 63, category: '차주구인', title: '[이천→수도권] 5톤 윙바디 고정 노선 차주 모집 (2대)', author: '배차팀', date: '2026-03-30', views: 40, pinned: false, hasFile: false, body: '■ 노선: 이천 물류센터 → 서울·경기 유통점\n■ 차종: 5톤 윙바디\n■ 문의: 배차팀 02-598-3001', attachments: [] },
  { id: 62, category: '공지', title: '2025년 하반기 미래로 장학금 신청 안내', author: '삼원종합물류', date: '2025-12-24', views: 40, pinned: false, hasFile: true, body: '', attachments: [] },
  { id: 61, category: '자료', title: '2026년 위·수탁 계약서 양식 및 서류 제출 안내', author: '관리팀', date: '2025-11-20', views: 58, pinned: false, hasFile: true, body: '계약 갱신 대상 차주께서는 서류를 제출해 주시기 바랍니다.', attachments: [] },
]
