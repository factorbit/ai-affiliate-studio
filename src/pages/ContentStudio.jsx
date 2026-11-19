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
  const name = product.name?.trim() || 'produk ini'
  const category = product.category?.trim() || 'produk pilihan'
  const kind = category.toLowerCase()
  const hair = /rambut|hair|kecantikan|beauty|skincare|make.?up|kosmetik/i.test(kind + ' ' + name)
  const fashion = /fashion|pakaian|baju|sepatu|tas|aksesoris|aksesoris/i.test(kind)
  const tech = /elektronik|gadget|handphone|komputer|audio|aksesoris hp/i.test(kind)
  const home = /rumah|dapur|perabot|home|kebersihan/i.test(kind)
  const food = /makanan|minuman|snack|cemilan|kuliner/i.test(kind)

  const openers = {
    playful: hair
      ? 'Jujur, urusan merawat diri tuh kadang bikin banyak pertanyaan. Mulai dari mana dulu, sih? 😭'
      : fashion
        ? 'Pernah nggak, sudah punya banyak outfit tapi tetap merasa nggak punya baju? 😭'
        : tech
          ? 'Kalau ada barang yang bikin aktivitas lebih praktis, pasti langsung masuk daftar kepo, kan? 👀'
          : home
            ? 'Siapa yang suka tergoda barang yang katanya bisa bikin urusan rumah lebih gampang? Ngaku! 😭'
            : food
              ? 'Lagi pengin nyobain sesuatu yang baru, tapi bingung mau pilih apa? 👀'
              : 'Eh, berhenti scroll sebentar! Ada satu produk yang mau aku ajak kamu kepoin. 😭',
    soft: 'Aku mau berbagi satu produk yang mungkin menarik buat kamu yang sedang mencari ' + kind + '.',
    honest: 'Sebelum memutuskan membeli sesuatu, ada baiknya kita kenali dulu produknya. Kali ini kita bahas ' + name + '.',
    hard: 'Lagi cari ' + kind + '? Yuk, luangkan sebentar untuk kenalan dengan ' + name + '!',
  }
  const story = {
    problem: hair
      ? 'Memilih produk perawatan itu nggak bisa asal ikut tren. Kebutuhan setiap orang berbeda, jadi penting untuk membaca informasi, mengenali kebutuhan diri, dan memahami cara pakainya.'
      : 'Sering kali kita tertarik pada suatu barang, tapi belum tentu benar-benar membutuhkannya. Coba pikirkan kebutuhanmu, lalu cocokkan dengan informasi dan fungsi produk yang dijelaskan penjual.',
    benefit: 'Daripada cuma melihat tampilannya, yuk kenali ' + name + ' lebih dekat. Perhatikan fungsi, detail, bahan atau spesifikasinya, lalu bayangkan apakah memang sesuai dengan kebutuhan sehari-hari.',
    review: 'Aku nggak mau asal bilang produk ini bagus. Yang perlu kamu cek adalah detail produk, bahan atau spesifikasi, cara penggunaan, serta pengalaman pembeli lain. Cocok atau tidaknya tetap bergantung pada kebutuhan masing-masing.',
    deal: 'Kalau dari awal sudah menarik perhatianmu, jangan buru-buru checkout. Buka halaman produknya, lihat pilihan yang tersedia, baca ulasan, dan pastikan detailnya sesuai.',
  }
  const endings = {
    playful: 'Intinya, jangan cuma keracunan karena lihat videonya. Kepoin detailnya dulu, baru tentukan pilihan. 😆',
    soft: 'Kalau setelah melihat detailnya kamu merasa produk ini sesuai, silakan pertimbangkan sebagai salah satu pilihan.',
    honest: 'Cek informasi dan ulasannya terlebih dahulu. Belanja sesuai kebutuhan selalu lebih baik daripada ikut-ikutan.',
    hard: 'Kalau penasaran, langsung cek halaman produknya dan lihat sendiri detail lengkapnya!',
  }
  const hook = openers[tone] || openers.playful
  const body = story[angle] || story.benefit
  const ending = endings[tone] || endings.soft
  const script = hook + '\n\n' + body + '\n\n' + ending
  const caption = name + ' ✨\nLagi cari referensi sebelum memutuskan beli? Kenali dulu detail, fungsi, dan ulasan produk ini. Pilih yang paling sesuai dengan kebutuhanmu.'
  const tags = '#affiliate #rekomendasiproduk #racunbelanja #belanjapintar'
  return { hook, script, caption, hashtags: tags, duration: Number(duration) }
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
        {selected && <div className="content-product-summary"><b>{selected.name}</b><span>{selected.platform}{selected.category ? ' · '+selected.category : ''}</span></div>}
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
