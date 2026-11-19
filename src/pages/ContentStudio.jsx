import { useEffect, useMemo, useState } from 'react'
import { Copy, RefreshCw, Sparkles, Video, MessageSquareText } from 'lucide-react'
import { supabase } from '../lib/supabase'

const angles = {
  problem: 'Masalah dan solusi',
  benefit: 'Manfaat utama',
  review: 'Review jujur',
  deal: 'Promo & ajakan cek produk',
}
const tones = {
  playful: 'Lucu & nakal',
  soft: 'Soft selling',
  honest: 'Review jujur',
  hard: 'Hard selling',
}

function makeContent(product, angle, duration, tone) {
  const name = product.name
  const category = product.category?.trim() || 'produk ini'
  const isHair = /rambut|hair|shampoo|sampo|conditioner|serum rambut|hairgrow/i.test(name + ' ' + category)
  const playfulHook = isHair
    ? 'Rambut kalau bisa ngomong mungkin udah teriak: “Tolong, rawat aku yang bener!” 😭'
    : 'Scroll boleh, tapi jangan sampai kelewatan kenalan sama ' + name + ' ini! 😭'
  const hooks = {
    playful: playfulHook,
    soft: 'Lagi cari ' + category.toLowerCase() + ' yang bisa masuk rutinitasmu? Coba kenalan dengan ' + name + '.',
    honest: 'Sebelum ikut-ikutan beli ' + name + ', yuk kita cek dulu detail produknya.',
    hard: 'Buat kamu yang sedang mencari ' + category.toLowerCase() + ', intip dulu ' + name + ' ini!',
  }
  const middleByAngle = {
    problem: isHair
      ? 'Rambut punya kebutuhan yang berbeda-beda, jadi jangan asal ikut rekomendasi orang. Kenali dulu kondisi rambut dan kulit kepalamu, lalu cek kandungan serta petunjuk pemakaian produk ini.'
      : 'Setiap orang punya kebutuhan yang berbeda. Kenali dulu kebutuhanmu, lalu cek apakah detail dan spesifikasi produk ini memang sesuai.',
    benefit: 'Kenalan lebih dekat dengan ' + name + '. Cek informasi produk, kandungan atau bahan, serta cara pakainya supaya kamu tahu apa yang akan kamu gunakan.',
    review: 'Jangan cuma lihat kemasannya. Perhatikan informasi produk, bahan atau kandungannya, petunjuk pemakaian, dan ulasan pembeli. Sesuaikan dengan kebutuhanmu sebelum memutuskan.',
    deal: 'Kalau produknya menarik perhatianmu, buka halaman produknya untuk melihat varian, informasi lengkap, dan promo yang sedang tersedia.',
  }
  const endings = {
    playful: 'Jadi, jangan asal tergoda kemasan, bestie. Cek detailnya dulu, baru putuskan. 😭',
    soft: 'Kalau informasinya sesuai dengan yang kamu cari, kamu bisa mempertimbangkannya sebagai salah satu pilihan.',
    honest: 'Selalu cek detail dan ulasan pembeli. Pilih berdasarkan kebutuhanmu, bukan sekadar ikut tren.',
    hard: 'Yuk, cek detail produknya sekarang dan tentukan apakah ini yang kamu cari!',
  }
  const hook = hooks[tone] || hooks.playful
  const body = middleByAngle[angle] || middleByAngle.benefit
  const ending = endings[tone] || endings.soft
  const script = hook + '\\n\\n' + body + '\\n\\n' + ending
  const caption = name + ' ✨ ' + (isHair
    ? 'Yuk lebih teliti memilih produk perawatan rambut. Kenali kebutuhan rambutmu dan cek detail produknya sebelum mencoba.'
    : 'Kenali detail produknya dan pastikan sesuai dengan kebutuhanmu sebelum membeli.')
  return { hook, script, caption, hashtags: '#affiliate #rekomendasiproduk #racunbelanja #tiktokshop #shopeehaul', duration: Number(duration) }
}

