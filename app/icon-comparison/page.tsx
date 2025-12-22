"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

// Icon Font Component - Gerçek font dosyası kullanır
function FontIcon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
}: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <i
      className={`emlakjet-icon-${name} ${className}`}
      style={{ fontSize: size, color }}
      aria-hidden="true"
    />
  );
}

const icons = ["star", "heart", "home", "search", "location", "phone"];

export default function IconComparisonPage() {
  const [activeTab, setActiveTab] = useState<"sprite" | "font">("sprite");
  const [iconSize, setIconSize] = useState(32);
  const [iconColor, setIconColor] = useState("#1e3a5f");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 backdrop-blur-sm bg-white/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            <span className="text-amber-500">Emlakjet</span> Icon Yöntemleri
            Karşılaştırması
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            SVG Sprite vs Icon Font - Performans Analizi
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Lighthouse Test Links */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <h3 className="text-amber-800 font-medium mb-2">🔬 Lighthouse Test Sayfaları</h3>
          <div className="flex gap-3">
            <Link
              href="/icon-comparison/sprite"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              SVG Sprite Test →
            </Link>
            <Link
              href="/icon-comparison/font"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Icon Font Test →
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("sprite")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "sprite"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🎨 SVG Sprite
          </button>
          <button
            onClick={() => setActiveTab("font")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "font"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🔤 Icon Font
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-slate-200 shadow-sm">
          <h3 className="text-slate-800 font-medium mb-4">Ayarlar</h3>
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="text-slate-500 text-sm block mb-2">
                Boyut: {iconSize}px
              </label>
              <input
                type="range"
                min="16"
                max="64"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-40 accent-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm block mb-2">Renk</label>
              <input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-12 h-8 rounded cursor-pointer border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Icon Display */}
        <div className="bg-white rounded-xl p-8 mb-8 border border-slate-200 shadow-sm">
          <h3 className="text-slate-800 font-medium mb-6">
            {activeTab === "sprite" ? "SVG Sprite Icons" : "Icon Font Icons"}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {icons.map((icon) => (
              <div
                key={icon}
                className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-amber-400 transition-colors"
              >
                {activeTab === "sprite" ? (
                  <Icon name={icon as "star" | "heart" | "home" | "search" | "location" | "phone"} size={iconSize} color={iconColor} />
                ) : (
                  <FontIcon name={icon} size={iconSize} color={iconColor} />
                )}
                <span className="text-slate-500 text-xs font-mono">
                  {activeTab === "sprite"
                    ? `#icon-${icon}`
                    : `emlakjet-icon-${icon}`}
                </span>
              </div>
            ))}
          </div>

          {/* Kullanım Kodu */}
          <div className="mt-8">
            <h4 className="text-slate-600 text-sm font-medium mb-3">
              Kullanım:
            </h4>
            <pre className="bg-slate-800 rounded-lg p-4 text-sm overflow-x-auto">
              {activeTab === "sprite" ? (
                <code className="text-emerald-400">
                  {`import { Icon } from "@/components/Icon";

<Icon name="star" />
<Icon name="heart" size={32} color="#e74c3c" />`}
                </code>
              ) : (
                <code className="text-emerald-400">
                  {`<i class="emlakjet-icon-star"></i>

/* veya React'te */
<span className="emlakjet-icon-star" />`}
                </code>
              )}
            </pre>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <h3 className="text-slate-800 font-medium p-6 pb-4 border-b border-slate-200">
            📊 Karşılaştırma Tablosu
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-4 text-slate-600 font-medium">
                    Özellik
                  </th>
                  <th className="text-left p-4 text-slate-600 font-medium">
                    🎨 SVG Sprite
                  </th>
                  <th className="text-left p-4 text-slate-600 font-medium">
                    🔤 Icon Font
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Dosya Boyutu
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Daha küçük (sıkıştırılabilir)
                  </td>
                  <td className="p-4 text-amber-600">
                    ⚠️ Font dosyaları büyük olabilir
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    HTTP İstekleri
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Tek dosya (sprite.svg)
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Tek dosya (woff2)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Renk Kontrolü
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ CSS fill, stroke, gradients
                  </td>
                  <td className="p-4 text-amber-600">
                    ⚠️ Sadece tek renk (color)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Çoklu Renk Desteği
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Tam destek (multicolor icons)
                  </td>
                  <td className="p-4 text-red-500">❌ Desteklenmiyor</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Ölçekleme Kalitesi
                  </td>
                  <td className="p-4 text-emerald-600">✅ Mükemmel (vektör)</td>
                  <td className="p-4 text-emerald-600">✅ Mükemmel (vektör)</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Erişilebilirlik
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ aria-label, title elementi
                  </td>
                  <td className="p-4 text-amber-600">
                    ⚠️ Screen reader sorunları
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Tarayıcı Desteği
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Tüm modern tarayıcılar
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Tüm modern tarayıcılar
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Animasyon Desteği
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ CSS/JS ile tam kontrol
                  </td>
                  <td className="p-4 text-amber-600">
                    ⚠️ Sınırlı (transform, opacity)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">Caching</td>
                  <td className="p-4 text-emerald-600">
                    ✅ Standart HTTP cache
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Standart HTTP cache
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">SEO</td>
                  <td className="p-4 text-emerald-600">
                    ✅ Inline SVG aranabilir
                  </td>
                  <td className="p-4 text-red-500">❌ İçerik görünmez</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Yeni Icon Ekleme
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ Sprite dosyasına ekle
                  </td>
                  <td className="p-4 text-red-500">
                    ❌ Font'u yeniden oluştur
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    FOUT/FOIT Sorunu
                  </td>
                  <td className="p-4 text-emerald-600">✅ Yok</td>
                  <td className="p-4 text-red-500">
                    ❌ Flash of Unstyled Text
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    Tree Shaking
                  </td>
                  <td className="p-4 text-amber-600">
                    ⚠️ Tüm sprite yüklenir
                  </td>
                  <td className="p-4 text-amber-600">
                    ⚠️ Tüm font yüklenir
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">
                    DevTools İnceleme
                  </td>
                  <td className="p-4 text-emerald-600">
                    ✅ SVG yapısı görünür
                  </td>
                  <td className="p-4 text-red-500">
                    ❌ Sadece unicode karakter
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* SVG Sprite Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 border border-emerald-200 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
              🎨 SVG Sprite
              <span className="text-xs bg-emerald-100 px-2 py-1 rounded-full text-emerald-600">
                Önerilen
              </span>
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-slate-800 font-medium mb-2">
                  ✅ Avantajlar
                </h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Çoklu renk ve gradient desteği</li>
                  <li>• Erişilebilirlik açısından üstün</li>
                  <li>• CSS ile tam stil kontrolü</li>
                  <li>• Animasyonlar için ideal</li>
                  <li>• Yeni icon eklemek kolay</li>
                  <li>• FOUT/FOIT sorunu yok</li>
                  <li>• SEO dostu</li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-800 font-medium mb-2">
                  ❌ Dezavantajlar
                </h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• IE11 için external sprite desteği sınırlı</li>
                  <li>• HTML biraz daha verbose</li>
                  <li>• Inline için JS gerekebilir</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Icon Font Card */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-200 shadow-sm">
            <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
              🔤 Icon Font
              <span className="text-xs bg-amber-100 px-2 py-1 rounded-full text-amber-600">
                Legacy
              </span>
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-slate-800 font-medium mb-2">
                  ✅ Avantajlar
                </h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Kullanımı basit (sadece class ekle)</li>
                  <li>• text-* utility'leri ile boyut/renk</li>
                  <li>• Tarayıcı desteği mükemmel</li>
                  <li>• Font özelliklerini kullanabilir</li>
                  <li>• Eski projelerde yaygın</li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-800 font-medium mb-2">
                  ❌ Dezavantajlar
                </h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Sadece tek renk desteği</li>
                  <li>• FOUT/FOIT sorunu</li>
                  <li>• Erişilebilirlik sorunları</li>
                  <li>• Yeni icon için font rebuild</li>
                  <li>• Anti-aliasing sorunları</li>
                  <li>• Piksel kaymasi olabilir</li>
                  <li>• DevTools'da debug zorluğu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-3">🏆 Öneri</h3>
          <p className="text-slate-600 leading-relaxed">
            Modern web projelerinde{" "}
            <span className="text-emerald-600 font-semibold">SVG Sprite</span>{" "}
            yöntemi önerilmektedir. Çoklu renk desteği, erişilebilirlik, SEO ve
            geliştirici deneyimi açısından açık ara öndedir. Icon Font yöntemi
            artık legacy olarak kabul edilmekte ve yeni projelerde
            kullanılmaması tavsiye edilmektedir.
          </p>
          <div className="mt-4 p-4 bg-white/80 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-700">Bonus:</strong> En yüksek
              performans için{" "}
              <code className="text-amber-600 bg-amber-50 px-1 rounded">
                Individual SVG Components
              </code>{" "}
              (her icon ayrı React component) yöntemi de düşünülebilir. Bu
              yöntem tree-shaking yaparak sadece kullanılan iconları bundle'a
              dahil eder.
            </p>
          </div>
        </div>

        {/* File Structure Info */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-slate-800 font-medium mb-4">📁 Dosya Yapısı</h3>
          <pre className="bg-slate-800 rounded-lg p-4 text-sm overflow-x-auto">
            <code className="text-slate-300">
              {`raw-icons/           # ⚠️ Bundle'a dahil DEĞİL (.gitignore'da)
├── star.svg
├── heart.svg
├── home.svg
├── search.svg
├── location.svg
└── phone.svg

public/
├── icons/
│   └── sprite.svg   # SVG Sprite (işlenmiş)
└── fonts/
    ├── emlakjet-icons.css
    ├── emlakjet-icons.woff2
    ├── emlakjet-icons.woff
    └── emlakjet-icons.ttf`}
            </code>
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-slate-400 text-sm">
          Emlakjet UI Araştırma • Icon Sistemleri Karşılaştırması
        </div>
      </footer>
    </div>
  );
}
