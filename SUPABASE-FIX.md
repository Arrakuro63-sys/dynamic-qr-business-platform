# Supabase Bağlantı Sorunu Çözümü

Veritabanına bağlanamıyorsan, Supabase'de şu ayarları kontrol et:

## 1. IP Whitelist Ayarları

1. Supabase Dashboard → **Settings** → **Database**
2. **Connection pooling** bölümüne git
3. **Allowed IP addresses** kısmında:
   - "Allow connections from anywhere" seçeneğini aktif et
   - VEYA IP adresini manuel ekle: `0.0.0.0/0` (tüm IP'ler için)

## 2. Connection String Formatı

Supabase'den aldığın connection string şu formatta olmalı:

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

Senin connection string'in:
```
postgresql://postgres:recep6335@db.qwbzydgdcwbvijpnfkjx.supabase.co:5432/postgres?sslmode=require
```

Bu doğru görünüyor. Eğer hala bağlanamıyorsan:

## 3. Alternatif: Transaction Pooler Kullan

Supabase Dashboard → Settings → Database → Connection string → **Transaction** sekmesini seç

Connection string şu formatta olacak:
```
postgresql://postgres.qwbzydgdcwbvijpnfkjx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

Bu connection string'i `backend/.env` dosyasındaki `DATABASE_URL` ile değiştir.

## 4. Test Et

```bash
cd backend
npx prisma migrate dev --name init
```

Başarılı olursa, seed çalıştır:
```bash
npx ts-node prisma/seed.ts
```

