import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { defaultContent } from '../data/defaultContent'
import { adminConfig } from '../data/adminConfig'
import { asset, imageToDataUrl, downloadJson, deepMerge } from '../utils/storage'

// ─── 섹션 구성 (왼쪽 메뉴) ───────────────────────────────
const SECTIONS = [
  { key: 'company', label: '회사 기본정보', hint: '회사명·연락처·주소 등 사이트 전체 공통 정보' },
  { key: 'hero', label: '메인 히어로', hint: '메인 상단 문구·버튼·배경 영상(비우면 이미지 슬라이드로 전환)' },
  { key: 'stats', label: '메인 핵심 수치', hint: '숫자 카운트 4종' },
  { key: 'why', label: 'Why 삼원', hint: '선택 이유 4가지' },
  { key: 'businessAreas', label: '사업영역 타일', hint: '메인·사업영역 개요의 5개 타일 (이미지 포함)' },
  { key: 'businessPages', label: '사업영역 상세', hint: '기업물류·유통물류·주선·창고·컨설팅 상세 페이지' },
  { key: 'network', label: '전국 네트워크', hint: '지도 거점 — city에 도시명을 적으면 실제 지도 위치에 표시' },
  { key: 'certifications', label: '인증 현황', hint: '인증 5종 — 로고 이미지를 업로드하면 배지 대신 로고가 표시됩니다 (이름은 줄바꿈 없이 짧게)' },
  { key: 'partnersSection', label: '거래처 섹션 문구', hint: '거래처 로고는 src/data/partners.js에서 관리' },
  { key: 'caseStudies', label: '운영 사례', hint: '산업별 사례 4종' },
  { key: 'portals', label: '차주 전용 · 에스원퀵 박스', hint: '메인 하단 바로가기 박스 문구 (링크는 회사 기본정보에서)' },
  { key: 'cta', label: '상담 유도 배너', hint: '메인 하단 CTA' },
  { key: 'intro', label: '회사개요', hint: '회사소개 본문·비전·미션·핵심가치·대표 이미지' },
  { key: 'ceo', label: 'CEO 인사말', hint: '대표이사 사진·헤드라인·본문' },
  { key: 'history', label: '연혁', hint: '연도별 주요 사건' },
  { key: 'subsidiaries', label: '계열사', hint: '6개 법인' },
  { key: 'fleet', label: '운송 규모', hint: '차종별 운영 설명' },
  { key: 'offices', label: '사업장', hint: '오시는 길 하단 사업장 목록' },
  { key: 'directions', label: '교통 안내', hint: '지하철·버스·주차·지도 검색어' },
  { key: 'principles', label: '운영 원칙', hint: '사업영역 개요 하단 4대 원칙' },
  { key: 'recruitment', label: '채용·차주 모집', hint: '인재상·채용공고·차주 모집 공고' },
  { key: 'contactPage', label: '고객센터', hint: '상담 절차·FAQ' },
  { key: 'footer', label: '푸터', hint: '하단 소개 문구·저작권' },
]

