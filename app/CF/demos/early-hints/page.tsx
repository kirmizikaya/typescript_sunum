import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
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
    title: `${property.title} | Early Hints (103) Demo`,
    description: `${property.location.district}, ${property.location.neighborhood} - ${property.specs.roomCount}, ${property.specs.netArea}m² - Demo: HTTP 103 Early Hints`,
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.images[0].url],
    },
  };
}

/**
 * Demo 4: Early Hints (103)
 * 
 * Cloudflare, ana response'tan önce 103 Early Hints gönderir.
 * Browser kritik kaynakları (CSS, font, API) önceden yükler.
 * Network tab'ında 'Link' header'ını görebilirsiniz.
 */
export default async function EarlyHintsDemoPage() {
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
              Demo 4: Early Hints (103)
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR property={property} />
      </main>

      {/* Demo Controls (Sayfa Altında) */}
      <DemoControlsClient 
        strategy="basic"
        propertyId="cf-demo-1"
        infoBanner={{
          title: '103 Early Hints - Kritik kaynakları önceden yükle',
          description: 'Network tab\'ında <strong>Link</strong> header\'ını görün. Browser, ana response gelmeden font, CSS ve API isteklerini başlatır. LCP ve FCP metrikleri iyileşir.',
          color: 'cyan'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
