import { LayoutDashboard, Search, Sparkles, Megaphone, ChartNoAxesCombined, Bot, Settings, X } from 'lucide-react'

const items = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['research', 'Riset Produk', Search],
  ['content', 'Studio Konten AI', Sparkles],
  ['campaigns', 'Kampanye', Megaphone],
  ['analytics', 'Analitik Affiliate', ChartNoAxesCombined],
  ['assistant', 'Asisten AI', Bot],
  ['settings', 'Pengaturan', Settings],
]

export default function Sidebar({ page, setPage, open, setOpen }) {
  return <>
    {open && <button className="scrim" aria-label="Tutup menu" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand-row">
        <div className="brand-mark"><Sparkles size={21} /></div>
        <div className="brand-copy"><strong>AI Affiliate Studio</strong><span>PERSONAL WORKSPACE</span></div>
        <button className="icon-button close-sidebar" onClick={() => setOpen(false)} aria-label="Tutup"><X size={18}/></button>
      </div>
      <div className="workspace-label">RUANG KERJA</div>
      <nav className="nav-list">
        {items.map(([id, label, Icon]) => (
          <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => { setPage(id); setOpen(false) }}>
            <Icon size={18} strokeWidth={1.9}/><span>{label}</span>
            {id === 'content' && <i className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="plan-card"><div className="plan-icon"><Sparkles size={16}/></div><div><b>Mode Personal</b><span>Ruang kerja pribadi</span></div></div>
        <div className="profile-row"><div className="avatar">A</div><div><b>Affiliate Saya</b><span>Pengguna pribadi</span></div><Settings size={16} className="muted-icon"/></div>
      </div>
    </aside>
  </>
}
