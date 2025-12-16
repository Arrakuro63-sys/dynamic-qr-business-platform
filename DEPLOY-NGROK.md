# Ngrok ile localhost'u internete açmak için:

1. Ngrok'u indir: https://ngrok.com/download
2. Ngrok'u PATH'e ekle veya direkt çalıştır

3. İki terminal aç:
   Terminal 1 (Frontend): ngrok http 3000
   Terminal 2 (Backend): ngrok http 4000

4. Ngrok'tan aldığın URL'leri .env dosyalarına yaz
