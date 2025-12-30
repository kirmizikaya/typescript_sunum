import Image from 'next/image';
import { 
  EmlakjetListingDetail, 
  EmlakjetSimilarListing,
  getPropertyValue,
  flattenAttributes,
  stripHtml,
  getLogoUrl 
} from '../types/emlakjet-api';
import { getListingImages, formatListingPrice } from '../lib/property-service';
import { ImageGalleryClient } from './ImageGalleryClient';
import { SimilarListingsSlider } from './SimilarListingsSlider';
import { CompanyCard } from './CompanyCard';
import { PriceHistorySection } from './PriceHistorySection';

interface PropertyDetailSSRProps {
  listing: EmlakjetListingDetail;
  similarListings?: EmlakjetSimilarListing[];
}

/**
 * Server-side rendered property detail component
 * SEO-friendly - tüm içerik HTML'de render edilir
 * Emlakjet API response formatına uygun
 */
export function PropertyDetailSSR({ listing, similarListings = [] }: PropertyDetailSSRProps) {
  const images = getListingImages(listing);
  const features = flattenAttributes(listing.attributes);
  const cleanDescription = stripHtml(listing.description);
  
  // Property değerlerini al
  const netArea = getPropertyValue(listing.properties, 'net_square');
  const grossArea = getPropertyValue(listing.properties, 'gross_square');
  const roomCount = getPropertyValue(listing.properties, 'room_count');
  const buildAge = getPropertyValue(listing.properties, 'build_age');
  const floorNumber = getPropertyValue(listing.properties, 'floor_number');
  const floorCount = getPropertyValue(listing.properties, 'floor_count');
  const heatingType = getPropertyValue(listing.properties, 'heating_type');
  const bathCount = getPropertyValue(listing.properties, 'bath_count');
  const balconyCondition = getPropertyValue(listing.properties, 'balcony_condition');
  const furnitureStatus = getPropertyValue(listing.properties, 'furniture_status');
  const usability = getPropertyValue(listing.properties, 'usability');
  const inSite = getPropertyValue(listing.properties, 'in_site');
  const deedStatus = getPropertyValue(listing.properties, 'deed_status');
  const trade = getPropertyValue(listing.properties, 'trade');
  const buildStatus = getPropertyValue(listing.properties, 'build_status');
  const creditSuitability = getPropertyValue(listing.properties, 'suitability_for_credit');
  const createdAt = getPropertyValue(listing.properties, 'created_at');
  const updatedAt = getPropertyValue(listing.properties, 'updated_at');

  return (
    <div className="bg-white">
      {/* Breadcrumb - SEO için önemli */}
      <nav className="px-4 py-3 border-b border-gray-200 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-gray-500 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
          {listing.breadcrumbs.map((crumb, index) => (
            <li key={crumb.url} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-gray-300">›</span>}
              {index === listing.breadcrumbs.length - 1 ? (
                <span itemProp="name" className="text-gray-700 truncate max-w-[200px]">{crumb.name}</span>
              ) : (
                <a href={`https://www.emlakjet.com${crumb.url}`} itemProp="item" className="hover:text-green-600">
                  <span itemProp="name">{crumb.name}</span>
                </a>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>

      {/* Title - H1, SEO için kritik */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          {listing.title}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row" itemScope itemType="https://schema.org/RealEstateListing">
        <meta itemProp="name" content={listing.title} />
        <meta itemProp="url" content={`https://www.emlakjet.com${listing.url}`} />
        
        {/* Left Column - Images (Client Component for interactivity) */}
        <div className="lg:w-[45%] p-4 border-r border-gray-200">
          <ImageGalleryClient 
            images={images} 
            title={listing.title}
            listingId={String(listing.id)}
          />

          {/* Quick Links */}
          <div className="mt-6 flex gap-4 text-sm text-green-600">
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
              <span className="text-2xl font-bold text-green-600" itemProp="price">
                {formatListingPrice(listing.priceDetail.price, listing.priceDetail.currency)}
              </span>
              <meta itemProp="priceCurrency" content={listing.priceDetail.currency === 'TL' ? 'TRY' : listing.priceDetail.currency} />
              {listing.priceDetail.trendType === 'down' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Fiyat Düştü %{listing.priceDetail.differenceRate}
                </span>
              )}
            </div>
            {listing.endeksaValuation && (
              <div className="text-sm text-gray-500 mt-1">
                Piyasa değeri: {formatListingPrice(listing.endeksaValuation.minPrice)} - {formatListingPrice(listing.endeksaValuation.maxPrice)}
              </div>
            )}
            <div className="text-sm text-green-600 mt-1">
              <a href="#" className="hover:underline">Kredi Teklifleri</a>
              {creditSuitability && <span className="ml-2 text-gray-500">({creditSuitability})</span>}
            </div>
          </div>

          {/* Location - SEO için önemli */}
          <div className="mb-4 text-green-600" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <a href="#" className="hover:underline"><span itemProp="addressLocality">{listing.location.city.name}</span></a>
            {' / '}
            <a href="#" className="hover:underline"><span itemProp="addressRegion">{listing.location.district.name}</span></a>
            {' / '}
            <a href="#" className="hover:underline">{listing.location.town.name}</a>
            {listing.location.locality && (
              <>
                {' / '}
                <a href="#" className="hover:underline">{listing.location.locality.name}</a>
              </>
            )}
          </div>

          {/* Details Table - SEO için tüm bilgiler HTML'de */}
          <table className="w-full text-sm">
            <tbody>
              <DetailRow label="İlan No" value={String(listing.id)} valueClassName="text-green-600" />
              <DetailRow label="İlan Tarihi" value={createdAt || '-'} />
              {updatedAt && <DetailRow label="Güncelleme" value={updatedAt} />}
              <DetailRow label="Emlak Tipi" value={listing.tradeType.key === 'sale' ? 'Satılık Daire' : 'Kiralık Daire'} />
              <DetailRow label="m² (Brüt)" value={grossArea || '-'} />
              <DetailRow label="m² (Net)" value={netArea || '-'} />
              <DetailRow label="Oda Sayısı" value={roomCount || '-'} />
              <DetailRow label="Bina Yaşı" value={buildAge || '-'} />
              <DetailRow label="Bulunduğu Kat" value={floorNumber || '-'} />
              <DetailRow label="Kat Sayısı" value={floorCount || '-'} />
              <DetailRow label="Isıtma" value={heatingType || '-'} />
              <DetailRow label="Banyo Sayısı" value={bathCount || '-'} />
              <DetailRow label="Balkon" value={balconyCondition || '-'} />
              <DetailRow label="Eşyalı" value={furnitureStatus || '-'} />
              <DetailRow label="Kullanım Durumu" value={usability || '-'} />
              <DetailRow label="Site İçerisinde" value={inSite || '-'} />
              <DetailRow label="Yapı Durumu" value={buildStatus || '-'} />
              <DetailRow label="Tapu Durumu" value={deedStatus || '-'} />
              <DetailRow label="Takas" value={trade || '-'} />
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
            {/* Agency Logo */}
            {listing.owner.account.logo && (
              <div className="mb-3">
                <Image
                  src={getLogoUrl(listing.owner.account.logo)}
                  alt={listing.owner.account.name}
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
            )}
            
            {/* Agent Name */}
            <div className="text-lg font-semibold text-gray-900">
              {listing.owner.account.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {listing.owner.member.name}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Üyelik süresi: {listing.owner.account.durationOfMembership} yıl
            </div>

            {/* Phone */}
            <div className="mt-4 border border-gray-200 rounded">
              <div className="flex items-center justify-between p-3">
                <span className="text-gray-600">Tel</span>
                <span className="font-semibold text-gray-900">{listing.owner.account.phoneNumber}</span>
              </div>
            </div>

            {/* WhatsApp */}
            {listing.whatsappNumber && (
              <a 
                href={`https://wa.me/90${listing.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 text-white bg-green-500 hover:bg-green-600 py-2 rounded"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}

            {/* Message Button */}
            <button className="mt-3 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-green-600 py-2 border border-gray-200 rounded">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mesaj gönder
            </button>

            {/* Document Status */}
            {listing.owner.accountDocument.state === 'yes' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Belge Onaylı
              </div>
            )}
          </div>

          {/* Safety Tips */}
          <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Güvenlik İpuçları</div>
                <p className="text-sm text-gray-600 mt-1">
                  Satın alacağınız gayrimenkulu görmeden kapora ödemeyin, para göndermeyin.
                </p>
                <a href="#" className="text-sm text-green-600 hover:underline">
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
          <button className="px-6 py-3 text-sm font-medium text-white bg-green-500 rounded-t-lg">
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
            {cleanDescription}
          </div>
        </div>

        {/* İç Özellikler */}
        {features.interior.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">İç Özellikler</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.interior.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dış Özellikler */}
        {features.exterior.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dış Özellikler</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.exterior.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Konum Özellikleri */}
        {features.location.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Konum Özellikleri</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.location.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Fiyat Bilgisi Section - Yeni Tablo Formatı */}
      <PriceHistorySection 
        priceHistories={listing.priceHistories} 
        currentPrice={listing.priceDetail} 
      />

      {/* Firma Künyesi */}
      <CompanyCard 
        owner={listing.owner} 
        companyListings={similarListings} 
      />

      {/* Benzer İlanlar Slider */}
      <SimilarListingsSlider 
        listings={similarListings} 
        title="Benzer İlanlar"
      />

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: listing.title,
            description: cleanDescription.slice(0, 500),
            url: `https://www.emlakjet.com${listing.url}`,
            image: images.slice(0, 5),
            offers: {
              '@type': 'Offer',
              price: listing.priceDetail.price,
              priceCurrency: listing.priceDetail.currency === 'TL' ? 'TRY' : listing.priceDetail.currency,
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: listing.location.city.name,
              addressRegion: listing.location.district.name,
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: listing.location.coordinate.lat,
              longitude: listing.location.coordinate.lon,
            },
            floorSize: {
              '@type': 'QuantitativeValue',
              value: netArea?.replace(/[^0-9]/g, '') || grossArea?.replace(/[^0-9]/g, '') || 0,
              unitCode: 'MTK',
            },
            numberOfRooms: roomCount || '-',
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