const IMG_KEYS = /^(image|images|photo|logo|bannerImage|poster)$/
const LONG_KEYS = /^(desc|overview|subtitle|lead|message|headline|slogan|a|result|hint|description|paragraphs|points|events)$/
const LABELS = {
  name: '이름', nameEn: '영문명', title: '제목', subtitle: '부제', desc: '설명', eyebrow: '상단 라벨', lead: '리드 문장', image: '이미지', images: '이미지 목록', photo: '사진',
  slogan: '슬로건', overview: '개요', strengths: '핵심 역량', process: '프로세스', quote: '인용문', label: '라벨', en: '영문 라벨', short: '요약', items: '항목', points: '포인트',
  value: '숫자', suffix: '단위', sub: '보조 설명', num: '번호', phone: '전화', fax: '팩스', email: '이메일', quickPhone: '에스원퀵 번호', address: '주소', bizNumber: '사업자등록번호', ceo: '대표이사', founded: '설립일', revenue: '매출', creditRating: '신용등급', website: '웹사이트', driverUrl: '차주 전용 링크(/driver 또는 외부 https:// 주소)', driverApi: '차주 로그인 API 주소(연동 시 입력)', driverLabel: '차주 전용 버튼 문구', s1quickUrl: '에스원퀵 링크(URL)', s1quickLabel: '에스원퀵 버튼 문구', city: '지도 도시(서울·이천·인천·연천·대전·부산·대구·광주·전주·원주·강릉·제주·울산·천안·청주·여주)', driver: '차주 전용 박스', s1quick: '에스원퀵 박스',
  primaryCta: '주 버튼', video: '배경 영상(mp4 경로)', videoWebm: '배경 영상(webm 경로)', poster: '영상 로딩 전 이미지', secondaryCta: '보조 버튼', button: '버튼', year: '연도', events: '주요 사건', role: '역할', location: '소재지', range: '규모', type: '구분', groups: '차종 그룹', main: '대표 여부', region: '권역', x: 'X(%)', y: 'Y(%)', hubs: '거점', code: '코드', org: '기관',
  client: '고객', service: '서비스', result: '성과', vision: '비전', mission: '미션', values: '핵심 가치', paragraphs: '본문 문단', headline: '헤드라인', subway: '지하철', bus: '버스', parking: '주차', mapQuery: '지도 검색어', note: '하단 주석',
  openings: '채용 공고', benefits: '복리후생', step: '단계', coreValues: '핵심 역량 4종', kakao: '카카오톡 관제 안내 박스', income: '급여/수입', contactPerson: '담당자', contactPhone: '담당자 연락처', total: '총 운용 대수', totalDesc: '총계 설명', dept: '부서', deadline: '마감', driverIntro: '차주 소개 문구', driverJobs: '차주 공고', vehicle: '차량', area: '구간', hours: '시간', driverRequirements: '지원 자격', driverBenefits: '파트너 지원', processSteps: '상담 절차', faqs: 'FAQ', q: '질문', a: '답변', description: '소개 문구', copyright: '저작권 표기',
  corporate: '기업물류', distribution: '유통물류', brokerage: '주선 · 에스원퀵', warehouse: '창고운영', consulting: '물류컨설팅',
}
const L = (k) => LABELS[k] || k

async function sha256(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('') }
const setPath = (obj, path, val) => { const n = structuredClone(obj); let o = n; for (let i = 0; i < path.length - 1; i++) o = o[path[i]]; o[path[path.length - 1]] = val; return n }
const getPath = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj)

// ─── 이미지 필드 ───
function ImageField({ value, onChange }) {
  const ref = useRef()
  const pick = async (e) => { const f = e.target.files?.[0]; if (!f) return; try { onChange(await imageToDataUrl(f)) } catch { alert('이미지를 읽을 수 없습니다.') } e.target.value = '' }
  return (
    <div className="ed__img">
      {value ? <img src={asset(value)} alt="" /> : <div className="ph">이미지 없음</div>}
      <div className="ed__img-ctl">
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="ed__mini" onClick={() => ref.current.click()}>파일 업로드</button>
          {value && <button type="button" className="ed__mini ed__mini--danger" onClick={() => onChange('')}>비우기</button>}
        </div>
        <input type="text" value={value?.startsWith('data:') ? '(업로드된 이미지)' : value || ''} onChange={e => onChange(e.target.value)} placeholder="img/파일명.jpg 또는 https://… 주소" disabled={value?.startsWith('data:')} />
        <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
      </div>
    </div>
  )
}

