## Dynamic QR Business Platform

İşletmeler (restoran, kafe, küçük dükkânlar) için dinamik QR kod, menü, kampanya ve link yönetimi sağlayan SaaS odaklı bir MVP.

### Özellikler

- **Auth**: E-posta + şifre ile kayıt/giriş, BUSINESS/ADMIN rol alanı (JWT tabanlı).
- **QR Yönetimi**: Menü, link, kampanya tiplerinde dinamik QR oluşturma; içerik veritabanından okunur.
- **Dinamik İçerik**: `/q/{qr_id}` (uuid) ile açılan mobil uyumlu public sayfa, basic offline-first cache.
- **Analytics**: Toplam / günlük tarama ve cihaz tipi (mobile/desktop) istatistikleri (PRO plan için).
- **Abonelik Mantığı**:
  - FREE: 1 QR, analytics yok, içerik düzenleme kapalı.
  - PRO: sınırsız QR, analytics ve içerik düzenleme açık.

### Teknolojiler

- **Frontend**: Next.js (App Router, TypeScript, Tailwind CSS).
- **Backend**: Node.js, Express, Prisma ORM.
- **Veritabanı**: PostgreSQL (Supabase - online) veya SQLite (lokal geliştirme için).
- **Auth**: JWT (Authorization: Bearer ...).
- **QR**: `qrcode` kütüphanesi (PNG/SVG data URL).

### Kurulum

#### Ortak

```bash
cd dynamic-qr-business-platform
```

#### Backend

**ÖNEMLİ:** Online veritabanı için `SETUP-ONLINE-DB.md` dosyasındaki talimatları takip et. Supabase (ücretsiz PostgreSQL) kullanarak online veritabanı kurabilirsin.

**Lokal SQLite için:**

1. `.env` dosyası oluştur (`backend` klasöründe):

```bash
cd backend
```

İçerik:

```bash
DATABASE_URL="file:./prisma/dev.db"
PORT=4000
JWT_SECRET="super-secret-key"
FRONTEND_ORIGIN="http://localhost:3000"
PUBLIC_QR_BASE_URL="http://localhost:3000"
```

2. Bağımlılıkları kur:

```bash
cd backend
npm install
```

3. Prisma migrate + seed (SQLite için):

```bash
export DATABASE_URL="file:./prisma/dev.db"
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

4. Backend’i çalıştır:

```bash
npm run dev
# http://localhost:4000
```

#### Frontend

1. Bağımlılıkları kur:

```bash
cd ../frontend
npm install
```

2. Ortam değişkeni (isteğe bağlı, default backend URL kullanılır):

`.env.local`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

3. Frontend’i çalıştır:

```bash
npm run dev
# http://localhost:3000
```

### Demo Kullanıcı

- **E-posta**: `demo@cafe.com`
- **Şifre**: `password123`

Seed sonrası bu kullanıcı PRO planda gelir ve örnek QR kayıtları oluşur:

- `demo-menu-qr` · Menü tipi
- `demo-link-qr` · Link tipi

### Akışlar

- **Auth**:
  - `POST /api/auth/register` → kullanıcı + FREE planlı business oluşturur.
  - `POST /api/auth/login` → JWT döner.
- **QR Yönetimi**:
  - `GET /api/qr` → işletmeye ait QR listesi.
  - `POST /api/qr` → FREE planda en fazla 1 QR; PRO’da sınırsız.
  - `PUT /api/qr/:id` → sadece PRO plan: içerik düzenleme.
- **Public & Analytics**:
  - `GET /api/public/qr/:uuid` → `/q/{uuid}` sayfasının çektiği içerik.
  - `POST /api/analytics/scan/:uuid` → her taramada çağrılır.
  - `GET /api/analytics/qr/:uuid` → PRO plan için analytics verisi.

### 🚀 Lokal Sunucuyu İnternete Açmak (Ngrok - En Kolay Yol)

QR'ların herkes tarafından erişilebilir olması için localhost'u internete açman gerekiyor. **Ngrok** ile 5 dakikada halledebilirsin:

#### 1. Ngrok'u İndir ve Kur
- https://ngrok.com/download adresinden Windows için ZIP'i indir
- Çıkar ve `ngrok.exe` dosyasını PATH'e ekle veya klasöre koy

#### 2. İki Terminal Aç ve Ngrok'u Başlat

**Terminal 1 (Frontend için):**
```bash
ngrok http 3000
```

**Terminal 2 (Backend için):**
```bash
ngrok http 4000
```

Her iki terminalde de ngrok sana bir URL verecek, örnek:
- Frontend: `https://abc123.ngrok-free.app`
- Backend: `https://xyz789.ngrok-free.app`

#### 3. Environment Dosyalarını Güncelle

**Backend `.env` dosyası** (`backend/.env`):
```bash
FRONTEND_ORIGIN=https://abc123.ngrok-free.app
PUBLIC_QR_BASE_URL=https://abc123.ngrok-free.app
PORT=4000
JWT_SECRET=super-secret-key
DATABASE_URL="file:./dev.db"
```

**Frontend `.env.local` dosyası** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=https://xyz789.ngrok-free.app/api
```

#### 4. Sunucuları Yeniden Başlat

Backend ve frontend'i durdurup tekrar başlat (ngrok URL'leri değişmediği sürece aynı kalır).

#### 5. Yeni QR Oluştur

Artık dashboard'dan oluşturduğun QR'lar **ngrok URL'ini** içerecek ve dünyanın her yerinden erişilebilir olacak!

> **Not:** Ngrok ücretsiz planında URL'ler her yeniden başlatmada değişir. Sabit URL için ücretli plan gerekir veya production'a deploy etmen gerekir.

### Geliştirmeye Açık Noktalar

- Gerçek ödeme entegrasyonu (Stripe vb.) ile plan yükseltme.
- QR tasarım özelleştirme (logo upload, renk paletleri, tema şablonları).
- Gelişmiş offline desteği (Service Worker, PWA).
- Rol bazlı çok kullanıcılı işletme ekip erişimi.


