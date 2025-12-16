# GitHub'a Yükleme

## 1. GitHub'da Repo Oluştur

1. **https://github.com** → Login ol
2. **"New repository"** butonuna tıkla
3. **Repository name:** `dynamic-qr-business-platform` (veya istediğin isim)
4. **Description:** "Dynamic QR Business Platform - SaaS MVP"
5. **Public** veya **Private** seç (öneri: Private)
6. **"Create repository"** butonuna tıkla

## 2. Local Repo'yu GitHub'a Bağla

Terminalde (proje klasöründe):

```bash
cd "C:\Users\recep\OneDrive\Desktop\dynamic-qr-business-platform"

# GitHub'dan aldığın repo URL'ini kullan (örnek: https://github.com/kullaniciadi/dynamic-qr-business-platform.git)
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git

# Branch'i main yap
git branch -M main

# Push et
git push -u origin main
```

**ÖNEMLİ:** `KULLANICI_ADI` ve `REPO_ADI` kısımlarını kendi GitHub bilgilerinle değiştir!

## 3. GitHub URL'ini Ver

Repo oluşturduktan sonra GitHub'dan aldığın URL'i bana ver, ben push komutunu hazırlayayım.

---

## Alternatif: GitHub CLI ile

Eğer GitHub CLI kuruluysa:

```bash
cd "C:\Users\recep\OneDrive\Desktop\dynamic-qr-business-platform"
gh repo create dynamic-qr-business-platform --private --source=. --remote=origin --push
```

