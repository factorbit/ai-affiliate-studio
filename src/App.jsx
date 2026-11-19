import { useState } from 'react'
import { LayoutDashboard } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'

const titles = { dashboard: 'Dashboard', research: 'Riset Produk', content: 'Studio Konten AI', campaigns: 'Kampanye', analytics: 'Analitik Affiliate', assistant: 'Asisten AI', settings: 'Pengaturan' }
export default function App() {
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} open={menuOpen} setOpen={setMenuOpen}/>
    <main className="main-area">
      <Header title={titles[page]} onMenu={() => setMenuOpen(true)}/>
      <div className="content-area">
        {page === 'dashboard' ? <Dashboard setPage={setPage}/> : <Placeholder page={page} setPage={setPage}/>}
      </div>
      <footer className="app-footer"><span><LayoutDashboard size={13}/> AI Affiliate Studio</span><span>Versi awal · 0.1.0</span></footer>
    </main>
  </div>
}
