import Image from 'next/image';
import { Property } from '../types';
import { formatPrice, formatBuildingAge, formatListingType, formatUsageStatus, formatFurnished, formatRelativeDate, formatFloor } from '../lib/formatters';
import { ImageGalleryClient } from './ImageGalleryClient';

interface PropertyDetailSSRProps {
  property: Property;
}

/**
 * Server-side rendered property detail component
 * SEO-friendly - tüm içerik HTML'de render edilir
 * Image gallery client component olarak ayrı tutulur
 */
export function PropertyDetailSSR({ property }: PropertyDetailSSRProps) {
  return (
    <div className="bg-white">
      {/* Breadcrumb - SEO için önemli */}
      <nav className="px-4 py-3 border-b border-gray-200 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="#" itemProp="item" className="hover:text-blue-600"><span itemProp="name">Emlak</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <span aria-hidden="true">›</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="#" itemProp="item" className="hover:text-blue-600"><span itemProp="name">Konut</span></a>
            <meta itemProp="position" content="2" />
          </li>
          <span aria-hidden="true">›</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="#" itemProp="item" className="hover:text-blue-600"><span itemProp="name">{formatListingType(property.listingType)}</span></a>
            <meta itemProp="position" content="3" />
          </li>
          <span aria-hidden="true">›</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="#" itemProp="item" className="hover:text-blue-600"><span itemProp="name">{property.location.city}</span></a>
            <meta itemProp="position" content="4" />
          </li>
          <span aria-hidden="true">›</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="#" itemProp="item" className="hover:text-blue-600"><span itemProp="name">{property.location.district}</span></a>
            <meta itemProp="position" content="5" />
          </li>
          <span aria-hidden="true">›</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-gray-700">{property.location.neighborhood}</span>
            <meta itemProp="position" content="6" />
          </li>
        </ol>
      </nav>

      {/* Title - H1, SEO için kritik */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          {property.title}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row" itemScope itemType="https://schema.org/RealEstateListing">
        <meta itemProp="name" content={property.title} />
        <meta itemProp="url" content={`/ilan/${property.slug}`} />
        
        {/* Left Column - Images (Client Component for interactivity) */}
        <div className="lg:w-[45%] p-4 border-r border-gray-200">
          <ImageGalleryClient 
            images={property.images} 
            title={property.title}
            propertyId={property.id}
          />

          {/* Quick Links */}
          <div className="mt-6 flex gap-4 text-sm text-blue-600">
            <a href="#" className="hover:underline">Emlak Endeksi</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Gayrimenkul Ekspertiz</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Emlak Alım Rehberi</a>
          </div>
        </div>

        {/* Middle Column - Property Details (Fully SSR) */}
        <div className="lg:w-[35%] p-4 border-r border-gray-200">
          {/* Price */}
          <div className="mb-4" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600" itemProp="price">
                {formatPrice(property.price, property.currency)}
              </span>
              <meta itemProp="priceCurrency" content={property.currency} />
              {property.priceDrop && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Fiyat Düştü
                </span>
              )}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              <a href="#" className="hover:underline">Kredi Teklifleri</a>
            </div>
          </div>

          {/* Location - SEO için önemli */}
          <div className="mb-4 text-blue-600" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <a href="#" className="hover:underline"><span itemProp="addressLocality">{property.location.city}</span></a>
            {' / '}
            <a href="#" className="hover:underline"><span itemProp="addressRegion">{property.location.district}</span></a>
            {' / '}
            <a href="#" className="hover:underline">{property.location.neighborhood}</a>
          </div>

          {/* Details Table - SEO için tüm bilgiler HTML'de */}
          <table className="w-full text-sm">
            <tbody>
              <DetailRow label="İlan No" value={property.id} valueClassName="text-blue-600" />
              <DetailRow label="İlan Tarihi" value={formatRelativeDate(property.createdAt)} />
              <DetailRow label="Emlak Tipi" value={`${formatListingType(property.listingType)} Daire`} />
              <DetailRow label="m² (Brüt)" value={`${property.specs.grossArea}`} />
              <DetailRow label="m² (Net)" value={`${property.specs.netArea}`} />
              <DetailRow label="Oda Sayısı" value={property.specs.roomCount} />
              <DetailRow label="Bina Yaşı" value={formatBuildingAge(property.specs.buildingAge)} />
              <DetailRow label="Bulunduğu Kat" value={formatFloor(property.specs.floor, property.specs.totalFloors)} />
              <DetailRow label="Kat Sayısı" value={`${property.specs.totalFloors}`} />
              <DetailRow label="Isıtma" value={property.specs.heatingType} />
              <DetailRow label="Banyo Sayısı" value={`${property.specs.bathroomCount}`} />
              <DetailRow label="Balkon" value={property.specs.balcony ? 'Var' : 'Yok'} />
              <DetailRow label="Eşyalı" value={formatFurnished(property.specs.furnished)} />
              <DetailRow label="Kullanım Durumu" value={formatUsageStatus(property.specs.usageStatus)} />
              <DetailRow label="Site İçerisinde" value={property.specs.inComplex ? 'Evet' : 'Hayır'} />
              <DetailRow label="Aidat (TL)" value={property.specs.dues ? formatPrice(property.specs.dues) : 'Belirtilmemiş'} />
              <DetailRow label="Tapu Durumu" value={property.specs.deedStatus} />
              <DetailRow label="Takas" value={property.specs.exchange ? 'Evet' : 'Hayır'} />
            </tbody>
          </table>

          {/* Report Link */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-red-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              İlan ile İlgili Şikayetim Var
            </a>
          </div>
        </div>

        {/* Right Column - Contact (SSR) */}
        <div className="lg:w-[20%] p-4">
          <div className="border border-gray-200 rounded-lg p-4">
            {/* Agent Name */}
            <div className="text-lg font-semibold text-gray-900">
              {property.agent.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Hesap açma tarihi: {new Date(property.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </div>

            {/* Phone */}
            <div className="mt-4 border border-gray-200 rounded">
              <div className="flex items-center justify-between p-3">
                <span className="text-gray-600">Cep</span>
                <span className="font-semibold text-gray-900">{property.agent.phone}</span>
              </div>
            </div>

            {/* Message Button */}
            <button className="mt-3 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 py-2 border border-gray-200 rounded">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mesaj gönder
            </button>
          </div>

          {/* Safety Tips */}
          <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Güvenlik İpuçları</div>
                <p className="text-sm text-gray-600 mt-1">
                  Satın alacağınız gayrimenkulu görmeden kapora ödemeyin, para göndermeyin.
                </p>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Detaylı bilgi için tıklayın.
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section - SEO için kritik, tam HTML render */}
      <div className="border-t border-gray-200">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="px-6 py-3 text-sm font-medium text-white bg-red-500 rounded-t-lg">
            İlan Detayları
          </button>
          <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-t-lg ml-1">
            Konumu ve Sokak Görünümü
          </button>
        </div>

        {/* Description Content - SEO için tam metin */}
        <div className="p-4" itemProp="description">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Açıklama</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {property.description}
          </div>
        </div>

        {/* Features - SEO için tüm özellikler listelenir */}
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">İç Özellikler</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {property.features.interior.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dış Özellikler</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {property.features.exterior.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Konum Özellikleri</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {property.features.location.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: property.title,
            description: property.description,
            url: `/ilan/${property.slug}`,
            image: property.images.map(img => img.url),
            offers: {
              '@type': 'Offer',
              price: property.price,
              priceCurrency: property.currency,
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: property.location.city,
              addressRegion: property.location.district,
            },
            floorSize: {
              '@type': 'QuantitativeValue',
              value: property.specs.netArea,
              unitCode: 'MTK',
            },
            numberOfRooms: property.specs.roomCount,
          }),
        }}
      />
    </div>
  );
}

// Detail row component
function DetailRow({ 
  label, 
  value, 
  valueClassName = ''
}: { 
  label: string; 
  value: string; 
  valueClassName?: string;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 text-gray-600 font-medium whitespace-nowrap">{label}</td>
      <td className={`py-2 text-gray-900 ${valueClassName}`}>{value}</td>
    </tr>
  );
}

