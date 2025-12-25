import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { Property } from '../../types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// API'den property verisi çek
async function getProperty(): Promise<Property> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/CF/api/property/cf-demo-1?strategy=basic`, {
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
    title: `${property.title} | Basic Edge Cache Demo`,
    description: `${property.location.district}, ${property.location.neighborhood} - ${property.specs.roomCount}, ${property.specs.netArea}m² - Demo: Edge cache, ilk MISS sonra HIT`,
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.images[0].url],
    },
  };
}

/**
 * Demo 2: Basic Edge Cache
 * 
 * İlk istek: CF-Cache-Status: MISS (~800-1200ms)
 * Sonraki istekler: CF-Cache-Status: HIT (~10-25ms)
 * Cache'i temizlemek için cookie'leri silin
 */
export default async function EdgeCacheDemoPage() {
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
              Demo 2: Basic Edge Cache
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
          title: 'Basic Edge Cache - İlk istek MISS, sonrakiler HIT',
          description: 'İlk istek origin\'e gider: <strong>CF-Cache-Status: MISS</strong> (~800-1200ms). Sonraki istekler edge\'den: <strong>CF-Cache-Status: HIT</strong> (~10-25ms). Sayfayı yenileyin ve Network tab\'ında farkı görün!',
          color: 'green'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
