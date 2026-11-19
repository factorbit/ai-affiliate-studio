import { useState } from 'react'
import { Settings, User, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SettingsPage({ user }) {
  const [compact, setCompact] = useState(localStorage.getItem('affiliate-compact-mode') === 'true')
  const [notice, setNotice] = useState('')
  function toggle(value) { setCompact(value); localStorage.setItem('affiliate-compact-mode',String(value)); setNotice('Preferensi disimpan di browser ini.') }
  return <div className="page-stack">
    <section className="products-heading"><div><div className="eyebrow">PREFERENSI WORKSPACE</div><h1>Pengaturan</h1><p>Informasi akun dan preferensi dasar aplikasi.</p></div></section>
    {notice && <div className="product-notice">{notice}</div>}
    <section className="panel product-form" style={{padding:20}}><div className="panel-heading"><div><h3><User size={16}/> Akun</h3><p>Informasi sesi yang sedang digunakan.</p></div></div><div className="content-product-summary"><b>{user.email}</b><span>ID akun: {user.id}</span></div><button className="secondary-button" onClick={()=>supabase.auth.signOut()}>Keluar dari akun</button></section>
    <section className="panel product-form" style={{padding:20}}><div className="panel-heading"><div><h3><Settings size={16}/> Preferensi</h3><p>Pengaturan sederhana untuk browser ini.</p></div></div><label style={{display:'flex',alignItems:'center',gap:10}}><input type="checkbox" checked={compact} onChange={e=>toggle(e.target.checked)}/> Aktifkan tampilan ringkas (preferensi tersimpan lokal)</label></section>
    <section className="panel product-form" style={{padding:20}}><div className="panel-heading"><div><h3><ShieldCheck size={16}/> Privasi & koneksi</h3><p>Koneksi akun dikelola melalui Supabase. Kunci layanan disimpan di pengaturan server Netlify, bukan di halaman ini.</p></div></div><p className="content-disclaimer">Jangan membagikan kata sandi atau API key melalui chat. Data kampanye dan analitik versi saat ini tersimpan di browser/perangkat ini.</p></section>
  </div>
}
