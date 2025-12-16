# Online Veritabanı Kurulumu (Supabase)

## 1. Supabase Hesabı Oluştur

1. https://supabase.com adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap (veya e-posta ile kayıt ol)
4. "New Project" butonuna tıkla

## 2. Proje Oluştur

- **Name**: `dynamic-qr-platform` (veya istediğin isim)
- **Database Password**: Güçlü bir şifre belirle (not al, kaybetme!)
- **Region**: En yakın bölgeyi seç (ör: `West US (North California)`)
- "Create new project" butonuna tıkla
- Proje oluşturulması 1-2 dakika sürebilir

## 3. Connection String'i Al

1. Supabase Dashboard'da projene gir
2. Sol menüden **Settings** (⚙️) > **Database** seç
3. **Connection string** bölümüne git
4. **URI** sekmesini seç
5. Connection string'i kopyala, şu formatta olacak:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

## 4. Backend .env Dosyasını Güncelle

`backend/.env` dosyasını aç ve `DATABASE_URL` değerini Supabase connection string ile değiştir:

```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
PORT=4000
JWT_SECRET="super-secret-key-change-in-production"
FRONTEND_ORIGIN="http://localhost:3000"
PUBLIC_QR_BASE_URL="http://localhost:3000"
```

**ÖNEMLİ:** `[YOUR-PASSWORD]` kısmını kendi şifrenle değiştir, `[PROJECT-REF]` kısmını da Supabase'den aldığın değerle değiştir.

## 5. Prisma Migrate ve Seed

Backend klasöründe:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

## 6. Backend'i Yeniden Başlat

```bash
npm run dev
```

Artık veritabanın online! Tüm QR'lar ve kullanıcılar Supabase'de saklanacak.

## QR'ların Herkeste Çalışması İçin

QR'ların dünyanın her yerinden erişilebilir olması için frontend ve backend'i online'a deploy etmen gerekiyor:

### Seçenek 1: Vercel (Frontend) + Railway (Backend)
- Frontend: Vercel'e deploy et → `https://qr-platform.vercel.app`
- Backend: Railway'e deploy et → `https://qr-api.railway.app`
- `.env` dosyalarını production URL'leri ile güncelle

### Seçenek 2: Ngrok (Hızlı Test)
- Frontend ve backend için ngrok tünelleri aç
- URL'leri `.env` dosyalarına yaz
- **Not:** Ngrok ücretsiz planında URL'ler her yeniden başlatmada değişir

