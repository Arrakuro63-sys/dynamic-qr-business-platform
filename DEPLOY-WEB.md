# Web Arayüzü ile Deploy (5 Dakika)

## 1. Frontend (Vercel) - 2 dakika

1. **https://vercel.com** → Sign up / Login (GitHub ile)

2. **"Add New Project"** butonuna tıkla

3. **Import Git Repository:**
   - Eğer GitHub'da yoksa: Projeyi GitHub'a push et
   - Veya: **"Deploy without Git"** seçeneğini kullan

4. **"Deploy without Git" için:**
   - **Project Name:** `dynamic-qr-frontend`
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` (önemli!)
   - **Build Command:** (otomatik)
   - **Output Directory:** `.next` (otomatik)

5. **Environment Variables ekle:**
   - Project Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` → Şimdilik boş bırak, backend URL'ini aldıktan sonra ekleyeceğiz

6. **Deploy** butonuna tıkla

7. **Frontend URL'ini not et** (örnek: `https://dynamic-qr-frontend.vercel.app`)

---

## 2. Backend (Railway) - 3 dakika

1. **https://railway.app** → Sign up / Login (GitHub ile)

2. **"New Project"** → **"Deploy from GitHub repo"** (veya "Empty Project")

3. **GitHub repo'yu seç** (veya "Empty Project" seç)

4. **"New"** → **"Service"** → **"GitHub Repo"** (veya "Empty Service")

5. **Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

6. **Variables sekmesi → Environment Variables ekle:**
   ```
   DATABASE_URL=postgresql://postgres.qwbzydgdcwbvijpnfkjx:recep6335@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
   PORT=4000
   JWT_SECRET=super-secret-key-change-in-production
   FRONTEND_ORIGIN=https://dynamic-qr-frontend.vercel.app
   PUBLIC_QR_BASE_URL=https://dynamic-qr-frontend.vercel.app
   ```
   **ÖNEMLİ:** `FRONTEND_ORIGIN` ve `PUBLIC_QR_BASE_URL` değerlerini Vercel'den aldığın frontend URL'i ile değiştir!

7. **Settings → Generate Domain** → Backend URL'ini not et (örnek: `https://dynamic-qr-backend.railway.app`)

8. Deploy otomatik başlayacak (1-2 dakika)

---

## 3. Frontend Environment Variable'ı Güncelle

1. **Vercel Dashboard** → Projene git → **Settings** → **Environment Variables**

2. `NEXT_PUBLIC_API_URL` ekle:
   - **Value:** `https://dynamic-qr-backend.railway.app/api` (Railway'den aldığın backend URL + `/api`)

3. **Deployments** → En son deploy → **...** → **Redeploy**

---

## 4. Test Et! 🎉

1. Frontend URL'ine git (örnek: `https://dynamic-qr-frontend.vercel.app`)
2. Login ol veya kayıt ol
3. QR oluştur
4. **QR'ı telefonda okut → Artık herkeste çalışacak!**

---

## Alternatif: Render (Backend için)

Railway yerine Render kullanmak istersen:

1. **https://render.com** → Sign up
2. **New +** → **Web Service**
3. GitHub repo'yu bağla
4. **Settings:**
   - **Name:** `dynamic-qr-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. **Environment Variables** ekle (yukarıdaki gibi)
6. **Create Web Service**
7. Render backend URL'ini al ve frontend `.env` dosyasını güncelle

