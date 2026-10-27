import { Target, Handshake, Spark, Globe, Chart, Shield, Box, Star, Users, Snow, Leaf, Phone, Truck, Route, Building, Pin, Clock, Check } from './Icons'
export const ICONS = { target: Target, handshake: Handshake, spark: Spark, globe: Globe, chart: Chart, shield: Shield, box: Box, star: Star, users: Users, snow: Snow, leaf: Leaf, phone: Phone, truck: Truck, route: Route, building: Building, pin: Pin, clock: Clock, check: Check }
export const Icon = ({ name, ...p }) => { const C = ICONS[name] || Spark; return <C {...p} /> }
