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
  "inspection": { "regular": "2026.07.16 ~ 2026.09.11", "check": "", "emission": "2026.08.13 ~ 2026.10.13" } } }
```
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
  "month": "2026-10", "payDate": "2026-10-31", "client": "(주)○○백화점 ○○점",
  "driver": { "name": "홍길동", "vehicleNo": "경기 12바 3456", "bizNo": "209-70-00000", "bank": "농협", "account": "302-0000-0000-00" },
  "notice": "◆ 년1회 운수종사자는 직무 보수교육 이수 ... (상단 빨간 안내문, 줄바꿈은 \n)",
  "income": [ { "title": "운송료", "amount": 4300000 } ],
  "deductions": [ { "title": "고용보험", "amount": 17230 }, { "title": "산재보험", "amount": 18950 }, { "title": "수수료(지입료)", "amount": 286000 } ],
  "fuel": { "fuel": 0, "vat": 0, "total": 0 },
  "insuranceDetail": { "insurer": "", "round": "", "period": "" },
  "taxInvoice": { "supply": 4300000, "vat": 430000, "total": 4730000 },
  "totals": { "income": 4730000, "deductions": 322180, "net": 4407820 },
  "noticeBox": "사업자등록번호, 계좌번호, 차량번호, 성명확인",
  "fines": [ { "date": "2026-10-02", "item": "과속", "amount": 40000, "due": "2026-11-15", "note": "" } ]
}
```
- `income`/`deductions`는 항목 수 제한 없음(화면은 8~9줄 틀에 맞춰 표시). `totals.income`=소득총계(공급가액+부가세), `totals.net`=실지급액
- `fines`: 과태내역(없으면 빈 배열)

### GET /insurance — 보험 / 할부 / 공과금
```json
{
  "liability": { "insurer": "경기화물공제조합", "period": "2026-03-27 ~ 2027-03-27", "mandatoryPremium": 340470, "optionalPremium": 1402580, "rate": "70 %", "surcharge": "0 %", "note": "" },
  "schedule": [ { "no": 1, "date": "2026-03-27", "amount": 454950, "paid": true, "note": "" } ],
  "cargo": { "insurer": "", "period": "", "annualTotal": null, "annualLimit": null, "perAccidentLimit": null, "deductible": null, "payDate": "" },
  "installment": [ { "no": 31, "date": "2026-11-25", "amount": 1230000, "paid": false, "note": "60회 중" } ],
  "autoTax": { "period": "2026-01-01 ~ 2026-12-31", "amount": 13160 },
  "envCharge": { "period": "", "amount": 0 },
  "unionFee": { "date": "2026-01-01", "amount": 28200 },
  "accidentGuide": "◆ 유의사항 ... (사고시 운전자 대처요령 전문, 줄바꿈은 \n)"
}
```
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
