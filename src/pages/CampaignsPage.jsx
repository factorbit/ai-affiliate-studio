import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, FolderKanban, CalendarDays } from 'lucide-react'
import { supabase } from '../lib/supabase'

const blank = { name: '', product_id: '', platform: 'Shopee', status: 'Ide', content_type: 'Video pendek', publish_date: '', notes: '' }

export default function CampaignsPage({ user }) {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(blank)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const storageKey = 'affiliate-campaigns-' + user.id

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(storageKey) || '[]')) } catch { setItems([]) }
    supabase.from('products').select('id,name,platform').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setProducts(data || []))
  }, [storageKey, user.id])

  const saveItems = next => { setItems(next); localStorage.setItem(storageKey, JSON.stringify(next)) }
  const linkedProduct = products.find(p => String(p.id) === String(form.product_id))
  const counts = useMemo(() => ({ total: items.length, active: items.filter(x => x.status !== 'Selesai').length, done: items.filter(x => x.status === 'Selesai').length }), [items])

  function save(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    const entry = { ...form, id: Date.now().toString(), product_name: linkedProduct?.name || '', created_at: new Date().toISOString() }
    saveItems([entry, ...items])
    setForm(blank); setShowForm(false); setNotice('Kampanye berhasil disimpan.'); setError('')
  }
  function remove(id) {
    if (!window.confirm('Hapus kampanye ini?')) return
    saveItems(items.filter(x => x.id !== id)); setNotice('Kampanye dihapus.')
  }
  function updateStatus(id, status) { saveItems(items.map(x => x.id === id ? { ...x, status } : x)) }

  return <div className="page-stack">
    <section className="products-heading"><div><div className="eyebrow">MANAJEMEN PROMOSI</div><h1>Kampanye</h1><p>Susun ide promosi, jadwal publikasi, dan status pekerjaan affiliate.</p></div><button className="primary-button" onClick={() => { setShowForm(!showForm); setNotice('') }}><Plus size={16}/> Buat kampanye</button></section>
    {notice && <div className="product-notice">{notice}</div>}
    <section className="stats-grid">
      <div className="panel"><span className="eyebrow">TOTAL KAMPANYE</span><h2>{counts.total}</h2></div>
      <div className="panel"><span className="eyebrow">SEDANG BERJALAN</span><h2>{counts.active}</h2></div>
      <div className="panel"><span className="eyebrow">SELESAI</span><h2>{counts.done}</h2></div>
    </section>
    {showForm && <form className="panel product-form" onSubmit={save}><div className="panel-heading"><div><h3>Kampanye baru</h3><p>Catat rencana promosi yang ingin kamu jalankan.</p></div></div>
      <div className="product-form-grid">
        <label>Nama kampanye *<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Contoh: Review produk minggu ini"/></label>
        <label>Produk terkait<select value={form.product_id} onChange={e=>{const p=products.find(x=>String(x.id)===e.target.value);setForm({...form,product_id:e.target.value,platform:p?.platform||form.platform})}}><option value="">Pilih produk (opsional)</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Platform<select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option>Shopee</option><option>TikTok Shop</option><option>Tokopedia</option><option>Lainnya</option></select></label>
        <label>Jenis konten<select value={form.content_type} onChange={e=>setForm({...form,content_type:e.target.value})}><option>Video pendek</option><option>Live</option><option>Story</option><option>Carousel</option><option>Postingan</option></select></label>
        <label>Tanggal rencana<input type="date" value={form.publish_date} onChange={e=>setForm({...form,publish_date:e.target.value})}/></label>
        <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Ide</option><option>Disiapkan</option><option>Siap tayang</option><option>Dipublikasikan</option><option>Selesai</option></select></label>
        <label className="product-wide">Catatan<textarea rows="2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Ide hook, target audiens, atau catatan lainnya"/></label>
      </div>
      <div className="product-form-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Batal</button><button className="primary-button">Simpan kampanye</button></div>
    </form>}
    <section className="panel product-list-panel"><div className="panel-heading"><div><h3>Daftar kampanye</h3><p>{items.length} kampanye tersimpan di browser ini</p></div></div>
      {items.length === 0 ? <div className="product-empty"><FolderKanban size={28}/><b>Belum ada kampanye</b><span>Buat kampanye pertama untuk mulai mengatur promosi.</span><button className="primary-button" onClick={()=>setShowForm(true)}><Plus size={15}/> Buat kampanye</button></div> :
      <div className="campaign-list">{items.map(item=><div className="campaign-row" key={item.id}><div className="product-thumb"><FolderKanban size={19}/></div><div className="campaign-info"><b>{item.name}</b><span>{item.product_name || 'Tanpa produk'} · {item.platform} · {item.content_type}{item.publish_date ? ' · '+item.publish_date : ''}</span>{item.notes && <small>{item.notes}</small>}</div><select aria-label="Status kampanye" value={item.status} onChange={e=>updateStatus(item.id,e.target.value)}>{['Ide','Disiapkan','Siap tayang','Dipublikasikan','Selesai'].map(s=><option key={s}>{s}</option>)}</select><button className="delete-product" onClick={()=>remove(item.id)} aria-label="Hapus kampanye"><Trash2 size={15}/></button></div>)}</div>}
    </section>
    <p className="content-disclaimer"><CalendarDays size={13}/> Data kampanye disimpan di browser dan perangkat ini, bukan di database cloud.</p>
  </div>
}
