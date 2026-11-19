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
  const details = [product.notes, product.category, product.platform].filter(Boolean).join(', ')
  const problemByAngle = {
    problem: 'Pernah mengalami situasi ketika kebutuhan sehari-hari terasa merepotkan, tetapi belum menemukan pilihan yang pas?',
    benefit: 'Mencari produk yang benar-benar sesuai kebutuhan itu kadang bikin bingung. Banyak pilihan, tetapi detailnya perlu diperiksa satu per satu.',
    review: 'Sebelum ikut-ikutan membeli karena sedang ramai, ada baiknya kita lihat dulu apa yang ditawarkan dan apakah sesuai kebutuhan.',
    deal: 'Lagi mempertimbangkan beli produk? Jangan buru-buru checkout sebelum tahu detail pentingnya.',
  }
  const hooks = {
    playful: 'STOP SCROLL DULU! Kalau kamu sedang mencari ' + category.toLowerCase() + ', ada satu hal yang wajib kamu cek sebelum memilih.',
    soft: 'Buat kamu yang sedang mencari ' + category.toLowerCase() + ', yuk kenalan dulu dengan satu pilihan ini.',
    honest: 'Jangan langsung checkout. Kenali dulu ' + name + ' dan cek apakah memang sesuai kebutuhanmu.',
    hard: 'Lagi cari ' + category.toLowerCase() + '? Simak dulu sampai akhir sebelum menentukan pilihan.',
  }
  const problem = problemByAngle[angle] || problemByAngle.benefit
  const bridge = 'Nah, salah satu pilihan yang bisa kamu pertimbangkan adalah ' + name + '.'
  const factual = details
    ? 'Informasi yang tersedia: ' + details + '. Cocokkan detail tersebut dengan kebutuhanmu dan baca keterangan lengkap dari penjual.'
    : 'Buka detail produknya untuk memeriksa fungsi, bahan atau spesifikasi, ukuran atau varian, serta ulasan pembeli. Jangan mengandalkan asumsi.'
  const solution = 'Cara memilihnya: tentukan dulu kebutuhanmu, periksa detail produk, bandingkan pilihan yang tersedia, lalu pastikan cara pakai atau spesifikasinya cocok.'
  const retention = duration === '15'
    ? 'Sebentar lagi, ini yang paling penting: jangan lupa cek detail dan ulasannya sebelum membeli.'
    : duration === '60'
      ? 'Tapi tunggu, jangan lewatkan bagian ini. Sebelum memutuskan, bandingkan detailnya dengan kebutuhanmu, cek ulasan terbaru, dan perhatikan pilihan varian yang tersedia. Langkah kecil ini bisa membantumu menghindari salah pilih.'
      : 'Eits, jangan buru-buru. Ada satu langkah penting: cek ulasan pembeli dan pastikan varian yang kamu pilih benar-benar sesuai.'
  const benefit = 'Dengan mengecek hal-hal itu lebih dulu, kamu bisa membuat keputusan yang lebih yakin dan sesuai kebutuhan—bukan sekadar ikut tren.'
  const cta = tone === 'hard'
    ? 'Kalau tertarik, klik produk atau tautan di keranjang untuk cek harga, varian, dan detail terbarunya sekarang.'
    : tone === 'playful'
      ? 'Kepo boleh, checkout jangan asal! Cek detail produknya lewat tautan atau keranjang, lalu pilih kalau memang cocok. 😉'
      : 'Lihat detail dan ulasan melalui tautan produk. Pertimbangkan untuk membeli jika memang sesuai kebutuhanmu.'
  const hook = hooks[tone] || hooks.playful
  const beats = [
    '[0–3 DETIK | HOOK] ' + hook,
    '[3–8 DETIK | MASALAH] ' + problem,
    '[8–15 DETIK | PERKENALAN] ' + bridge,
    '[15–23 DETIK | SOLUSI] ' + solution,
    '[TETAP TONTON | DETAIL PENTING] ' + factual,
    '[MENJELANG AKHIR | RETENSI] ' + retention,
    '[PENUTUP | AJAKAN] ' + benefit + ' ' + cta,
  ]
  const script = beats.join('\n\n')
  const caption = 'Sedang mencari ' + category.toLowerCase() + '? Kenali ' + name + ' sebelum memilih. Periksa detail, varian, dan ulasan agar sesuai kebutuhanmu. ✨\n\nCek produk melalui tautan/keranjang jika ingin tahu lebih lanjut.'
  const hashtags = '#affiliate #rekomendasiproduk #tipsbelanja #reviewproduk #racunbelanja'
  return { hook, script, caption, hashtags, duration: Number(duration) }
}

export default function ContentStudio({ user }) {
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [angle, setAngle] = useState('benefit')
  const [tone, setTone] = useState('playful')
  const [duration, setDuration] = useState('30')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
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

  async function generate() {
    if (!selected) { setError('Simpan produk terlebih dahulu di menu Riset Produk.'); return }
    setError('')
    setNotice('')
    setGenerating(true)
    try {
      // Free local template generator: does not call the OpenAI API.
      const draft = makeContent(selected, angle, duration, tone)
      setOutput(draft)
      setNotice('Draft konten berhasil dibuat dengan mode gratis. Periksa fakta produk sebelum dipublikasikan.')
    } catch (err) {
      setError(err.message || 'Terjadi kendala saat membuat draft konten.')
    } finally {
      setGenerating(false)
    }
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
        <button className="primary-button" onClick={generate} disabled={generating}>{generating ? <><RefreshCw size={15} className="spin"/> AI sedang menulis...</> : <><Sparkles size={15}/> Buat konten gratis</>}</button>
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
      <p className="content-disclaimer">Naskah dibuat dengan template gratis. Sesuaikan dengan fakta produk; jangan menambahkan klaim yang belum terbukti.</p>
    </div>}
  </div>
}
