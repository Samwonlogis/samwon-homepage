export const NAV = [
  { label: '회사소개', to: '/company/intro', children: [
    { label: '회사소개', to: '/company/intro' },
    { label: '회사연혁', to: '/company/history' },
    { label: '주요현황', to: '/company/status' },
    { label: '찾아오시는 길', to: '/company/location' },
  ]},
  { label: '사업영역', to: '/business', children: [
    { label: '전체소개', to: '/business' },
    { label: '기업물류 (Middle Mile)', to: '/business/corporate' },
    { label: '유통물류 (Last Mile)', to: '/business/distribution' },
    { label: '주선 · 퀵서비스', to: '/business/brokerage' },
    { label: '창고운영 · 리스크관리', to: '/business/warehouse' },
    { label: '물류컨설팅', to: '/business/consulting' },
  ]},
  { label: '채용정보', to: '/recruitment/talent', children: [
    { label: '인재상', to: '/recruitment/talent' },
    { label: '차주구인', to: '/recruitment/jobs' },
  ]},
  { label: '고객센터', to: '/contact', children: [
    { label: '고객센터 & 제휴문의', to: '/contact' },
  ]},
]
