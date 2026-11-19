import { Package, Clapperboard, CalendarCheck, Wallet } from 'lucide-react'
const icons = { package: Package, clapperboard: Clapperboard, 'calendar-check': CalendarCheck, wallet: Wallet }
export default function StatCard({ item }) {
  const Icon = icons[item.icon] || Package
  return <article className="stat-card"><div className="stat-top"><span>{item.label}</span><div className="stat-icon"><Icon size={18}/></div></div><div className="stat-value">{item.value}</div><div className="stat-note">{item.note}</div></article>
}
