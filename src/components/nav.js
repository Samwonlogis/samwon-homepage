export const NAV = [
  { label: '회사소개', to: '/company/intro', children: [
    { label: '회사개요 · CEO 인사말', to: '/company/intro' },
    { label: '연혁', to: '/company/history' },
    { label: '계열사 · 운송 규모', to: '/company/status' },
    { label: '오시는 길', to: '/company/location' },
  ]},
  { label: '사업영역', to: '/business', children: [
    { label: '사업영역 개요', to: '/business' },
    { label: '기업물류 (Middle Mile)', to: '/business/corporate' },
    { label: '유통물류 (Last Mile)', to: '/business/distribution' },
    { label: '주선 · 에스원퀵', to: '/business/brokerage' },
    { label: '창고운영 · 리스크관리', to: '/business/warehouse' },
    { label: '물류컨설팅', to: '/business/consulting' },
  ]},
  { label: '채용정보', to: '/recruitment/talent', children: [
    { label: '인재채용', to: '/recruitment/talent' },
    { label: '차주 모집', to: '/recruitment/jobs' },
  ]},
  { label: '고객센터', to: '/contact', children: [
    { label: '물류 상담 · 제휴 문의', to: '/contact' },
  ]},
]
