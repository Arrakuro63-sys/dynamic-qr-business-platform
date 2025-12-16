@echo off
echo ========================================
echo Ngrok ile Frontend ve Backend'i internete acma
echo ========================================
echo.
echo 1. Bu dosyayi calistirdiktan sonra iki ayri terminal ac
echo 2. Terminal 1'de: ngrok http 3000
echo 3. Terminal 2'de: ngrok http 4000
echo.
echo Ngrok'tan alacagin URL'leri asagidaki .env dosyalarina yaz:
echo   - backend/.env -> PUBLIC_QR_BASE_URL ve FRONTEND_ORIGIN
echo   - frontend/.env.local -> NEXT_PUBLIC_API_URL
echo.
pause

