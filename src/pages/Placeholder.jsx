import { ArrowLeft, Sparkles } from 'lucide-react'
const info = {
  research: ['Riset Produk', 'Temukan produk potensial dan pahami sudut promosi yang paling menarik.', 'Input link produk, foto, atau detail produk akan tersedia di tahap berikutnya.'],
  content: ['Studio Konten AI', 'Ubah informasi produk menjadi konsep video promosi.', 'Generator hook, naskah, storyboard, voice-over, caption, dan prompt visual akan dibangun pada tahap AI Content Factory.'],
  campaigns: ['Kampanye', 'Simpan dan kelola semua pekerjaan promosi berdasarkan produk.', 'Daftar kampanye dan status konten akan dihubungkan ke database pada tahap berikutnya.'],
  analytics: ['Analitik Affiliate', 'Pantau klik, pesanan, konversi, dan komisi.', 'Data awal akan dapat dicatat manual sebelum integrasi resmi marketplace tersedia.'],
  assistant: ['Asisten AI', 'Asisten untuk membantu keputusan dan pekerjaan affiliate.', 'Asisten akan menggunakan konteks produk dan kampanye yang tersimpan setelah integrasi AI dibangun.'],
  settings: ['Pengaturan', 'Atur preferensi dan koneksi aplikasi.', 'Pengaturan akun, penyimpanan, dan koneksi layanan akan ditambahkan bertahap.'],
}
export default function Placeholder({ page, setPage }) {
  const [title, desc, detail] = info[page] || info.research
  return <div className="placeholder-wrap"><div className="placeholder-card"><div className="placeholder-icon"><Sparkles size={26}/></div><div className="eyebrow">MODUL AI AFFILIATE STUDIO</div><h1>{title}</h1><p>{desc}</p><div className="coming-box"><b>Modul dalam tahap pembangunan</b><span>{detail}</span></div><button className="secondary-button" onClick={() => setPage('dashboard')}><ArrowLeft size={16}/> Kembali ke Dashboard</button></div></div>
}
