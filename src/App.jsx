import { useEffect, useState } from 'react'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'
import Auth from './pages/Auth'
import ProductsPage from './pages/ProductsPage'
import ContentStudio from './pages/ContentStudio'
import CampaignsPage from './pages/CampaignsPage'
import AnalyticsPage from './pages/AnalyticsPage'

const titles = { dashboard: 'Dashboard', research: 'Riset Produk', content: 'Studio Konten AI', campaigns: 'Kampanye', analytics: 'Analitik Affiliate', assistant: 'Asisten AI', settings: 'Pengaturan' }

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) { setChecking(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) return <div className="auth-screen"><section className="auth-card"><h1>Koneksi Supabase belum siap</h1><p className="auth-desc">Periksa pengaturan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Netlify.</p></section></div>
  if (checking) return <div className="auth-screen"><div className="auth-loading">Memeriksa sesi akun...</div></div>
  if (!session) return <Auth />

  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} open={menuOpen} setOpen={setMenuOpen}/>
    <main className="main-area">
      <Header title={titles[page]} onMenu={() => setMenuOpen(true)}/>
      <div className="content-area">
        {page === 'dashboard' ? <Dashboard setPage={setPage}/> : page === 'research' ? <ProductsPage user={session.user}/> : page === 'content' ? <ContentStudio user={session.user}/> : page === 'campaigns' ? <CampaignsPage user={session.user}/> : page === 'analytics' ? <AnalyticsPage user={session.user}/> : <Placeholder page={page} setPage={setPage}/>}
      </div>
      <footer className="app-footer"><span><LayoutDashboard size={13}/> AI Affiliate Studio</span><span>{session.user.email} · <button className="logout-button" onClick={() => supabase.auth.signOut()}><LogOut size={12}/> Keluar</button></span></footer>
    </main>
  </div>
}
