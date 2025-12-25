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
  const response = await fetch(`${BASE_URL}/CF/api/property/cf-demo-1?strategy=swr`, {
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
    title: `${property.title} | Stale-While-Revalidate Demo`,
    description: `${property.location.district}, ${property.location.neighborhood} - ${property.specs.roomCount}, ${property.specs.netArea}m² - Demo: SWR stratejisi`,
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.images[0].url],
    },
  };
}

/**
 * Demo 3: Stale-While-Revalidate
 * 
 * 0-10sn: CF-Cache-Status: HIT (fresh)
 * 10-25sn: CF-Cache-Status: STALE (eski veri sunulur, arka planda güncellenir)
 * 25sn+: CF-Cache-Status: EXPIRED (origin'e gider)
 */
export default async function SWRDemoPage() {
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
              Demo 3: Stale-While-Revalidate
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
        strategy="swr"
        propertyId="cf-demo-1"
        infoBanner={{
          title: 'SWR - Eski veriyi hemen sun, arka planda güncelle',
          description: '<strong>0-10sn:</strong> HIT (fresh) | <strong>10-25sn:</strong> STALE (eski veri anında sunulur, arka planda güncellenir) | <strong>25sn+:</strong> EXPIRED. Cache temizleyin, bekleyin ve farkı görün!',
          color: 'blue'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
