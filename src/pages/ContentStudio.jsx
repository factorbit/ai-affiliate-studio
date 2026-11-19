import { useEffect, useMemo, useState } from 'react'
import { Copy, RefreshCw, Sparkles, Video, MessageSquareText } from 'lucide-react'
import { supabase } from '../lib/supabase'

const angles = {
  problem: 'Masalah dan solusi',
  benefit: 'Manfaat utama',
  review: 'Review jujur',
  deal: 'Harga dan penawaran',
}
const tones = {
  playful: 'Lucu & nakal',
  soft: 'Soft selling',
  honest: 'Review jujur',
  hard: 'Hard selling',
}
const money = value => value == null ? '' : 'Rp ' + Number(value).toLocaleString('id-ID')

function makeContent(product, angle, duration, tone) {
  const name = product.name
  const benefit = product.notes?.trim() || product.category?.trim() || 'praktis untuk kebutuhan sehari-hari'
  const price = product.price == null ? '' : ' Harganya sekitar ' + money(product.price) + '.'
  const hooks = {
    problem: 'Masih sering kesulitan saat membutuhkan ' + benefit + '?',
    benefit: 'Kenalan dengan ' + name + ', pilihan yang bisa membantu aktivitasmu!',
    review: 'Aku mau bahas singkat tentang ' + name + ' yang satu ini.',
    deal: 'Lagi cari ' + name + '? Cek dulu detail dan harganya sebelum kehabisan!',
  }
  const middle = {
    problem: 'Kadang hal sederhana bisa bikin aktivitas jadi kurang praktis. Produk ini bisa jadi salah satu pilihan untuk membantu kebutuhan tersebut. Sesuaikan dengan kebutuhanmu dan cek detail produknya terlebih dahulu.',
    benefit: name + ' bisa jadi opsi untuk kamu yang membutuhkan ' + benefit + '. Perhatikan spesifikasi, ulasan pembeli, dan detail produk agar sesuai dengan yang kamu cari.',
    review: 'Sebelum membeli, cek bahan atau spesifikasi, ukuran, ulasan pembeli, serta kecocokannya dengan kebutuhanmu. Jangan lupa bandingkan informasi dari penjual.',
    deal: 'Sebelum checkout, pastikan varian, spesifikasi, ongkir, dan promo yang tersedia. Bandingkan juga dengan toko lain agar mendapat penawaran yang sesuai.',
  }
  const isHair = /rambut|hair|shampoo|sampo|conditioner|serum rambut/i.test(name + ' ' + benefit)
  const toneHooks = {
    playful: isHair
      ? 'Rambut udah diajak kompromi, kok masih drama tiap hari? 😭 Kenalan dulu sama ' + name + '!'
      : 'Niatnya cuma lihat-lihat, eh malah nemu ' + name + '. Ini sih bikin penasaran! 😭',
    soft: 'Kalau kamu sedang mencari ' + benefit + ', mungkin ' + name + ' bisa masuk daftar pilihanmu.',
    honest: 'Sebelum kamu memutuskan beli ' + name + ', yuk cek dulu hal-hal pentingnya.',
    hard: 'Lagi butuh ' + benefit + '? Jangan lewatkan untuk cek ' + name + ' sekarang!',
  }
  const closings = {
    playful: 'Kalau ternyata cocok sama kebutuhanmu, boleh langsung cek detail produknya. Jangan asal checkout ya, bestie! 😭',
    soft: 'Kalau terasa sesuai dengan kebutuhanmu, kamu bisa melihat detail produk dan ulasannya lebih lanjut.',
    honest: 'Cek detail, ulasan pembeli, dan kecocokan produk sebelum memutuskan. Pilih sesuai kebutuhanmu.',
    hard: 'Klik link produk untuk cek harga, varian, dan promo yang tersedia. Pastikan sebelum checkout!',
  }
  const hook = toneHooks[tone] || hooks[angle]
  const script = hook + '\n\n' + middle[angle] + price + '\n\n' + (closings[tone] || closings.soft)
  const caption = name + ' — ' + benefit + '.' + price + ' ' + (closings[tone] || closings.soft) + ' #affiliate #racunbelanja #rekomendasiproduk'
  return { hook, script, caption, hashtags: '#affiliate #rekomendasiproduk #shopeehaul #tiktokshop #belanjapintar', duration: Number(duration) }
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
