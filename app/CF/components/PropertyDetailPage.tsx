'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Property } from '../types';
import { formatPrice, formatArea, formatFloor, formatBuildingAge, formatListingType, formatUsageStatus, formatFurnished, formatRelativeDate } from '../lib/formatters';
import { cn } from '@/lib/utils';

interface PropertyDetailPageProps {
  property: Property;
  loading?: boolean;
}

export function PropertyDetailPage({ property, loading = false }: PropertyDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="px-4 py-3 border-b border-gray-200 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <a href="#" className="hover:text-blue-600">Emlak</a>
          <span>›</span>
          <a href="#" className="hover:text-blue-600">Konut</a>
          <span>›</span>
          <a href="#" className="hover:text-blue-600">{formatListingType(property.listingType)}</a>
          <span>›</span>
          <a href="#" className="hover:text-blue-600">{property.location.city}</a>
          <span>›</span>
          <a href="#" className="hover:text-blue-600">{property.location.district}</a>
          <span>›</span>
          <span className="text-gray-700">{property.location.neighborhood}</span>
        </div>
      </nav>

      {/* Title */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          {property.title}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Images */}
        <div className="lg:w-[45%] p-4 border-r border-gray-200">
          {/* Main Image */}
          <div 
            className="relative aspect-[4/3] bg-gray-100 cursor-pointer group"
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={property.images[currentImageIndex]?.url || '/placeholder.jpg'}
              alt={property.images[currentImageIndex]?.alt || property.title}
              fill
              className="object-cover"
              priority
            />
            {/* Image ID */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1">
              #{property.id}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-16 relative border-2 transition-all',
                  currentImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                )}
              >
                <Image src={image.url} alt={image.alt} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Image Actions */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Büyük Fotoğraf
            </button>
            <button className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Video
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            {currentImageIndex + 1}/{property.images.length} Fotoğraf
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex gap-4 text-sm text-blue-600">
            <a href="#" className="hover:underline">Emlak Endeksi</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Gayrimenkul Ekspertiz</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Emlak Alım Rehberi</a>
          </div>
        </div>

        {/* Middle Column - Property Details */}
        <div className="lg:w-[35%] p-4 border-r border-gray-200">
          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(property.price, property.currency)}
              </span>
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

          {/* Location */}
          <div className="mb-4 text-blue-600">
            <a href="#" className="hover:underline">{property.location.city}</a>
            {' / '}
            <a href="#" className="hover:underline">{property.location.district}</a>
            {' / '}
            <a href="#" className="hover:underline">{property.location.neighborhood}</a>
          </div>

          {/* Details Table */}
          <table className="w-full text-sm">
            <tbody>
              <DetailRow label="İlan No" value={property.id} valueClassName="text-blue-600" />
              <DetailRow label="İlan Tarihi" value={formatRelativeDate(property.createdAt)} />
              <DetailRow label="Emlak Tipi" value={`${formatListingType(property.listingType)} Daire`} />
              <DetailRow label="m² (Brüt)" value={String(property.specs.grossArea)} />
              <DetailRow label="m² (Net)" value={String(property.specs.netArea)} />
              <DetailRow label="Oda Sayısı" value={property.specs.roomCount} />
              <DetailRow label="Bina Yaşı" value={formatBuildingAge(property.specs.buildingAge)} />
              <DetailRow label="Bulunduğu Kat" value={formatFloor(property.specs.floor, property.specs.totalFloors)} />
              <DetailRow label="Kat Sayısı" value={String(property.specs.totalFloors)} />
              <DetailRow label="Isıtma" value={property.specs.heatingType} />
              <DetailRow label="Banyo Sayısı" value={String(property.specs.bathroomCount)} />
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

        {/* Right Column - Contact */}
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

      {/* Description Section */}
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

        {/* Description Content */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Açıklama</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {property.description}
          </div>
        </div>

        {/* Features */}
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">İç Özellikler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {property.features.interior.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dış Özellikler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {property.features.exterior.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2" onClick={() => setLightboxOpen(false)}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
            <Image
              src={property.images[currentImageIndex]?.url || '/placeholder.jpg'}
              alt={property.images[currentImageIndex]?.alt || property.title}
              fill
              className="object-contain"
            />
          </div>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2"
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? property.images.length - 1 : i - 1); }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2"
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === property.images.length - 1 ? 0 : i + 1); }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  );
}

// Detail row component
function DetailRow({ 
  label, 
  value, 
  valueClassName 
}: { 
  label: string; 
  value: string; 
  valueClassName?: string;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 text-gray-600 font-medium whitespace-nowrap">{label}</td>
      <td className={cn('py-2 text-gray-900', valueClassName)}>{value}</td>
    </tr>
  );
}

// Skeleton loader
function PropertyDetailSkeleton() {
  return (
    <div className="bg-white animate-pulse">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex">
        <div className="w-[45%] p-4">
          <div className="aspect-[4/3] bg-gray-200 rounded"></div>
          <div className="mt-4 flex gap-2">
            {[1,2,3,4].map(i => <div key={i} className="w-20 h-16 bg-gray-200 rounded"></div>)}
          </div>
        </div>
        <div className="w-[35%] p-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[20%] p-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

