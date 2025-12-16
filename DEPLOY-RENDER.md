# Render ile Deploy (Ücretsiz)

## 1. Backend (Render) - 3 dakika

1. **https://render.com** → Sign up / Login (GitHub ile)

2. **"New +"** → **"Web Service"**

3. **"Connect account"** → GitHub hesabını bağla

4. **Repository seç:**
   - `Arrakuro63-sys/dynamic-qr-business-platform` seç

5. **Service ayarları:**
   - **Name:** `dynamic-qr-backend`
   - **Region:** En yakın bölge (ör: Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ **ÖNEMLİ!**
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

6. **Plan:** **Free** seç (ücretsiz)

7. **Environment Variables ekle:**
   - **DATABASE_URL:** `postgresql://postgres.qwbzydgdcwbvijpnfkjx:recep6335@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require`
   - **PORT:** `10000` (Render free plan için)
   - **JWT_SECRET:** `super-secret-key-change-in-production` (veya daha güçlü bir şifre)
   - **FRONTEND_ORIGIN:** Frontend URL'ini buraya yaz (Vercel'den aldığın URL)
   - **PUBLIC_QR_BASE_URL:** Frontend URL'ini buraya yaz (Vercel'den aldığın URL)

8. **"Create Web Service"** butonuna tıkla

9. Deploy başlayacak (2-3 dakika sürebilir)

10. **Backend URL'ini not et** (örnek: `https://dynamic-qr-backend.onrender.com`)

---

## 2. Frontend Environment Variable'ı Güncelle

1. **Vercel Dashboard** → Projene git → **Settings** → **Environment Variables**

2. `NEXT_PUBLIC_API_URL` ekle/güncelle:
   - **Value:** `https://dynamic-qr-backend.onrender.com/api` (Render'dan aldığın backend URL + `/api`)

3. **Deployments** → En son deploy → **...** → **Redeploy**

---

## 3. Backend Environment Variables'ı Güncelle

Render Dashboard → Backend servisine git → **Environment** sekmesi:

- **FRONTEND_ORIGIN:** Vercel frontend URL'i (örnek: `https://dynamic-qr-frontend.vercel.app`)
- **PUBLIC_QR_BASE_URL:** Vercel frontend URL'i (örnek: `https://dynamic-qr-frontend.vercel.app`)

Değişikliklerden sonra **Manual Deploy** → **Deploy latest commit**

---

## 4. Test Et! 🎉

1. Frontend URL'ine git
2. Login ol veya kayıt ol
3. QR oluştur
4. **QR'ı telefonda okut → Artık herkeste çalışacak!**

---

## Notlar

- **Render Free Plan:** İlk deploy 2-3 dakika sürebilir, sonraki deploy'lar daha hızlı
- **Sleep Mode:** Free plan'da 15 dakika kullanılmazsa uyku moduna geçer, ilk istekte 30-60 saniye uyanır
- **Backend URL:** Render free plan'da URL şu formatta: `https://dynamic-qr-backend.onrender.com`

