import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { getProperty } from '../../lib/property-service';

// Force dynamic rendering - her istekte yeniden render
export const dynamic = 'force-dynamic';

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty('cf-demo-1', 50);
  
  return {
    title: `${property.title} | Cache Yok Demo`,
    description: `${property.location.district}, ${property.location.neighborhood} - ${property.specs.roomCount}, ${property.specs.netArea}m² - Demo: Cache devre dışı, her istek origin'e gider`,
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.images[0].url],
    },
  };
}

/**
 * Demo 1: No Cache (Origin Direct)
 * 
 * Bu sayfa SSR - property içeriği server'da render edilir
 * Her istek origin'e gider (CF-Cache-Status: DYNAMIC)
 * Network tab'ında CF header'larını görebilirsiniz
 */
export default async function NoCacheDemoPage() {
  // API simülasyonu - 50ms latency
  const property = await getProperty('cf-demo-1', 50);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - SSR */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/CF" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Demo 1: Cache Yok (Origin Direct)
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - SSR, SEO friendly */}
      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR property={property} />
      </main>

      {/* Demo Controls - Client Component (Sayfa Altında) */}
      <DemoControlsClient 
        strategy="none"
        propertyId="cf-demo-1"
        infoBanner={{
          title: 'Cache Yok - Her istek Origin\'e gider',
          description: 'Bu senaryoda her istek doğrudan origin sunucuya gider. <strong>CF-Cache-Status: DYNAMIC</strong> döner. Network tab\'ını açın ve sayfayı yenileyerek her istekte ~800-1200ms latency olduğunu gözlemleyin.',
          color: 'purple'
        }}
        showAge={false}
        showClearCache={false}
      />
    </div>
  );
}
