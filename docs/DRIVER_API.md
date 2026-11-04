# 삼원종합물류 차주 전용 포털 — API 연동 명세 (v1.1, 2026-11-03 — 기존 차주정보 화면 구조 반영)

홈페이지(정적, GitHub Pages)의 `/driver` 차주 포털이 호출하는 REST API 명세입니다.
차주전용 프로그램(운송료·공제 데이터 보유 시스템) 쪽에서 아래 규격으로 HTTPS API를 제공하면,
관리자 모드 → 회사 정보 → **차주 포털 API 기본 주소**에 주소를 입력하는 것만으로 연동됩니다.
(비워 두면 예시 데이터로 동작)

## 1. 공통
- 기본 주소 예: `https://driver-api.3won.kr/v1` (반드시 HTTPS)
- 요청·응답: `application/json; charset=utf-8`
- 인증: 로그인 후 받은 토큰을 `Authorization: Bearer <token>` 헤더로 전달. 만료 시 **401** → 포털이 자동으로 로그인 화면으로 보냄
- CORS: 응답 헤더 `Access-Control-Allow-Origin: https://www.3won.kr` (전환 전에는 `https://samwonlogis.github.io`), `Access-Control-Allow-Headers: Authorization, Content-Type`, `Access-Control-Allow-Methods: GET, POST, OPTIONS` — OPTIONS 프리플라이트에 200 응답 필요
- 성공 응답: `{ "ok": true, "data": {...} }` 또는 data 객체 그대로. 실패: HTTP 4xx/5xx + `{ "ok": false, "message": "사용자에게 보여 줄 한글 메시지" }`
- 금액은 정수(원), 날짜는 `YYYY-MM-DD`, 월은 `YYYY-MM`
- 보안 권장: 로그인 5회 실패 시 10분 잠금, 토큰 유효기간 12시간(기억하기 30일), 차량번호·이름 외 개인정보(주민번호·계좌 전체)는 응답에 포함하지 않음, 접근 로그 보관

## 2. 엔드포인트

### POST /auth/login — 로그인
요청 `{ "vehicleNo": "경기12바3456", "password": "****" }` (차량번호는 공백 제거 상태로 전송)
응답
```json
{ "token": "eyJ...", "driver": { "name": "홍길동", "vehicleNo": "경기 12바 3456", "tonnage": "5톤 윙바디", "company": "(주)○○백화점 ○○점",
  "bizNo": "209-70-00000", "bank": "농협", "account": "302-0000-0000-00",
  "webAccess": true, "taxType": "manual", "manualInvoice": true,
  "inspection": { "regular": "2026.07.16 ~ 2026.09.11", "check": "", "emission": "2026.08.13 ~ 2026.10.13" } } }
```
- **`webAccess`**: ERP 개인정보 화면의 「웹 접속불가」 체크 → `false`. 포털은 로그인은 허용하되 **운송료내역서 메뉴 자체를 숨기고**(보험·할부·공과금, 게시판, 기사님 안내, 일상점검표만 표시) 내역서 주소로 직접 접근해도 차단합니다. 법인 계약 차량(예: 백산 등)에 사용
- **`taxType`**: `electronic`(전년도 매출 1억 이상 등 전자세금계산서 의무 발행자, 또는 본인이 전자 발행을 원하는 경우) | `manual`(수기세금계산서 대상). `electronic` 이면 수기세금계산서 출력 버튼이 나타나지 않음. 월 내역서의 `taxInvoice.type` 이 `electronic` 이어도 동일하게 숨김
- **`manualInvoice`**: ERP 개인정보 화면에 **「수기세금계산서 출력 허용」 체크박스를 신설**하여 그 값을 전달(기본 `true`). `false` 이면 수기 출력 버튼·화면을 막음. 분실 재출력 요청 등 상황에 따라 관리팀이 ERP에서 켜고 끌 수 있음
- 위 세 값은 로그인 응답에 포함되어 즉시 반영됩니다(재로그인 시 갱신)
- `inspection`: 좌측 「검사알림」 박스(정기검사 · 정기점검 · 배출가스 기간). 없으면 빈 문자열
- 실패: 401 `{ "ok": false, "message": "차량번호 또는 비밀번호를 확인해 주십시오." }`

### POST /auth/logout — 로그아웃 (토큰 무효화)  → `{ "ok": true }`
### POST /auth/password — 비밀번호 변경  요청 `{ "current": "...", "next": "..." }` → `{ "ok": true }`

### GET /statements?page=1&per=10 — 운송료내역서 월별 목록 (기존 사이트 첫 화면 표)
```json
{ "items": [
    { "month": "2026-10", "payDate": "2026-10-31", "client": "(주)○○백화점 ○○점", "fare": 4300000, "vat": 430000, "deductions": 322180, "net": 4407820 }
  ], "page": 1, "pages": 3, "total": 24 }
```
- 지급월 내림차순. `client`=근무업체, `fare`=운송료계, `deductions`=공제계, `net`=지급계

