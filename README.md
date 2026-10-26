# 삼원종합물류㈜ 홈페이지 (2026 전면 리뉴얼)

React 18 + Vite 기반 반응형 기업 홈페이지. 로고 블루(#054592)·네이비(#262B69)를 기본 무드로 한 밝은 화이트 톤 디자인이며, 관리자 모드에서 모든 문구·이미지를 수정할 수 있습니다.

## 1. 실행
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # dist/ 생성 (GitHub Pages 배포용)
npm run build:preview   # dist-preview/index.html 단일 파일 미리보기
```

## 2. GitHub Pages 배포
1. 이 폴더 전체를 `Samwonlogis/samwon-homepage` 저장소 `main` 브랜치에 푸시합니다 (기존 파일은 모두 교체).
2. 저장소 **Settings → Pages → Source**가 **GitHub Actions**인지 확인합니다.
3. 이후 `main`에 푸시할 때마다 `.github/workflows/deploy.yml`이 자동 빌드·배포합니다.
4. 주소: `https://samwonlogis.github.io/samwon-homepage/`

> 저장소 이름을 바꾸거나 사용자 도메인(3won.kr)을 연결할 때는 `vite.config.js`의 `REPO_NAME`을 수정합니다. 사용자 도메인 루트에 올릴 경우 `base: '/'`로 바꾸고 `public/CNAME` 파일에 도메인을 적습니다.

## 3. 관리자 모드 (/admin)
- 푸터 우측 하단 "관리자" 또는 주소창에 `/admin` 입력
- **초기 비밀번호: `samwon@3001`** (배포 후 반드시 변경)
- 왼쪽 메뉴에서 섹션을 고르면 모든 문구·숫자·목록·이미지를 폼으로 수정할 수 있습니다.
  - 목록 항목 추가/삭제/순서 이동, 이미지 파일 업로드(자동 1600px 축소), 외부 URL 입력 지원
  - 「이 섹션 기본값으로」로 섹션 단위 복원

### 반영 방식 (중요)
| 버튼 | 반영 범위 |
|---|---|
| 저장 | 지금 사용 중인 브라우저에서만 즉시 반영 (검토용) |
| 전체 반영용 JSON 다운로드 | `content.json` 파일 생성 → GitHub 저장소 `public/content.json`에 업로드(덮어쓰기)하면 **모든 방문자에게 반영** (자동 배포 1~2분) |
| JSON 불러오기 | 다른 PC에서 만든 content.json을 가져와 이어서 편집 |

GitHub 웹에서 올리는 방법: 저장소 → `public` 폴더 → `content.json` 클릭 → 연필(Edit) 아이콘 → 내용 전체 교체 → Commit changes. 또는 `public` 폴더에서 **Add file → Upload files**로 덮어쓰기.

### 비밀번호 변경
관리자 화면 하단 **고급 설정 → 새 비밀번호** 입력 → 생성된 해시값을 `src/data/adminConfig.js`의 `passwordHash`에 붙여넣고 커밋.

## 4. 파일 구조
```
public/
  video/hero.mp4      # 메인 배경 영상 (관리자 > 메인 히어로에서 경로 변경·비우기 가능)
  content.json        # 관리자 수정본(전체 반영용). 비어 있으면 기본값 사용
  img/                # 사이트 이미지 (hero_*.jpg, biz_*.jpg, about.jpg, cta.jpg)
  samwon_logo.svg     # 로고
src/
  data/defaultContent.js   # 모든 기본 문구·수치 (코드로 수정할 때)
  data/partners.js         # 거래처 로고 목록 (로고 파일: src/assets/partners/)
  data/adminConfig.js      # 관리자 비밀번호 해시
  styles.css               # 디자인 토큰(:root)·전체 스타일
  components/              # Header, Footer, KoreaMap(전국 네트워크 지도), Icons(자체 제작) 등
  pages/                   # Home, company/, business/, recruitment/, Contact, Admin, Legal
```

## 5. 이미지·저작권
- 사진은 모두 Canva AI로 새로 생성한 이미지이며, 메인 배경 영상(public/video/hero.mp4)은 이 이미지들로 제작한 시네마틱 모션입니다. 외부 스톡·타사 저작물은 사용하지 않았습니다.
- 아이콘·지도·인증 배지는 자체 제작 SVG입니다. ISO 공식 로고는 인증기관 마크를 받으시면 교체 가능합니다.
- 글꼴: Pretendard(SIL Open Font License, 상업 이용 가능) CDN 로딩.
- 거래처 로고의 권리는 각 사에 귀속되며, 변경·추가는 `src/data/partners.js`에서 합니다.

## 6. 사진 교체 권장 목록
관리자 모드에서 교체하면 바로 반영됩니다.
- 메인 히어로 3장 (실제 삼원 차량·차고지 사진 권장)
- CEO 인사말 대표이사 사진 (세로형)
- 사업영역 5장, 회사개요 1장, 상담 배너 1장
