const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Metode tidak diizinkan.' })
  }

  const authorization = event.headers.authorization || event.headers.Authorization || ''
  const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!accessToken) return json(401, { error: 'Silakan masuk kembali ke akun kamu.' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return json(500, { error: 'Konfigurasi Supabase untuk fungsi AI belum lengkap.' })
  }
  if (!openaiKey) {
    return json(503, { error: 'AI belum diaktifkan. OPENAI_API_KEY perlu ditambahkan di pengaturan environment Netlify.' })
  }

  try {
    const authResponse = await fetch(supabaseUrl + '/auth/v1/user', {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: 'Bearer ' + accessToken,
      },
    })
    if (!authResponse.ok) return json(401, { error: 'Sesi akun tidak valid. Silakan masuk kembali.' })

    const payload = JSON.parse(event.body || '{}')
    const product = payload.product || {}
    const name = String(product.name || '').trim().slice(0, 160)
    if (!name) return json(400, { error: 'Pilih produk terlebih dahulu.' })

    const category = String(product.category || '').slice(0, 120)
    const notes = String(product.notes || '').slice(0, 1200)
    const platform = String(product.platform || '').slice(0, 80)
    const angle = String(payload.angle || 'benefit')
    const tone = String(payload.tone || 'playful')
    const duration = [15, 30, 60].includes(Number(payload.duration)) ? Number(payload.duration) : 30

    const prompt = `Kamu adalah creative director dan affiliate content strategist berpengalaman untuk pasar Indonesia, terutama video TikTok, Shopee Video, dan Reels.

Buat satu paket konten affiliate yang terasa seperti kreator manusia sedang bercerita kepada teman, bukan membaca katalog atau brosur.

DATA PRODUK:
Nama: ${name}
Kategori: ${category || 'Tidak disebutkan'}
Platform: ${platform || 'Tidak disebutkan'}
Catatan/fakta produk dari pengguna: ${notes || 'Tidak ada catatan tambahan'}

ARAH KONTEN:
Sudut promosi: ${angle}
Gaya bahasa: ${tone}
Durasi video: ${duration} detik

ATURAN WAJIB:
- Gunakan bahasa Indonesia sehari-hari yang luwes, spesifik, segar, dan enak diucapkan.
- Buat hook yang kuat dalam 1-2 kalimat pertama; jangan membuka dengan kalimat generik seperti "Kenalan dengan..." atau "Lagi cari...".
- Naskah harus punya alur: hook, situasi/cerita yang relatable, pengenalan produk secara natural, lalu ajakan ringan.
- Sesuaikan pendekatan dengan kategori produk. Jangan memakai lelucon rambut untuk produk elektronik, dan jangan memakai gaya kecantikan untuk kategori lain.
- Gaya "playful": jenaka, sedikit usil, ekspresif, tetap cerdas dan tidak norak.
- Gaya "soft": hangat, seperti berbagi rekomendasi ke teman, tanpa memaksa.
- Gaya "honest": transparan, tidak berpura-pura sudah mencoba produk dan tidak mengarang pengalaman pribadi.
- Gaya "hard": persuasif dan langsung, tetapi tidak menipu atau menekan.
- Jangan menyebut harga, nominal, diskon, atau membuat klaim bahwa produk pasti murah.
- Jangan mengarang fitur, bahan, kandungan, manfaat, hasil, testimoni, sertifikasi, atau pengalaman memakai produk. Jika data tidak tersedia, fokus pada ajakan memeriksa detail produk.
- Untuk kesehatan, kecantikan, makanan, dan produk sensitif, hindari janji hasil pasti atau klaim medis.
- Hindari kalimat berulang, filler, dan daftar spesifikasi yang kaku.
- Caption harus menarik dan berbeda dari naskah, ditutup CTA natural.
- Hashtag relevan dengan kategori, jangan hanya menumpuk hashtag umum.
- Keluarkan JSON valid saja tanpa markdown, dengan bentuk tepat:
{"hook":"...","script":"...","caption":"...","hashtags":"#tag1 #tag2"}
`

    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + openaiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.5',
        input: prompt,
        max_output_tokens: 1100,
      }),
    })

    const aiData = await aiResponse.json()
    if (!aiResponse.ok) {
      const message = aiData?.error?.message || 'Layanan AI sedang tidak dapat digunakan.'
      return json(aiResponse.status === 429 ? 429 : 502, { error: message })
    }

    const text = aiData.output_text || (aiData.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === 'output_text')
      .map(part => part.text)
      .join('')

    const cleaned = text.trim().replace(/^\x60\x60\x60(?:json)?\s*/i, '').replace(/\s*\x60\x60\x60$/, '')
    const result = JSON.parse(cleaned)
    if (!result.hook || !result.script || !result.caption || !result.hashtags) {
      return json(502, { error: 'Hasil AI belum lengkap. Silakan coba sekali lagi.' })
    }

    return json(200, {
      hook: String(result.hook),
      script: String(result.script),
      caption: String(result.caption),
      hashtags: String(result.hashtags),
      duration,
    })
  } catch (error) {
    return json(500, { error: 'Terjadi kendala saat membuat konten. Coba lagi sebentar.' })
  }
}
