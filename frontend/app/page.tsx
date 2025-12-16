import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Dynamic QR Business Platform
          </h1>
          <p className="text-slate-300 max-w-xl">
            Restoran, kafe ve küçük işletmeler için{" "}
            <span className="font-semibold">dinamik QR</span> menü, kampanya ve
            link yönetimi. İçeriği istediğiniz an güncelleyin, yeniden baskı
            yok.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
            <h2 className="font-medium mb-2">Dinamik QR Kodlar</h2>
            <p className="text-sm text-slate-300">
              Tek bir QR ile menü, kampanya ya da çoklu link yönlendirme
              oluşturun.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
            <h2 className="font-medium mb-2">Basit Analytics</h2>
            <p className="text-sm text-slate-300">
              Toplam ve günlük tarama sayıları, cihaz tipi kırılımı ile
              performansı takip edin.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
            <h2 className="font-medium mb-2">İşletme Odaklı UX</h2>
            <p className="text-sm text-slate-300">
              Teknik olmayan kullanıcılar için sade dashboard ve mobil uyumlu
              QR sayfaları.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition"
          >
            Dashboard&apos;a git
          </Link>
          <div className="flex gap-2 text-sm text-slate-300 items-center">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              Ücretsiz plan: 1 QR
            </span>
            <span className="hidden sm:inline">·</span>
            <span>PRO: sınırsız QR, analytics, dinamik içerik</span>
          </div>
        </div>
      </div>
    </main>
  );
}
