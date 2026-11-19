import { Menu, Bell, Search } from 'lucide-react'
export default function Header({ title, onMenu }) {
  return <header className="topbar">
    <button className="icon-button menu-button" onClick={onMenu} aria-label="Buka menu"><Menu size={21}/></button>
    <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{title}</strong></div>
    <div className="top-actions"><div className="search-pill"><Search size={16}/><span>Cari produk atau konten</span><kbd>⌘ K</kbd></div><button className="icon-button notification" aria-label="Notifikasi"><Bell size={19}/><i/></button><div className="top-avatar">A</div></div>
  </header>
}
