import { useEffect, useState } from 'react'
import { Bot, Send, Lightbulb } from 'lucide-react'
import { supabase } from '../lib/supabase'

const replies = [
  { test: /caption|konten|video|hook|naskah/i, answer: 'Untuk konten yang lebih meyakinkan, mulai dengan masalah yang dekat dengan audiens, jelaskan satu fungsi produk berdasarkan informasi yang benar, lalu tutup dengan ajakan untuk memeriksa detail produk. Hindari klaim yang belum terbukti.' },
  { test: /produk|pilih|riset|jual/i, answer: 'Saat memilih produk, periksa kebutuhan pasar, kualitas informasi di halaman produk, ulasan pembeli, harga dan komisi yang tercantum, serta apakah produk cocok dengan audiensmu. Jangan hanya mengikuti tren.' },
  { test: /komisi|klik|pesanan|konversi/i, answer: 'Pantau klik, pesanan, nilai penjualan, dan komisi secara terpisah. Jika klik tinggi tetapi pesanan rendah, evaluasi kecocokan audiens, kejelasan konten, dan halaman produk. Bandingkan data dalam rentang tanggal yang sama.' },
  { test: /kampanye|jadwal|promosi/i, answer: 'Buat satu tujuan untuk setiap kampanye, pilih produk dan format konten, tetapkan tanggal tayang, lalu catat statusnya. Setelah tayang, masukkan hasilnya ke Analitik Affiliate agar bisa dievaluasi.' },
]
export default function AssistantPage({ user }) {
  const [products, setProducts] = useState([])
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([{ role:'assistant', text:'Halo! Aku Asisten Affiliate versi gratis. Aku bisa membantu dengan panduan produk, ide konten, kampanye, dan membaca metrik yang kamu catat. Tanyakan apa yang sedang kamu kerjakan.' }])
  useEffect(() => { supabase.from('products').select('name,platform,category').eq('user_id',user.id).then(({data})=>setProducts(data||[])) }, [user.id])
  function send(e) {
    e.preventDefault()
    const q = question.trim()
    if (!q) return
    const match = replies.find(item=>item.test.test(q))
    const productList = products.length ? '\n\nProduk tersimpan: ' + products.slice(0,5).map(p=>p.name+' ('+p.platform+')').join(', ') + (products.length>5?' dan lainnya.':'.') : ''
    const answer = (match?.answer || 'Coba pecah pekerjaan affiliate menjadi langkah kecil: tentukan tujuan, pilih produk yang relevan, buat konten berdasarkan fakta produk, publikasikan, lalu evaluasi hasilnya. Aku belum terhubung ke model AI berbayar, jadi jawabanku memakai panduan praktis yang tersedia.') + productList
    setMessages(current=>[...current,{role:'user',text:q},{role:'assistant',text:answer}])
    setQuestion('')
  }
  return <div className="page-stack">
    <section className="products-heading"><div><div className="eyebrow">PENDAMPING AFFILIATE GRATIS</div><h1>Asisten Affiliate</h1><p>Panduan praktis tanpa API berbayar untuk membantu pekerjaan affiliate sehari-hari.</p></div></section>
    <section className="panel" style={{padding:20}}>
      <div className="panel-heading"><div><h3><Bot size={16}/> Percakapan</h3><p>Mode panduan gratis · bukan model AI generatif</p></div></div>
      <div style={{display:'grid',gap:12,maxHeight:420,overflowY:'auto',padding:'8px 0'}}>
        {messages.map((m,i)=><div key={i} style={{justifySelf:m.role==='user'?'end':'start',maxWidth:'90%',padding:12,borderRadius:12,background:m.role==='user'?'var(--accent, #eee)':'var(--surface, #f5f5f5)',whiteSpace:'pre-wrap'}}><b>{m.role==='user'?'Kamu':'Asisten'}</b><div>{m.text}</div></div>)}
      </div>
      <form onSubmit={send} style={{display:'flex',gap:8,marginTop:14}}><input style={{flex:1,minWidth:0}} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Contoh: bagaimana membuat hook video?" /><button className="primary-button" disabled={!question.trim()}><Send size={15}/> Kirim</button></form>
    </section>
    <section className="panel" style={{padding:18}}><h3><Lightbulb size={16}/> Topik yang bisa ditanyakan</h3><p>Ide hook dan caption · memilih produk · memahami klik dan konversi · menyusun jadwal kampanye.</p></section>
  </div>
}
