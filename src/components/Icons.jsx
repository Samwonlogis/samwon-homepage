// 자체 제작 라인 아이콘 (24px 그리드, stroke 기반) — 외부 아이콘 라이브러리 미사용
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }
const I = ({ children, ...p }) => <svg {...S} aria-hidden="true" {...p}>{children}</svg>
export const ArrowRight = (p) => <I {...p}><path d="M5 12h14M13 6l6 6-6 6"/></I>
export const ArrowDown = (p) => <I {...p}><path d="M12 5v14M6 13l6 6 6-6"/></I>
export const Check = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></I>
export const Phone = (p) => <I {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></I>
export const Mail = (p) => <I {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></I>
export const Pin = (p) => <I {...p}><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></I>
export const Fax = (p) => <I {...p}><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 8V4h8v4M8 14h2M14 14h2M8 17h8"/></I>
export const Truck = (p) => <I {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></I>
export const Box = (p) => <I {...p}><path d="M3 8l9-4 9 4-9 4-9-4zM3 8v8l9 4 9-4V8M12 12v8"/></I>
export const Snow = (p) => <I {...p}><path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/></I>
export const Shield = (p) => <I {...p}><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></I>
export const Chart = (p) => <I {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></I>
export const Users = (p) => <I {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 11a3 3 0 100-6M21.5 20a6.5 6.5 0 00-5-6.3"/></I>
export const Clock = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></I>
export const Leaf = (p) => <I {...p}><path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16z"/><path d="M4 20c4-5 8-8 12-10"/></I>
export const Target = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></I>
export const Handshake = (p) => <I {...p}><path d="M3 10l4-4 5 2 5-2 4 4-4 8H7L3 10z"/><path d="M12 8l-3 4 2 2 3-3"/></I>
export const Spark = (p) => <I {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/></I>
export const Star = (p) => <I {...p}><path d="M12 3l2.8 6 6.2.7-4.6 4.3 1.3 6.3L12 17l-5.7 3.3 1.3-6.3L3 9.7 9.2 9z"/></I>
export const Menu = (p) => <I {...p}><path d="M4 7h16M4 12h16M4 17h16"/></I>
export const X = (p) => <I {...p}><path d="M6 6l12 12M18 6L6 18"/></I>
export const Globe = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></I>
export const Route = (p) => <I {...p}><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 17h6a3 3 0 000-6H10a3 3 0 010-6h5.5"/></I>
export const Building = (p) => <I {...p}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></I>
export const Gift = (p) => <I {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-3.5-5-1.2C7 8 9 8 12 8zM12 8c1.5-3 5-3.5 5-1.2C17 8 15 8 12 8z"/></I>
