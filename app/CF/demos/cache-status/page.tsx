import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { CacheStatusControlsClient } from './CacheStatusControlsClient';
import { Property } from '../../types';
import { BASE_URL } from '../../lib/config';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// API'den property verisi çek
async function getProperty(): Promise<Property> {
  const response = await fetch(`${BASE_URL}/CF/api/property/cf-demo-1?strategy=basic`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch property');
  }
  
  const data = await response.json();
  return data.property;
}

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty();
  
  return {
    title: `${property.title} | CF-Cache-Status Referans`,
    description: 'HIT, MISS, STALE, EXPIRED, BYPASS, DYNAMIC - Tüm Cloudflare cache status değerlerinin açıklaması ve demo',
    openGraph: {
      title: 'CF-Cache-Status Referans - Tüm Değerler',
      description: 'Cloudflare cache status değerlerinin interaktif demo sayfası',
      images: [property.images[0].url],
    },
  };
}

/**
 * Demo 5: Tüm CF-Cache-Status Değerleri
 * 
 * HIT, MISS, STALE, EXPIRED, BYPASS, REVALIDATED, UPDATING, DYNAMIC
 * Her birinin ne anlama geldiğini ve latency etkisini görün.
 */
export default async function CacheStatusDemoPage() {
  const property = await getProperty();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/CF" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Demo 5: Tüm CF-Cache-Status Değerleri
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR property={property} />
      </main>

      {/* Cache Status Controls - Interactive (Sayfa Altında) */}
      <CacheStatusControlsClient propertyId="cf-demo-1" />

      {/* Cache Status Reference Table - SSR for SEO */}
      <section className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">CF-Cache-Status Referans Tablosu</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CacheStatusCard 
              status="HIT" 
              color="green"
              description="İçerik edge cache'de bulundu" 
              latency="~10-25ms"
            />
            <CacheStatusCard 
              status="MISS" 
              color="yellow"
              description="İçerik cache'de yok, origin'den alındı" 
              latency="~800-1200ms"
            />
            <CacheStatusCard 
              status="STALE" 
              color="blue"
              description="Eski veri sunuldu, arka planda güncelleniyor" 
              latency="~10-25ms"
            />
            <CacheStatusCard 
              status="EXPIRED" 
              color="orange"
              description="Cache süresi doldu, yeniden alındı" 
              latency="~800-1200ms"
            />
            <CacheStatusCard 
              status="BYPASS" 
              color="gray"
              description="Cache atlandı (cookie/header nedeniyle)" 
              latency="~800-1200ms"
            />
            <CacheStatusCard 
              status="REVALIDATED" 
              color="teal"
              description="Arka plan güncelleme tamamlandı" 
              latency="~10-25ms"
            />
            <CacheStatusCard 
              status="UPDATING" 
              color="purple"
              description="Cache güncelleniyor" 
              latency="~10-25ms"
            />
            <CacheStatusCard 
              status="DYNAMIC" 
              color="red"
              description="İçerik dinamik, cache edilemez" 
              latency="~800-1200ms"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// SSR Component for cache status cards
function CacheStatusCard({ 
  status, 
  color, 
  description, 
  latency 
}: { 
  status: string; 
  color: string;
  description: string; 
  latency: string;
}) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  const dotColorMap: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    gray: 'bg-gray-500',
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-4 h-4 rounded-full ${dotColorMap[color]}`} />
        <span className="font-bold">{status}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <strong>Latency:</strong> {latency}
        </div>
      </div>
    </div>
  );
}
