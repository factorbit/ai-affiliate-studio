import { useEffect, useState } from 'react'
import { Plus, RefreshCw, Trash2, ExternalLink, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'

const emptyForm = { name: '', platform: 'Shopee', category: '', product_url: '', price: '', commission_rate: '', notes: '' }

export default function ProductsPage({ user }) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { loadProducts() }, [])

  function change(field, value) { setForm(current => ({ ...current, [field]: value })) }

  async function saveProduct(event) {
    event.preventDefault()
    setSaving(true); setError(''); setNotice('')
    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      platform: form.platform,
      category: form.category.trim() || null,
      product_url: form.product_url.trim() || null,
      price: form.price === '' ? null : Number(form.price),
      commission_rate: form.commission_rate === '' ? null : Number(form.commission_rate),
      notes: form.notes.trim() || null,
    }
    const { error } = await supabase.from('products').insert(payload)
    if (error) setError(error.message)
    else {
      setForm(emptyForm); setShowForm(false); setNotice('Produk berhasil disimpan.')
      await loadProducts()
    }
    setSaving(false)
  }

  async function removeProduct(id) {
    if (!window.confirm('Hapus produk ini?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) setError(error.message)
    else { setNotice('Produk dihapus.'); await loadProducts() }
  }

  return <div className="page-stack">
    <section className="products-heading">
      <div><div className="eyebrow">DATABASE PRODUK</div><h1>Riset & Produk</h1><p>Simpan produk affiliate dari Shopee, TikTok Shop, atau Tokopedia dalam satu tempat.</p></div>
      <div className="products-actions"><button className="secondary-button" onClick={loadProducts} disabled={loading}><RefreshCw size={15}/> Muat ulang</button><button className="primary-button" onClick={() => { setShowForm(v => !v); setError(''); setNotice('') }}><Plus size={16}/> Tambah produk</button></div>
    </section>
    {notice && <div className="product-notice">{notice}</div>}
    {error && <div className="product-error"><b>Belum berhasil.</b> {error}{error.toLowerCase().includes('policy') || error.toLowerCase().includes('row-level security') ? ' Periksa kebijakan akses tabel products di Supabase.' : ''}</div>}
    {showForm && <form className="product-form panel" onSubmit={saveProduct}>
      <div className="panel-heading"><div><h3>Tambah produk baru</h3><p>Isi minimal nama produk dan platform.</p></div></div>
      <div className="product-form-grid">
        <label>Nama produk *<input value={form.name} onChange={e=>change('name',e.target.value)} required placeholder="Contoh: Tumbler stainless"/></label>
        <label>Platform<select value={form.platform} onChange={e=>change('platform',e.target.value)}><option>Shopee</option><option>TikTok Shop</option><option>Tokopedia</option><option>Lainnya</option></select></label>
        <label>Kategori<input value={form.category} onChange={e=>change('category',e.target.value)} placeholder="Contoh: Rumah tangga"/></label>
        <label>Harga (Rp)<input type="number" min="0" step="any" value={form.price} onChange={e=>change('price',e.target.value)} placeholder="75000"/></label>
        <label>Komisi (%)<input type="number" min="0" max="100" step="any" value={form.commission_rate} onChange={e=>change('commission_rate',e.target.value)} placeholder="10"/></label>
        <label className="product-wide">Link produk<input type="url" value={form.product_url} onChange={e=>change('product_url',e.target.value)} placeholder="https://..."/></label>
        <label className="product-wide">Catatan<textarea rows="2" value={form.notes} onChange={e=>change('notes',e.target.value)} placeholder="Catatan riset atau ide promosi"/></label>
      </div>
      <div className="product-form-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Batal</button><button className="primary-button" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan produk'}</button></div>
    </form>}
    <section className="panel product-list-panel">
      <div className="panel-heading"><div><h3>Produk tersimpan</h3><p>{products.length} produk di ruang kerja kamu</p></div></div>
      {loading ? <div className="product-empty">Memuat produk...</div> : products.length === 0 ? <div className="product-empty"><Package size={28}/><b>Belum ada produk</b><span>Tambahkan produk pertama untuk mulai membangun database affiliate kamu.</span><button className="primary-button" onClick={()=>setShowForm(true)}><Plus size={15}/> Tambah produk</button></div> : <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Produk</th><th>Platform</th><th>Harga</th><th>Komisi</th><th>Link</th><th></th></tr></thead><tbody>{products.map(product=><tr key={product.id}><td><b>{product.name}</b><small>{product.category || 'Tanpa kategori'}</small></td><td>{product.platform || '-'}</td><td>{product.price == null ? '-' : 'Rp '+Number(product.price).toLocaleString('id-ID')}</td><td>{product.commission_rate == null ? '-' : product.commission_rate+'%'}</td><td>{product.product_url ? <a href={product.product_url} target="_blank" rel="noreferrer">Buka <ExternalLink size={12}/></a> : '-'}</td><td><button className="delete-product" onClick={()=>removeProduct(product.id)} aria-label={'Hapus '+product.name}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>}
    </section>
  </div>
}
