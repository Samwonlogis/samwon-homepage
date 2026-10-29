import { useState } from 'react'
import { Link } from 'react-router-dom'
import { VEHICLES, VEHICLE_NOTE } from '../data/vehicles'
import { asset } from '../utils/storage'
import VehicleArt from './VehicleArt'
import { ArrowRight } from './Icons'

function VehicleVisual({ v, small }) {
  const [ok, setOk] = useState(!!v.photo)
  return (
    <div className={`veh__visual ${ok ? 'has-photo' : 'is-art'} ${small ? 'is-small' : ''}`}>
      {ok ? <img src={asset(v.photo)} alt={`${v.name} 차량`} loading="lazy" onError={() => setOk(false)} /> : <VehicleArt type={v.art} />}
      <span className="veh__ton">{v.tonnage}</span>
    </div>
  )
}

export function VehicleCard({ v }) {
  return (
    <article className="veh" data-reveal="">
      <VehicleVisual v={v} />
      <div className="veh__body">
        <div className="veh__head"><h3>{v.name}</h3><span>{v.sub}</span></div>
        <dl className="veh__spec">{v.specs.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
        <p className="veh__use"><b>주요 용도</b>{v.use}</p>
        <div className="veh__goods"><b>주요 운송 제품</b><ul>{v.goods.map(g => <li key={g}>{g}</li>)}</ul></div>
      </div>
    </article>
  )
}

export function VehicleMini({ v }) {
  return (
    <Link to="/company/status#fleet" className="veh-mini" data-reveal="">
      <VehicleVisual v={v} small />
      <div className="veh-mini__txt">
        <b>{v.name}</b><span>{v.sub}</span>
        <dl className="veh-mini__spec">{v.specs.slice(0, 2).map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
        <p className="veh-mini__use"><em>주요 용도</em>{v.use}</p>
        <ul className="veh-mini__goods">{v.goods.slice(0, 4).map(g => <li key={g}>{g}</li>)}</ul>
      </div>
    </Link>
  )
}

// 그리드 빈 칸을 채우는 상담 안내 타일
export function VehicleCtaTile() {
  return (
    <Link to="/contact" className="veh-mini veh-mini--cta" data-reveal="">
      <div className="veh-mini__cta">
        <span className="veh-mini__cta-icon"><ArrowRight /></span>
        <b>화물에 맞는 차종,<br />전담 배차 담당자가 제안합니다</b>
        <p>품목·물량·온도 조건을 알려주시면 톤수와 차종을 조합해 최적의 운송안을 드립니다.</p>
        <span className="veh-mini__cta-link">차종 상담 신청 <ArrowRight /></span>
      </div>
    </Link>
  )
}

export default function VehicleGuide({ filter }) {
  const [tab, setTab] = useState('all')
  const groups = [['all', '전체'], ['small', '소형 · 도심'], ['mid', '중형 · 냉장'], ['large', '대형 · 특수']]
  const inTab = (v) => tab === 'all' || (tab === 'small' && ['quick', '1t'].includes(v.id)) || (tab === 'mid' && ['box', 'reefer'].includes(v.id)) || (tab === 'large' && ['wing', 'cargo', 'container'].includes(v.id))
  const list = VEHICLES.filter(v => (!filter || filter.includes(v.id)) && inTab(v))
  return (
    <div className="vguide">
      {!filter && <div className="filters filters--center">{groups.map(([k, l]) => <button type="button" key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>}
      <div className="vguide__grid">{list.map(v => <VehicleCard key={v.id} v={v} />)}</div>
      <p className="small muted vguide__note">{VEHICLE_NOTE}</p>
      <div style={{ textAlign: 'center', marginTop: 24 }}><Link className="btn btn--primary" to="/contact">화물에 맞는 차종 상담 <ArrowRight /></Link></div>
    </div>
  )
}