### GET /statements/{YYYY-MM} — 월 운송비 내역서(상세, 인쇄 양식)
```json
{
  "month": "2026-10", "payDate": "2026-10-31", "paidAt": "2026-11-15",
  "client": { "name": "(주)○○백화점 ○○점", "manager": "○○○ 과장", "phone": "02-0000-0000" },
  "driver": { "name": "홍길동", "vehicleNo": "경기 12바 3456", "bizNo": "209-70-00000", "bizName": "홍길동", "address": "경기도 이천시 ○○로 00", "bank": "농협", "account": "302-0000-0000-00", "taxType": "manual" },
  "notice": "◆ 상단 빨간 안내문 (줄바꿈은 \n)",
  "income": [ { "title": "운송료", "supply": 4300000, "vat": 430000 } ],
  "deductions": [ { "title": "고용보험", "amount": 17230 }, { "title": "산재보험", "amount": 18950 }, { "title": "수수료(지입료)", "amount": 299160 } ],
  "expenses": [ { "category": "지입료", "title": "위·수탁 관리비", "period": "2026-10 분", "amount": 299160, "note": "운송료에서 공제" }, { "category": "보험료", "title": "종합보험 분납 3회차", "period": "2026-07-27", "amount": 257620, "note": "" } ],
  "taxInvoice": { "type": "manual", "issueTo": { "name": "삼원운수㈜", "bizNo": "000-00-00000", "address": "경기도 이천시 ...", "ceo": "", "bizType": "운수업", "bizItem": "화물운송" }, "supply": 4300000, "vat": 430000, "total": 4730000 },
  "totals": { "supply": 4300000, "vat": 430000, "income": 4730000, "deductions": 335340, "net": 4394660 },
  "noticeBox": "전체 공지(모든 차주 공통)", "memo": "담당자 메모(해당 차주 개인, 없으면 빈 문자열)",
  "fines": [ { "date": "2026-10-02", "item": "과속", "amount": 40000, "due": "2026-11-15", "note": "" } ]
}
```
- `month`=운송료 작업 월(기준월). `payDate`=기존 시스템의 지급월 날짜(월말), `paidAt`=실제 지급일(미정이면 빈 문자열 → 화면에 "지급 예정")
- `client`: 근무업체와 거래처 담당자·전화(내역서 상단 표시)
- `income[]`: 항목별 **공급가액·부가세**를 각각 제공 (화면: 지급내역 표 항목|공급가액|부가세, 합계 행)
- `deductions[]`: 공제내역(급여성 공제). `expenses[]`: 하단 **지출내역 상세**(지입료·보험료·공과금·과태료 등, category로 구분)
- `taxInvoice.issueTo`: **세금계산서 발행 대상(공급받는 자) 법인·사업자번호** — 차주가 삼원종합물류 본사 번호로 잘못 발행하지 않도록 반드시 제공. `type`: electronic(전자 발행 대상) | manual(수기 — 포털에서 수기세금계산서 출력 가능)
- `noticeBox`=전체 공지, `memo`=담당자 개인 메모 — 둘 다 내역서 안에 표시
- `fines`: 과태내역(없으면 빈 배열)

### GET /statements/{YYYY-MM}/invoice — (선택) 수기세금계산서 발행 기록
포털은 `/statements/{YYYY-MM}` 응답만으로 수기세금계산서를 출력합니다. 발행 이력을 서버에 남기려면 `POST /statements/{YYYY-MM}/invoice` `{ "issueDate": "2026-11-04" }` 를 구현하고 포털에 연동 요청하십시오(현재 미호출).

### POST /checklist — 운행 전 일상점검 결과 저장 (연동 시 필수 권장)
포털은 「일상점검표」 메뉴에서 운수종사자 일상점검표(시행규칙 별지 제14호의5, 2026-06-30 시행) 11개 항목을 매일 표시하고, 기사가 「점검 완료」를 누르면 아래 JSON을 이 주소로 POST 합니다. 서버에 저장되어야 회사(관리팀)가 **누가 오늘 점검을 했는지 / 안 했는지, 불량 항목이 무엇인지** 확인할 수 있습니다. 연동 전(데모)에는 기기 내에만 보관되어 회사에서 볼 수 없습니다. 관리 화면(미점검자 목록, 불량 항목 조회)은 반석/호스팅 측 ERP 화면에서 제공하거나, 추후 포털 직원 화면으로 추가할 수 있습니다.
`{ "date": "2026-11-04", "vehicleNo": "경기12바3456", "results": ["o","o","x", ...11개 순서대로], "at": "2026-11-04T06:12:00+09:00" }` → 응답 `{ "ok": true }`