export default function ContentStudio({ user }) {
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [angle, setAngle] = useState('benefit')
  const [tone, setTone] = useState('playful')
  const [duration, setDuration] = useState('30')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.from('products').select('id,name,platform,category,price,notes').eq('user_id', user.id).order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setProducts(data || [])
      setSelectedId(current => current || data?.[0]?.id || '')
    }
    setLoading(false)
  }

  useEffect(() => { loadProducts() }, [user.id])
  const selected = useMemo(() => products.find(item => String(item.id) === String(selectedId)), [products, selectedId])

  function generate() {
    if (!selected) { setError('Simpan produk terlebih dahulu di menu Riset Produk.'); return }
    setError('')
    setNotice('')
    setOutput(makeContent(selected, angle, duration, tone))
  }

  async function copyText(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      setNotice(label + ' berhasil disalin.')
    } catch {
      setNotice('Browser tidak mengizinkan salin otomatis. Pilih teks lalu salin manual.')
    }
  }

  return <div className="page-stack">
    <section className="products-heading">
      <div><div className="eyebrow">AI CONTENT WORKSPACE</div><h1>Studio Konten AI</h1><p>Buat draft hook, naskah video, caption, dan hashtag dari produk yang tersimpan.</p></div>
      <button className="secondary-button" onClick={loadProducts} disabled={loading}><RefreshCw size={15}/> Muat ulang produk</button>
    </section>
    {error && <div className="product-error">{error}</div>}
    {notice && <div className="product-notice">{notice}</div>}
    <section className="panel content-generator">
      <div className="panel-heading"><div><h3><Sparkles size={15}/> Buat konten promosi</h3><p>Pilih produk dan sudut promosi untuk membuat draft awal.</p></div></div>
      {loading ? <div className="product-empty">Memuat produk tersimpan...</div> : products.length === 0 ? <div className="product-empty"><Video size={28}/><b>Belum ada produk untuk dibuatkan konten</b><span>Tambahkan produk di menu Riset Produk terlebih dahulu.</span></div> : <>
        <div className="product-form-grid">
          <label className="product-wide">Pilih produk
            <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setOutput(null) }}>
              {products.map(item => <option key={item.id} value={item.id}>{item.name} · {item.platform}</option>)}
            </select>
          </label>
          <label>Sudut promosi
            <select value={angle} onChange={e => setAngle(e.target.value)}>
              {Object.entries(angles).map(([key,label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label>Gaya bahasa
            <select value={tone} onChange={e => setTone(e.target.value)}>
              {Object.entries(tones).map(([key,label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label>Durasi video
            <select value={duration} onChange={e => setDuration(e.target.value)}><option value="15">15 detik</option><option value="30">30 detik</option><option value="60">60 detik</option></select>
          </label>
        </div>
        {selected && <div className="content-product-summary"><b>{selected.name}</b><span>{selected.platform}{selected.price == null ? '' : ' · '+money(selected.price)}{selected.category ? ' · '+selected.category : ''}</span></div>}
        <button className="primary-button" onClick={generate}><Sparkles size={15}/> Buat draft konten</button>
      </>}
    </section>
    {output && <div className="content-results">
      <section className="panel content-result-panel">
        <div className="panel-heading"><div><h3><Video size={15}/> Hook pembuka</h3><p>Kalimat untuk menarik perhatian di awal video.</p></div><button className="secondary-button" onClick={() => copyText(output.hook,'Hook')}><Copy size={13}/> Salin</button></div>
        <textarea rows="2" value={output.hook} onChange={e=>setOutput({...output,hook:e.target.value})}/>
      </section>
      <section className="panel content-result-panel">
        <div className="panel-heading"><div><h3><MessageSquareText size={15}/> Naskah video · {output.duration} detik</h3><p>Draft naskah yang bisa kamu edit sebelum direkam.</p></div><button className="secondary-button" onClick={() => copyText(output.script,'Naskah')}><Copy size={13}/> Salin</button></div>
        <textarea rows="8" value={output.script} onChange={e=>setOutput({...output,script:e.target.value})}/>
      </section>
      <section className="panel content-result-panel">
        <div className="panel-heading"><div><h3>Caption dan hashtag</h3><p>Caption siap diedit untuk posting.</p></div><button className="secondary-button" onClick={() => copyText(output.caption+'\n\n'+output.hashtags,'Caption')}><Copy size={13}/> Salin</button></div>
        <textarea rows="4" value={output.caption+'\n\n'+output.hashtags} readOnly/>
      </section>
      <p className="content-disclaimer">Draft dibuat dari informasi produk yang kamu simpan. Periksa fakta, harga, klaim manfaat, dan ketentuan platform sebelum dipublikasikan. Generator ini belum menggunakan layanan AI eksternal.</p>
    </div>}
  </div>
}
