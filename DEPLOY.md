# Deploy Talimatları

## 1. Frontend (Vercel) - 5 dakika

### Vercel CLI ile:

1. Vercel CLI kur:
```bash
npm i -g vercel
```

2. Frontend klasörüne git:
```bash
cd frontend
```

3. Vercel'e login ol:
```bash
vercel login
```

4. Deploy et:
```bash
vercel
```

Sorular soracak:
- **Link to existing project?** → `No`
- **Project name?** → `dynamic-qr-frontend` (veya istediğin isim)
- **Directory?** → `./` (boş bırak, zaten frontend klasöründesin)

5. Environment variable ekle:
Deploy bittikten sonra Vercel Dashboard'a git:
- Project Settings → Environment Variables
- `NEXT_PUBLIC_API_URL` ekle (değerini backend URL'inden sonra alacağız)

6. Frontend URL'ini not et (örnek: `https://dynamic-qr-frontend.vercel.app`)

---

## 2. Backend (Railway) - 5 dakika

### Railway CLI ile:

1. Railway CLI kur:
```bash
npm i -g @railway/cli
```

2. Railway'e login ol:
```bash
railway login
```

3. Backend klasörüne git:
```bash
cd backend
```

4. Yeni proje oluştur:
```bash
railway init
```
- **Project name?** → `dynamic-qr-backend` (veya istediğin isim)

5. Environment variables ekle (Railway Dashboard'dan):
Railway Dashboard → Project → Variables sekmesi:

```
DATABASE_URL=postgresql://postgres.qwbzydgdcwbvijpnfkjx:recep6335@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
PORT=4000
JWT_SECRET=super-secret-key-change-in-production
FRONTEND_ORIGIN=https://dynamic-qr-frontend.vercel.app
PUBLIC_QR_BASE_URL=https://dynamic-qr-frontend.vercel.app
```

**ÖNEMLİ:** `FRONTEND_ORIGIN` ve `PUBLIC_QR_BASE_URL` değerlerini Vercel'den aldığın frontend URL'i ile değiştir!

6. Deploy et:
```bash
railway up
```

7. Backend URL'ini not et (Railway Dashboard → Settings → Domains)

---

## 3. Frontend Environment Variable'ı Güncelle

Vercel Dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` değerini Railway'den aldığın backend URL'i ile güncelle (sonuna `/api` ekle)
- Örnek: `https://dynamic-qr-backend.railway.app/api`

Vercel'de **Redeploy** yap (Deployments → En son deploy → ... → Redeploy)

---

## 4. Test Et

1. Frontend URL'ine git (örnek: `https://dynamic-qr-frontend.vercel.app`)
2. Login ol veya kayıt ol
3. QR oluştur
4. QR'ı telefonda okut → Artık herkeste çalışacak!

---

## Alternatif: Render (Backend için)

Railway yerine Render kullanmak istersen:

1. https://render.com → Sign up
2. New → Web Service
3. GitHub repo'yu bağla (veya direkt deploy)
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Environment Variables ekle (yukarıdaki gibi)
6. Deploy

Render backend URL'ini al ve frontend `.env` dosyasını güncelle.

