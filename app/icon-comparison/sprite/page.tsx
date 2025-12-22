import Link from "next/link";
import { Icon } from "@/components/Icon";

const icons: Array<"star" | "heart" | "home" | "search" | "location" | "phone"> = [
  "star",
  "heart",
  "home",
  "search",
  "location",
  "phone",
];

export default function SpritePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <Link
          href="/icon-comparison"
          className="text-amber-600 text-sm hover:underline mb-2 inline-block"
        >
          ← Karşılaştırmaya Dön
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          SVG Sprite Test Sayfası
        </h1>
        <p className="text-slate-500 mt-1">
          Lighthouse performans testi için
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Kullanım */}
        <section className="mb-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
          <h2 className="text-lg font-bold text-emerald-800 mb-4">📖 Nasıl Kullanılır?</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-emerald-700 mb-2">1. Component&apos;ı import et:</h3>
              <pre className="bg-slate-800 rounded-lg p-3 text-sm overflow-x-auto">
                <code className="text-emerald-400">{`import { Icon } from "@/components/Icon";`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-emerald-700 mb-2">2. Kullan:</h3>
              <pre className="bg-slate-800 rounded-lg p-3 text-sm overflow-x-auto">
                <code className="text-emerald-400">{`// Basit kullanım
<Icon name="star" />

// Boyut ile
<Icon name="heart" size={32} />

// Renk ile
<Icon name="home" color="#e74c3c" />

// Hepsi birlikte
<Icon name="search" size={48} color="#3498db" className="hover:scale-110" />`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-emerald-700 mb-2">Mevcut iconlar:</h3>
              <div className="flex gap-2 flex-wrap">
                {icons.map((icon) => (
                  <code key={icon} className="px-2 py-1 bg-white rounded text-xs text-slate-600 border border-emerald-200">
                    {icon}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6 farklı icon */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">6 Icon</h2>
          <div className="flex gap-4 flex-wrap">
            {icons.map((icon) => (
              <div key={icon} className="p-3 bg-slate-50 rounded-lg">
                <Icon name={icon} size={32} />
              </div>
            ))}
          </div>
        </section>

        {/* 50 icon render */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">50 Icon</h2>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded">
                <Icon name={icons[i % icons.length]} size={24} />
              </div>
            ))}
          </div>
        </section>

        {/* 200 icon render - stress test */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">200 Icon (Stress Test)</h2>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 200 }).map((_, i) => (
              <Icon key={i} name={icons[i % icons.length]} size={16} />
            ))}
          </div>
        </section>

        {/* Farklı boyutlar */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">Farklı Boyutlar</h2>
          <div className="flex items-end gap-4">
            <Icon name="star" size={16} />
            <Icon name="star" size={24} />
            <Icon name="star" size={32} />
            <Icon name="star" size={48} />
            <Icon name="star" size={64} />
          </div>
        </section>

        {/* Farklı renkler */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">Farklı Renkler</h2>
          <div className="flex gap-4">
            <Icon name="heart" size={32} color="#e74c3c" />
            <Icon name="heart" size={32} color="#3498db" />
            <Icon name="heart" size={32} color="#2ecc71" />
            <Icon name="heart" size={32} color="#f39c12" />
            <Icon name="heart" size={32} color="#9b59b6" />
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 pt-6 border-t border-slate-200">
        <p className="text-slate-400 text-sm">
          Toplam: 6 + 50 + 200 + 5 + 5 = <strong>266 icon</strong> render edildi
        </p>
      </footer>
    </div>
  );
}

