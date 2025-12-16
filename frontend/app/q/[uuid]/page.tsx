"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface QrPublic {
  title: string;
  type: "MENU" | "LINK" | "CAMPAIGN";
  config: any;
}

async function fetchQr(uuid: string): Promise<QrPublic | null> {
  const res = await fetch(`${API_URL}/public/qr/${uuid}`, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
  if (!res.ok) return null;
  return res.json();
}

export default function PublicQrPage() {
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;

  const [data, setData] = useState<QrPublic | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;

    // Basit offline-first: localStorage cache + background refresh
    const cacheKey = `dqrb_qr_${uuid}`;
    const cached =
      typeof window !== "undefined"
        ? window.localStorage.getItem(cacheKey)
        : null;
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch {
        // ignore
      }
    }

    (async () => {
      try {
        // tarama kaydı
        fetch(`${API_URL}/analytics/scan/${uuid}`, {
          method: "POST",
          headers: { "ngrok-skip-browser-warning": "true" }
        }).catch(() => {});
        const fresh = await fetchQr(uuid);
        if (!fresh) {
          setError("Bu QR için içerik bulunamadı.");
          return;
        }
        setData(fresh);
        window.localStorage.setItem(cacheKey, JSON.stringify(fresh));
      } catch {
        if (!cached) {
          setError(
            "İçerik yüklenemedi. İnternet bağlantınızı kontrol edin."
          );
        }
      }
    })();
  }, [uuid]);

  // LINK tipi için: içerik geldikten hemen sonra hedef URL'ye otomatik yönlendir
  useEffect(() => {
    if (data?.type === "LINK" && data.config?.url) {
      window.location.replace(data.config.url);
    }
  }, [data]);

  if (error && !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <p className="text-sm text-center max-w-xs">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-300">Yükleniyor...</p>
      </main>
    );
  }

  const { type, config } = data;

  // LINK tipi için kullanıcıya bir şey göstermeye gerek yok; direkt yönlendirme yapıldı.
  if (type === "LINK") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-300">
          Yönlendiriliyorsunuz...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-3 py-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-4">
        <header className="text-center space-y-1">
          <h1 className="text-lg font-semibold">{data.title}</h1>
          <p className="text-[11px] text-slate-400">
            QR ile açılan mobil sayfa · Dynamic QR Business Platform
          </p>
        </header>

        {type === "MENU" && (
          <div className="space-y-3">
            {(config.sections || []).map((section: any, idx: number) => (
              <div key={idx} className="rounded-2xl bg-slate-950/60 p-3">
                <h2 className="text-sm font-medium mb-1">{section.title}</h2>
                <ul className="space-y-1">
                  {(section.items || []).map((item: any, j: number) => (
                    <li
                      key={j}
                      className="flex items-center justify-between text-xs text-slate-200"
                    >
                      <span>{item.name}</span>
                      <span className="text-slate-300 font-medium">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {type === "CAMPAIGN" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/40 p-3">
              <p className="text-sm text-emerald-100 whitespace-pre-wrap">
                {config.text}
              </p>
            </div>
          </div>
        )}

        <footer className="pt-2 border-t border-slate-800 text-[10px] text-center text-slate-500">
          İnternet bağlantınız kesilse bile, bu sayfanın son versiyonu kısa
          süreliğine cihazınızda saklanır.
        </footer>
      </div>
    </main>
  );
}

