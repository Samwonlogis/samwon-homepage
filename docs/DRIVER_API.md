# 삼원종합물류 차주 전용 포털 — API 연동 명세 (v1, 2026-11-02)

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
{ "token": "eyJ...", "driver": { "name": "홍길동", "vehicleNo": "경기 12바 3456", "tonnage": "5톤 윙바디", "company": "삼원운수㈜", "manager": "김○○", "managerPhone": "02-598-3001" } }
```
실패: 401 `{ "ok": false, "message": "차량번호 또는 비밀번호를 확인해 주십시오." }`

### POST /auth/logout — 로그아웃 (토큰 무효화)  → `{ "ok": true }`
### POST /auth/password — 비밀번호 변경  요청 `{ "current": "...", "next": "..." }` → `{ "ok": true }`

### GET /statements — 조회 가능한 월 목록 (선택)
응답 `{ "months": ["2026-11", "2026-10", ...] }`

### GET /statements/{YYYY-MM} — 운송료내역서
```json
{
  "month": "2026-11", "vehicleNo": "경기 12바 3456",
  "summary": { "count": 17, "fareTotal": 5150000, "vat": 515000, "deductions": 1933400, "net": 3731600, "payDate": "2026-12-15", "status": "집계 중 | 지급 예정 | 지급 완료" },
  "trips": [
    { "id": "T20261101-01", "date": "2026-11-01", "from": "평택 ○○공장", "to": "이천 물류센터", "cargo": "전자부품", "fare": 280000, "extra": 30000, "note": "대기료 포함" }
  ]
}
```
- `extra`: 대기료·추가 운임 등 가산액(없으면 0). `net = fareTotal + vat - deductions`

### GET /deductions/{YYYY-MM} — 보험 · 할부 · 공과금
```json
{
  "month": "2026-11",
  "items": [
    { "category": "보험 | 할부 | 공과금 | 지입료", "title": "화물공제조합 적재물배상책임보험", "amount": 86000, "dueDate": "2026-11-10", "status": "납부 완료 | 납부 예정 | 미납 | 해당 없음", "note": "월 분납" }
  ],
  "totals": { "보험": 240000, "할부": 1230000, "공과금": 213400, "지입료": 250000 },
  "total": 1933400
}
```

### GET /board?category=&page=1&q= — 게시판 목록
- category: 빈값(전체) | 공지 | 차주구인 | 자료
```json
{ "items": [ { "id": 101, "category": "공지", "title": "11월 운송료 지급일 안내", "author": "관리팀", "date": "2026-11-01", "views": 312, "pinned": true } ], "page": 1, "pages": 3, "total": 52 }
```

### GET /board/{id} — 게시글
```json
{ "id": 101, "category": "공지", "title": "...", "author": "관리팀", "date": "2026-11-01", "views": 313, "pinned": true,
  "body": "줄바꿈은 \n 으로 (HTML 아님)", "attachments": [ { "name": "계약서 양식.hwp", "url": "https://.../file.hwp" } ] }
```

## 3. 연동 절차
1. 개발사가 위 명세로 API 구현 → 테스트 주소 전달
2. 홈페이지 관리자 모드에 테스트 주소 입력 → 포털 화면에서 실제 데이터 확인(예시 데이터 안내 띠가 사라짐)
3. 문제 없으면 운영 주소로 교체, DNS에 `driver-api.3won.kr` 등록(API 서버 IP)
4. 기존 ASP 차주정보 사이트는 전환 확인 후 1~2개월 뒤 종료

## 4. 기존 ASP 서버를 그대로 API로 쓰는 경우
기존 IIS 서버에 `.asp` 또는 `.aspx`로 위 JSON을 돌려주는 페이지를 추가하는 방법도 가능합니다
(예: `/api/v1/statements/2026-11` → 기존 DB 조회 결과를 JSON으로 출력). 이 경우 HTTPS 인증서와 CORS 헤더만 추가하면 됩니다.
