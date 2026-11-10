# 홈페이지 이미지·영상 출처 및 저작권 점검표 (2026-11-01 기준)

| 구분 | 파일 | 출처 | 이용 근거 |
|---|---|---|---|
| 메인 영상 | public/video/hero.mp4, poster.jpg | Google Gemini(Veo) 생성 영상 | Google 생성형 AI 약관상 생성물 소유권 미주장, 상업적 이용 가능 |
| 배너·사업영역·차종·현장 사진 | public/img/*.jpg, img/vehicles/*, img/fleet/* | Canva AI(Magic Media) 생성 이미지 | Canva 약관상 생성물 상업적 이용 가능, 실존 인물·상표 미포함 프롬프트로 생성 |
| 주요 취급 품목 | public/img/cargo/* | Unsplash 사진(작가·URL: img/cargo/CREDITS.txt) | Unsplash License — 상업적 이용·수정 무료, 출처 표기 의무 없음(Unsplash+ 미사용) |
| 회사 로고 | public/samwon_logo.svg, favicon.svg | 삼원종합물류 자사 CI | 자사 소유 |
| 인증 마크 | public/img/cert/* | 각 인증기관 마크(자사 보유 인증) | 인증 취득 기업의 인증 사실 표시 범위 내 사용 |
| 거래처 로고 | public/img/partners/* | 각 거래처 상표(기존 자사 홈페이지 게재분) | 저작권 대상 사진 아님 — 상표 사용은 거래 사실 표시 목적, 거래처 동의 확인 권장 |

- 외부 사이트에서 무단 수집한 사진은 사용하지 않음.
- 신규 이미지 추가 시 이 표에 출처를 기록할 것.

## 회사홍보영상 (public/video/promo.mp4, 2026-11-01)
- 영상 소스: 메인 영상(Gemini Veo 생성)과 홈페이지용 Canva AI 생성 사진으로만 구성
- 나레이션: Microsoft Azure 신경망 음성(ko-KR Hyunsu) 합성 — 실존 성우 음성 아님
- 배경음악: 수치 합성으로 직접 제작(Python) — 외부 음원 미사용
- 로고: 자사 CI(SAMWON_logo_EN.png)

## 2026-11-10 정리 (디자인 시스템 v7)
- 삭제: 인물 연출 사진 일체 — img/talent/*(4장), img/process/*(5장), banner_contact.jpg, banner_talent.jpg, banner_drivers.jpg, banner_careers.jpg, about.jpg, biz_consulting.jpg
  - 사유: 생성 이미지 특유의 인물 표현이 신뢰도를 떨어뜨려 해당 화면을 사진 없이 글자와 선 중심으로 다시 구성함
- 물류컨설팅 대표 사진: biz_consulting.jpg → hero_2.jpg(물류센터 항공 전경)로 교체
- 차주 전용 로그인·차주구인 배너: banner_drivers.jpg → hero_3.jpg(도크 앞 차량)로 교체
- 창고운영 대표 사진(biz_warehouse.jpg)은 교체 예정. 대체 이미지 2장(일반 랙 창고 전경, 물류 기획 회의 책상)을 Canva AI로 생성해 Canva 계정에 보관 중이며 적용 전