// ─── 범용 재귀 편집기 ───
function Field({ k, value, path, onChange, depth = 0 }) {
  const isImg = IMG_KEYS.test(k) || (typeof value === 'string' && /^(data:image|img\/)/.test(value))
  if (Array.isArray(value)) {
    const isImgList = k === 'images'
    const addItem = () => { const tpl = value.length ? structuredClone(value[value.length - 1]) : (isImgList ? '' : '') ; onChange(path, [...value, typeof tpl === 'object' ? blank(tpl) : '']) }
    return (
      <details className="ed__group" open={depth < 1}>
        <summary>{L(k)} <span className="muted" style={{ fontWeight: 500, fontSize: 12 }}>{value.length}개</span></summary>
        <div className="ed">
          {value.map((v, i) => (
            <div className="ed__item" key={i}>
              <div className="ed__item-head"><span>{L(k)} {i + 1}</span>
                <div>
                  <button type="button" className="ed__mini" disabled={i === 0} onClick={() => { const a = [...value]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onChange(path, a) }}>▲</button>
                  <button type="button" className="ed__mini" disabled={i === value.length - 1} onClick={() => { const a = [...value]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; onChange(path, a) }}>▼</button>
                  <button type="button" className="ed__mini ed__mini--danger" onClick={() => { if (confirm('이 항목을 삭제하시겠습니까?')) onChange(path, value.filter((_, j) => j !== i)) }}>삭제</button>
                </div>
              </div>
              {typeof v === 'object' && v !== null
                ? Object.keys(v).map(ck => <Field key={ck} k={ck} value={v[ck]} path={[...path, i, ck]} onChange={onChange} depth={depth + 1} />)
                : isImgList ? <ImageField value={v} onChange={nv => onChange([...path, i], nv)} />
                : <Text k={k} value={v} onChange={nv => onChange([...path, i], nv)} />}
            </div>
          ))}
          <button type="button" className="ed__mini" onClick={addItem} style={{ justifySelf: 'start' }}>+ 항목 추가</button>
        </div>
      </details>
    )
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <details className="ed__group" open={depth < 1}>
        <summary>{L(k)}</summary>
        <div className="ed">{Object.keys(value).map(ck => <Field key={ck} k={ck} value={value[ck]} path={[...path, ck]} onChange={onChange} depth={depth + 1} />)}</div>
      </details>
    )
  }
  if (typeof value === 'boolean') return <label className="ed__field" style={{ gridTemplateColumns: 'auto 1fr', alignItems: 'center', display: 'flex', gap: 8 }}><input type="checkbox" checked={value} onChange={e => onChange(path, e.target.checked)} /><span>{L(k)}</span></label>
  if (typeof value === 'number') return <label className="ed__field"><span>{L(k)}</span><input type="number" value={value} onChange={e => onChange(path, Number(e.target.value))} /></label>
  if (isImg) return <div className="ed__field"><span>{L(k)}</span><ImageField value={value} onChange={nv => onChange(path, nv)} /></div>
  return <label className="ed__field"><span>{L(k)}</span><Text k={k} value={value} onChange={nv => onChange(path, nv)} /></label>
}
function Text({ k, value, onChange }) {
  const long = LONG_KEYS.test(k) || (value || '').length > 60 || (value || '').includes('\n')
  return long ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} /> : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
}
function blank(tpl) { if (Array.isArray(tpl)) return []; if (typeof tpl === 'object' && tpl !== null) { const o = {}; for (const k of Object.keys(tpl)) o[k] = blank(tpl[k]); return o } if (typeof tpl === 'number') return 0; if (typeof tpl === 'boolean') return false; return '' }