### 거래처 담당자
`/statements/{YYYY-MM}` 의 `client.manager`·`client.phone` 이 있으면 그대로 표시합니다. 없으면 포털이 관리자 모드 「차주 포털 거래처 담당자」 설정(근무업체명 키워드 매칭)으로 담당자를 찾고, 매칭되지 않으면 기본 담당자(석은영 과장 02-6204-1097)를 표시합니다.

### GET /insurance — 보험 / 할부 / 공과금
```json
{
  "payTo": { "bank": "농협", "account": "301-0000-0000-00", "holder": "삼원종합물류㈜" },
  "contact": { "name": "관리팀", "phone": "02-598-3001" },
  "overdue": [ { "title": "종합보험 4회차", "date": "2026-09-27", "amount": 257620 } ],
  "accidentContacts": [ { "label": "사고접수(공제조합 콜센터)", "value": "1577-8278" }, { "label": "화물공제조합 경기지부", "value": "031-828-9911" }, { "label": "화물공제조합 서울지부", "value": "02-3433-8023" } ],
  "liability": { "insurer": "경기화물공제조합", "period": "2026-03-27 ~ 2027-03-27", "coverages": ["대인Ⅰ(책임)", "대인Ⅱ", "대물 2억", "자기신체사고", "긴급출동"], "mandatoryPremium": 340470, "optionalPremium": 1402580, "rate": "70 %", "surcharge": "0 %", "note": "" },
  "schedule": [ { "no": 1, "date": "2026-03-27", "amount": 454950, "paid": true, "deductedMonth": "2026-03", "note": "" } ],
  "cargo": { "insurer": "", "period": "", "annualTotal": null, "annualLimit": null, "perAccidentLimit": null, "deductible": null, "payDate": "" },
  "installment": [ { "no": 31, "date": "2026-11-25", "amount": 1230000, "paid": false, "note": "60회 중" } ],
  "autoTax": { "period": "2026-01-01 ~ 2026-12-31", "amount": 13160 },
  "envCharge": { "period": "", "amount": 0 },
  "unionFee": { "date": "2026-01-01", "amount": 28200 },
  "accidentGuide": "◆ 유의사항 ... (사고시 운전자 대처요령 전문, 줄바꿈은 \n)"
}
```
- `overdue[]`: **미납 내역**(선택). 있으면 포털 진입 시 「입금 요청」 팝업이 뜹니다. 서버가 주지 않으면 포털이 `schedule`·`installment` 중 `paid:false` 이면서 날짜가 지난 항목을 미납으로 간주합니다. `payTo`=입금 계좌, `contact`=문의처(팝업에 표시)
- `accidentContacts`: 상단 사고접수 번호 띠. `liability.coverages`: 가입 담보 목록(칩으로 표시). `schedule[].deductedMonth`: 어느 달 운송료에서 공제했는지(비고에 "26년 3월 운송료에서 공제"로 표시)
- `liability`=1.종합보험, `schedule`=종합보험 납부일정(`paid` true면 ★ 표시), `cargo`=2.적재물보험, `installment`=3.차량 할부, `autoTax`/`envCharge`=4.차량공과금·환경개선부담금, `unionFee`=5.화물조합비

### GET /board?category=&page=1&per=10&q= — 게시판 목록
- category: 빈값(전체) | 공지 | 차주구인 | 자료
```json
{ "items": [ { "id": 72, "category": "공지", "title": "나누리 노트 [일상 점검] 플랫폼 사용 안내", "author": "삼원종합물류", "date": "2026-10-13", "views": 2, "pinned": false, "hasFile": true } ], "page": 1, "pages": 8, "total": 72 }
```
- `hasFile`: 첨부 아이콘 표시 여부. `id`는 목록 번호로도 표시

### GET /board/{id} — 게시글 (조회수 +1)
```json
{ "id": 72, "category": "공지", "title": "...", "author": "삼원종합물류", "date": "2026-10-13", "views": 3, "pinned": false,
  "body": "줄바꿈은 \n 으로 (HTML 아님)", "attachments": [ { "name": "안내문.pdf", "url": "https://.../file.pdf" } ] }
```

## 3. 연동 절차
1. 개발사가 위 명세로 API 구현 → 테스트 주소 전달
2. 홈페이지 관리자 모드에 테스트 주소 입력 → 포털 화면에서 실제 데이터 확인(예시 데이터 안내 띠가 사라짐)
3. 문제 없으면 운영 주소로 교체, DNS에 `driver-api.3won.kr` 등록(API 서버 IP)
4. 기존 ASP 차주정보 사이트는 전환 확인 후 1~2개월 뒤 종료

## 4. 기존 ASP 서버를 그대로 API로 쓰는 경우
기존 IIS 서버에 `.asp` 또는 `.aspx`로 위 JSON을 돌려주는 페이지를 추가하는 방법도 가능합니다
(예: `/api/v1/statements/2026-11` → 기존 DB 조회 결과를 JSON으로 출력). 이 경우 HTTPS 인증서와 CORS 헤더만 추가하면 됩니다.
