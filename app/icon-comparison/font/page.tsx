import Link from "next/link";

const icons = ["star", "heart", "home", "search", "location", "phone"];

function FontIcon({
  name,
  size = 24,
  color = "currentColor",
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return (
    <i
      className={`emlakjet-icon-${name}`}
      style={{ fontSize: size, color }}
      aria-hidden="true"
    />
  );
}

export default function FontPage() {
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
          Icon Font Test Sayfası
        </h1>
        <p className="text-slate-500 mt-1">
          Lighthouse performans testi için
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* 6 farklı icon */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">6 Icon</h2>
          <div className="flex gap-4 flex-wrap">
            {icons.map((icon) => (
              <div key={icon} className="p-3 bg-slate-50 rounded-lg">
                <FontIcon name={icon} size={32} />
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
                <FontIcon name={icons[i % icons.length]} size={24} />
              </div>
            ))}
          </div>
        </section>

        {/* 200 icon render - stress test */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">200 Icon (Stress Test)</h2>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 200 }).map((_, i) => (
              <FontIcon key={i} name={icons[i % icons.length]} size={16} />
            ))}
          </div>
        </section>

        {/* Farklı boyutlar */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">Farklı Boyutlar</h2>
          <div className="flex items-end gap-4">
            <FontIcon name="star" size={16} />
            <FontIcon name="star" size={24} />
            <FontIcon name="star" size={32} />
            <FontIcon name="star" size={48} />
            <FontIcon name="star" size={64} />
          </div>
        </section>

        {/* Farklı renkler */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">Farklı Renkler</h2>
          <div className="flex gap-4">
            <FontIcon name="heart" size={32} color="#e74c3c" />
            <FontIcon name="heart" size={32} color="#3498db" />
            <FontIcon name="heart" size={32} color="#2ecc71" />
            <FontIcon name="heart" size={32} color="#f39c12" />
            <FontIcon name="heart" size={32} color="#9b59b6" />
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

