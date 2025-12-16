"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type QrType = "MENU" | "LINK" | "CAMPAIGN";

interface QrCode {
  id: number;
  uuid: string;
  title: string;
  type: QrType;
  config: string;
  svgData?: string | null;
  pngData?: string | null;
  color?: string | null;
  logoUrl?: string | null;
  scans: { id: number }[];
  createdAt: string;
}

interface Analytics {
  total: number;
  daily: { day: string; count: number }[];
  byDevice: { device: string; _count: { device: number } }[];
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("dqrb_token");
}

export default function DashboardPage() {
  const router = useRouter();
  const [qrs, setQrs] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQr, setSelectedQr] = useState<QrCode | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // Yeni: 2 panel - "create" ve "manage"
  const [activePanel, setActivePanel] = useState<"create" | "manage">("create");

  // QR oluşturma sihirbazı state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetUrl, setTargetUrl] = useState("");
  const [withLogo, setWithLogo] = useState<"yes" | "no" | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdQr, setCreatedQr] = useState<QrCode | null>(null);
  const [paymentName, setPaymentName] = useState("");
  const [paymentCard, setPaymentCard] = useState("");
  const [paymentCvc, setPaymentCvc] = useState("");
  const [paymentExp, setPaymentExp] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchQrs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchQrs() {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/qr`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "QR listesi alınamadı");
      }
      const data = await res.json();
      setQrs(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  // Adım adım QR oluşturma (sadece LINK tipi için)
  async function handleCreateLinkQr() {
    if (!targetUrl) {
      alert("Lütfen QR okutulunca açılacak linki girin.");
      return;
    }

    if (withLogo === null) {
      alert("Lütfen logolu olup olmayacağını seçin.");
      return;
    }

    if (withLogo === "yes" && !logoUrl) {
      alert("Logo kullanılacaksa logo URL'ini girmeniz gerekiyor.");
      return;
    }

    if (!paymentName || !paymentCard || !paymentCvc || !paymentExp) {
      alert("Ödeme bilgilerini doldurun (mock).");
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          title: "Link QR",
          type: "LINK" as QrType,
          config: { url: targetUrl },
          logoUrl: withLogo === "yes" ? logoUrl : undefined,
        }),
      });
      const data: QrCode = await res.json();
      if (!res.ok) {
        throw new Error((data as any).message || "QR oluşturulamadı");
      }
      setCreatedQr(data);
      await fetchQrs();
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setCreating(false);
    }
  }

  async function loadAnalytics(qr: QrCode) {
    setSelectedQr(qr);
    setAnalytics(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/analytics/qr/${qr.uuid}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Analytics alınamadı");
      }
      setAnalytics(data);
    } catch (err: any) {
      alert(err.message || "Analytics alınamadı (muhtemelen FREE plandasınız).");
    }
  }

  function logout() {
    window.localStorage.removeItem("dqrb_token");
    router.push("/login");
  }

  const totalScans = useMemo(
    () => analytics?.total ?? selectedQr?.scans.length ?? 0,
    [analytics, selectedQr]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">
              Dynamic QR Business Platform
            </h1>
            <p className="text-xs text-slate-400">
              Dashboard · QR yönetimi ve analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/q/demo-menu-qr")}
              className="hidden sm:inline-flex text-xs px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-900"
            >
              Demo menüyü gör
            </button>
            <button
              onClick={logout}
              className="text-xs px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-900"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* 2 panel: 1- QR Oluşturma, 2- QR Düzenleme & Analiz */}
        <section className="flex gap-2">
          <button
            onClick={() => setActivePanel("create")}
            className={`px-3 py-1 rounded-full text-xs border ${
              activePanel === "create"
                ? "border-emerald-500 bg-slate-900 text-emerald-300"
                : "border-slate-700 bg-slate-900/40 text-slate-300"
            }`}
          >
            1. QR Oluşturma
          </button>
          <button
            onClick={() => setActivePanel("manage")}
            className={`px-3 py-1 rounded-full text-xs border ${
              activePanel === "manage"
                ? "border-emerald-500 bg-slate-900 text-emerald-300"
                : "border-slate-700 bg-slate-900/40 text-slate-300"
            }`}
          >
            2. QR Düzenleme & Analiz
          </button>
        </section>

        {activePanel === "create" && (
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-4">
            <div>
              <h2 className="text-sm font-medium">Adım adım Link QR oluştur</h2>
              <p className="text-xs text-slate-400">
                QR okutulunca açılacak linki belirleyin, isterseniz logo ekleyin
                ve aylık 299,00 TL ücretle aktif edin. Faturalama her ayın 01
                tarihinde yapılır (mock).
              </p>
            </div>

            {/* Adım göstergesi */}
            <div className="flex gap-2 text-[11px]">
              <span
                className={`px-2 py-1 rounded-full border ${
                  step === 1
                    ? "border-emerald-500 bg-slate-950 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                1. Link
              </span>
              <span
                className={`px-2 py-1 rounded-full border ${
                  step === 2
                    ? "border-emerald-500 bg-slate-950 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                2. Logo
              </span>
              <span
                className={`px-2 py-1 rounded-full border ${
                  step === 3
                    ? "border-emerald-500 bg-slate-950 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                3. Ödeme & İndir
              </span>
            </div>

            {step === 1 && (
              <div className="space-y-3">
                <label className="text-xs font-medium">
                  1. QR okutulunca açılacak link
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-500 text-slate-950"
                  >
                    Devam et
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <label className="text-xs font-medium">
                  2. QR&apos;ın ortasında logo bulunsun mu?
                </label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setWithLogo("yes")}
                    className={`px-3 py-1 rounded-full border ${
                      withLogo === "yes"
                        ? "border-emerald-500 bg-slate-950 text-emerald-300"
                        : "border-slate-700"
                    }`}
                  >
                    Evet, logo olsun
                  </button>
                  <button
                    onClick={() => setWithLogo("no")}
                    className={`px-3 py-1 rounded-full border ${
                      withLogo === "no"
                        ? "border-emerald-500 bg-slate-950 text-emerald-300"
                        : "border-slate-700"
                    }`}
                  >
                    Hayır
                  </button>
                </div>
                {withLogo === "yes" && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">
                      Logo PNG URL&apos;ini girin (CDN veya web sitenizden).
                    </p>
                    <input
                      type="url"
                      placeholder="https://...logo.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <button
                    onClick={() => setStep(1)}
                    className="px-3 py-1 rounded-full border border-slate-700"
                  >
                    Geri
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950"
                  >
                    Ödeme adımına geç
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">3. Ödeme</h3>
                  <p className="text-xs text-slate-400">
                    Bu MVP&apos;de ödeme sadece simüle edilmektedir. Her aktif
                    QR için aylık 299,00 TL varsayılır ve faturalama ayın 01
                    tarihinde kabul edilir.
                  </p>
                </div>
                <div className="grid gap-2 text-xs">
                  <input
                    placeholder="Kart üzerindeki isim"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    placeholder="Kart numarası"
                    value={paymentCard}
                    onChange={(e) => setPaymentCard(e.target.value)}
                    className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="SKT (AA/YY)"
                      value={paymentExp}
                      onChange={(e) => setPaymentExp(e.target.value)}
                      className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      placeholder="CVC"
                      value={paymentCvc}
                      onChange={(e) => setPaymentCvc(e.target.value)}
                      className="w-20 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <button
                    onClick={() => setStep(2)}
                    className="px-3 py-1 rounded-full border border-slate-700"
                  >
                    Geri
                  </button>
                  <button
                    onClick={handleCreateLinkQr}
                    disabled={creating}
                    className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-medium disabled:opacity-60"
                  >
                    {creating
                      ? "Ödeme alınıyor..."
                      : "Ödemeyi yap ve QR oluştur (299,00 TL/ay)"}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-400">
                    {error}
                  </p>
                )}

                {createdQr && (
                  <div className="mt-3 border-t border-slate-800 pt-3 space-y-3 text-xs">
                    <p className="text-slate-300">
                      QR başarıyla oluşturuldu. Aşağıda önizleyebilir ve PNG
                      olarak indirebilirsiniz.
                    </p>
                    {createdQr.pngData && (
                      <div className="space-y-2">
                        <div className="inline-flex items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 p-3">
                          <img
                            src={createdQr.pngData}
                            alt="QR önizleme"
                            className="w-40 h-40 object-contain"
                          />
                        </div>
                        <a
                          href={createdQr.pngData}
                          download={`qr-${createdQr.uuid}.png`}
                          className="inline-flex px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800"
                        >
                          QR'ı PNG olarak indir
                        </a>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500">
                      Daha gelişmiş ödeme ve faturalama akışı gerçek entegrasyon
                      ile eklenebilir.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activePanel === "manage" && (
          <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl bg-slate-900/70 border border-slate-800 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">QR Listesi</h3>
              {loading && (
                <span className="text-xs text-slate-400">Yükleniyor...</span>
              )}
            </div>
            <div className="space-y-2 max-h-[380px] overflow-auto pr-1">
              {qrs.map((qr) => (
                <button
                  key={qr.id}
                  onClick={() => loadAnalytics(qr)}
                  className={`w-full text-left rounded-xl px-3 py-2 text-xs border ${
                    selectedQr?.id === qr.id
                      ? "border-emerald-500 bg-slate-950"
                      : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{qr.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {qr.type} · {qr.uuid}
                      </span>
                    </div>
                    <div className="text-right text-[10px] text-slate-300">
                      <div>{qr.scans.length} tarama</div>
                      <a
                        href={`/q/${qr.uuid}`}
                        target="_blank"
                        className="underline underline-offset-2"
                      >
                        QR sayfası
                      </a>
                    </div>
                  </div>
                </button>
              ))}
              {!loading && qrs.length === 0 && (
                <p className="text-xs text-slate-400">
                  Henüz QR oluşturmadınız. 'QR Oluşturma' panelinden başlayın.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 text-xs space-y-2">
              <h3 className="text-sm font-medium mb-1">Analytics Özeti</h3>
              {selectedQr ? (
                <>
                  <p className="text-slate-300">{selectedQr.title}</p>
                  <p className="text-slate-400">
                    Toplam tarama:{" "}
                    <span className="font-semibold">{totalScans}</span>
                  </p>
                  {analytics?.daily && analytics.daily.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] text-slate-400">
                        Son günler (en fazla 30)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {analytics.daily.map((d) => (
                          <span
                            key={d.day}
                            className="px-2 py-1 rounded-full bg-slate-950 border border-slate-800"
                          >
                            {d.day}: {d.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analytics?.byDevice && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] text-slate-400">Cihaz tipi</p>
                      <div className="flex flex-wrap gap-1">
                        {analytics.byDevice.map((d) => (
                          <span
                            key={d.device}
                            className="px-2 py-1 rounded-full bg-slate-950 border border-slate-800"
                          >
                            {d.device}: {d._count.device}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-400">
                  Detay görmek için soldan bir QR seçin. Analytics sadece PRO
                  plan için aktiftir.
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 text-xs space-y-2">
              <h3 className="text-sm font-medium mb-1">Planlar</h3>
              <p className="text-slate-300">
                <span className="font-semibold">FREE</span>: 1 QR, analytics
                yok, içerik düzenleme kapalı.
              </p>
              <p className="text-slate-300">
                <span className="font-semibold">PRO</span>: sınırsız QR,
                analytics ve dinamik içerik düzenleme.
              </p>
              <p className="text-[11px] text-slate-500">
                Ödeme entegrasyonu bu MVP&apos;de mock olarak düşünülmüştür;
                backend tarafında plan alanı üzerinden kontrol ediliyor.
              </p>
            </div>
          </div>
          </section>
        )}
      </div>
    </main>
  );
}