// ─── 관리자 화면 ───
export default function Admin() {
  const { content, updateContent, resetLocal, hasLocal } = useContent()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(adminConfig.sessionKey) === '1')
  const [pw, setPw] = useState(''); const [err, setErr] = useState('')
  const [draft, setDraft] = useState(content)
  const [dirty, setDirty] = useState(false)
  const [sec, setSec] = useState(SECTIONS[0].key)
  const [toast, setToast] = useState('')
  const [hashIn, setHashIn] = useState(''); const [hashOut, setHashOut] = useState('')
  const fileRef = useRef()

  useEffect(() => { document.title = '관리자 | 삼원종합물류㈜' }, [])
  useEffect(() => { if (!dirty) setDraft(content) }, [content, dirty])
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const login = async (e) => { e.preventDefault(); if (await sha256(pw) === adminConfig.passwordHash) { sessionStorage.setItem(adminConfig.sessionKey, '1'); setAuthed(true) } else setErr('비밀번호가 올바르지 않습니다.') }
  const logout = () => { sessionStorage.removeItem(adminConfig.sessionKey); setAuthed(false) }
  const change = (path, val) => { setDraft(d => setPath(d, path, val)); setDirty(true) }
  const save = () => { updateContent(draft); setDirty(false); say('이 브라우저에 저장되었습니다') }
  const exportJson = () => { downloadJson(dirty ? draft : content, 'content.json'); say('content.json 다운로드') }
  const importJson = async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const j = JSON.parse(await f.text()); const merged = deepMerge(defaultContent, j); setDraft(merged); setDirty(true); say('불러오기 완료 — 저장을 눌러 반영하십시오') } catch { alert('JSON 파일을 읽을 수 없습니다.') } e.target.value = '' }
  const resetSection = () => { if (!confirm(`'${SECTIONS.find(s => s.key === sec)?.label}' 섹션을 기본값으로 되돌리시겠습니까?`)) return; change([sec], structuredClone(defaultContent[sec])) }
  const resetAll = () => { if (!confirm('이 브라우저에 저장된 모든 수정 내용을 삭제하고 기본값(또는 content.json)으로 되돌리시겠습니까?')) return; resetLocal(); setDirty(false); say('초기화되었습니다') }
  useEffect(() => { if (!hashIn) { setHashOut(''); return } sha256(hashIn).then(setHashOut) }, [hashIn])

  const cur = useMemo(() => SECTIONS.find(s => s.key === sec), [sec])

  if (!authed) return (
    <div className="admin"><div className="container">
      <form className="admin__login" onSubmit={login}>
        <h1 className="h-sub">관리자 로그인</h1>
        <p className="small">홈페이지 콘텐츠(문구·이미지)를 수정하는 화면입니다.</p>
        <input type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
        {err && <p className="small" style={{ color: '#c0392b' }}>{err}</p>}
        <button className="btn btn--primary" type="submit">로그인</button>
        <Link to="/" className="small" style={{ textAlign: 'center' }}>← 홈페이지로</Link>
      </form>
    </div></div>
  )

  return (
    <div className="admin">
      <div className="admin__bar"><div className="container">
        <span className="grow">콘텐츠 관리 <span className="admin__status">{dirty ? '· 저장되지 않은 변경 있음' : hasLocal ? '· 이 브라우저에 저장된 수정본 적용 중' : '· 기본값(또는 content.json) 표시 중'}</span></span>
        <button className="btn btn--primary btn--sm" onClick={save} disabled={!dirty}>저장</button>
        <button className="btn btn--ghost btn--sm" onClick={exportJson}>전체 반영용 JSON 다운로드</button>
        <button className="btn btn--ghost btn--sm" onClick={() => fileRef.current.click()}>JSON 불러오기</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
        <Link className="btn btn--ghost btn--sm" to="/" target="_blank">사이트 보기</Link>
        <button className="btn btn--ghost btn--sm" onClick={logout}>로그아웃</button>
      </div></div>

      <div className="container admin__layout">
        <aside className="admin__side">
          {SECTIONS.map(s => <button key={s.key} className={s.key === sec ? 'active' : ''} onClick={() => setSec(s.key)}>{s.label}</button>)}
        </aside>
        <div className="admin__main">
          <div className="notice" style={{ marginBottom: 20 }}>
            <b>반영 방식 안내</b> — 「저장」은 지금 사용 중인 브라우저에서만 즉시 반영됩니다. 모든 방문자에게 반영하려면 「전체 반영용 JSON 다운로드」로 받은 <b>content.json</b>을 GitHub 저장소의 <b>public/content.json</b>에 업로드(덮어쓰기)하십시오. 자동 배포 후 1~2분 내 전체 적용됩니다. 업로드 이미지는 JSON에 함께 저장되므로 용량이 큰 사진은 1600px 이하로 자동 축소됩니다.
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div><h2 className="h-sub">{cur.label}</h2><p className="small">{cur.hint}</p></div>
            <button className="ed__mini" onClick={resetSection}>이 섹션 기본값으로</button>
          </div>
          <div className="ed">
            {Array.isArray(draft[sec]) || typeof draft[sec] === 'object'
              ? (Array.isArray(draft[sec])
                  ? <Field k={sec} value={draft[sec]} path={[sec]} onChange={change} depth={0} />
                  : Object.keys(draft[sec]).map(k => <Field key={k} k={k} value={draft[sec][k]} path={[sec, k]} onChange={change} depth={0} />))
              : null}
          </div>

          <details className="ed__group" style={{ marginTop: 40 }}>
            <summary>고급 설정</summary>
            <div className="ed">
              <div className="notice">
                <b>비밀번호 변경</b> — 새 비밀번호를 입력하면 해시값이 생성됩니다. 이 값을 <b>src/data/adminConfig.js</b>의 passwordHash에 붙여넣고 GitHub에 커밋하십시오.
              </div>
              <label className="ed__field"><span>새 비밀번호</span><input type="text" value={hashIn} onChange={e => setHashIn(e.target.value)} placeholder="새 비밀번호 입력" /></label>
              {hashOut && <label className="ed__field"><span>해시값 (복사)</span><input type="text" readOnly value={hashOut} onFocus={e => e.target.select()} /></label>}
              <button className="ed__mini ed__mini--danger" onClick={resetAll} style={{ justifySelf: 'start' }}>이 브라우저의 모든 수정 내용 초기화</button>
            </div>
          </details>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
