import { useState } from 'react'
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMessage(''); setError('')
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage(data.session ? 'Akun berhasil dibuat. Kamu sudah masuk.' : 'Akun dibuat. Periksa email untuk konfirmasi sebelum masuk.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.')
    } finally { setBusy(false) }
  }

  return <main className="auth-screen">
    <section className="auth-card">
      <div className="auth-brand"><span><Sparkles size={23}/></span><div><b>AI Affiliate Studio</b><small>PERSONAL WORKSPACE</small></div></div>
      <div className="auth-eyebrow">RUANG KERJA AFFILIATE</div>
      <h1>{mode === 'login' ? 'Selamat datang kembali' : 'Buat akun kamu'}</h1>
      <p className="auth-desc">{mode === 'login' ? 'Masuk untuk melanjutkan pekerjaan affiliate kamu.' : 'Daftar untuk mulai menyimpan produk dan kampanye.'}</p>
      <form onSubmit={submit}>
        <label>Email</label>
        <div className="auth-input"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nama@email.com" required autoComplete="email"/></div>
        <label>Kata sandi</label>
        <div className="auth-input"><Lock size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimal 6 karakter" required minLength={6} autoComplete={mode==='login'?'current-password':'new-password'}/></div>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'} <ArrowRight size={17}/></button>
      </form>
      <div className="auth-switch">{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'} <button onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setMessage('')}}>{mode==='login'?'Daftar sekarang':'Masuk'}</button></div>
      <div className="auth-foot">Akses pribadi · Data tersimpan dengan aman</div>
    </section>
  </main>
}
