import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, ChartNoAxesCombined } from 'lucide-react'

const blank = { date: new Date().toISOString().slice(0,10), platform: 'Shopee', clicks: '', orders: '', revenue: '', commission: '' }
const money = value => 'Rp ' + Number(value || 0).toLocaleString('id-ID')

export default function AnalyticsPage({ user }) {
  const key = 'affiliate-analytics-' + user.id
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(blank)
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => { try { setRows(JSON.parse(localStorage.getItem(key) || '[]')) } catch { setRows([]) } }, [key])
  const saveRows = next => { setRows(next); localStorage.setItem(key, JSON.stringify(next)) }
  const totals = useMemo(() => rows.reduce((a,r)=>({ clicks:a.clicks+Number(r.clicks||0), orders:a.orders+Number(r.orders||0), revenue:a.revenue+Number(r.revenue||0), commission:a.commission+Number(r.commission||0) }), {clicks:0,orders:0,revenue:0,commission:0}), [rows])
  const conversion = totals.clicks ? (totals.orders / totals.clicks * 100).toFixed(2) : '0.00'
  function submit(e) {
    e.preventDefault()
    const entry = { ...form, id: Date.now().toString() }
    saveRows([entry,...rows]); setForm({...blank,date:new Date().toISOString().slice(0,10)}); setShowForm(false); setNotice('Data performa berhasil dicatat.')
  }
  function remove(id) { if(window.confirm('Hapus catatan performa ini?')) saveRows(rows.filter(r=>r.id!==id)) }

  return <div className="page-stack">
    <section className="products-heading"><div><div className="eyebrow">PERFORMA AFFILIATE</div><h1>Analitik Affiliate</h1><p>Catat hasil dari dashboard marketplace dan pantau perkembangan performa.</p></div><button className="primary-button" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> Catat performa</button></section>
    {notice && <div className="product-notice">{notice}</div>}
    <section className="stats-grid">
      <div className="panel"><span className="eyebrow">KLIK</span><h2>{totals.clicks.toLocaleString('id-ID')}</h2></div>
      <div className="panel"><span className="eyebrow">PESANAN</span><h2>{totals.orders.toLocaleString('id-ID')}</h2></div>
      <div className="panel"><span className="eyebrow">KONVERSI</span><h2>{conversion}%</h2></div>
      <div className="panel"><span className="eyebrow">PENDAPATAN</span><h2>{money(totals.revenue)}</h2></div>
      <div className="panel"><span className="eyebrow">KOMISI</span><h2>{money(totals.commission)}</h2></div>
    </section>
    {showForm && <form className="panel product-form" onSubmit={submit}><div className="panel-heading"><div><h3>Catat performa</h3><p>Masukkan angka dari laporan Shopee, TikTok Shop, atau Tokopedia.</p></div></div>
      <div className="product-form-grid">
        <label>Tanggal<input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
        <label>Platform<select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option>Shopee</option><option>TikTok Shop</option><option>Tokopedia</option><option>Lainnya</option></select></label>
        <label>Klik<input type="number" min="0" step="1" required value={form.clicks} onChange={e=>setForm({...form,clicks:e.target.value})}/></label>
        <label>Pesanan<input type="number" min="0" step="1" required value={form.orders} onChange={e=>setForm({...form,orders:e.target.value})}/></label>
        <label>Nilai penjualan (Rp)<input type="number" min="0" step="any" value={form.revenue} onChange={e=>setForm({...form,revenue:e.target.value})}/></label>
        <label>Komisi (Rp)<input type="number" min="0" step="any" value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})}/></label>
      </div>
      <div className="product-form-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Batal</button><button className="primary-button">Simpan data</button></div>
    </form>}
    <section className="panel product-list-panel"><div className="panel-heading"><div><h3>Riwayat performa</h3><p>{rows.length} catatan manual</p></div></div>
      {rows.length===0 ? <div className="product-empty"><ChartNoAxesCombined size={28}/><b>Belum ada data performa</b><span>Catat angka dari laporan affiliate untuk mulai melihat ringkasan.</span><button className="primary-button" onClick={()=>setShowForm(true)}><Plus size={15}/> Catat performa</button></div> :
      <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Tanggal</th><th>Platform</th><th>Klik</th><th>Pesanan</th><th>Penjualan</th><th>Komisi</th><th></th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.date}</td><td>{r.platform}</td><td>{Number(r.clicks).toLocaleString('id-ID')}</td><td>{Number(r.orders).toLocaleString('id-ID')}</td><td>{money(r.revenue)}</td><td>{money(r.commission)}</td><td><button className="delete-product" onClick={()=>remove(r.id)} aria-label="Hapus catatan"><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>}
    </section>
    <p className="content-disclaimer">Data diisi manual berdasarkan laporan marketplace. Belum ada sinkronisasi otomatis dengan Shopee, TikTok Shop, atau Tokopedia. Data tersimpan di browser dan perangkat ini.</p>
  </div>
}
