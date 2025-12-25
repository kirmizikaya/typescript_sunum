'use client';

import { Property } from '../../types';
import { formatListingType, formatRelativeDate } from '../../lib/formatters';
import { Badge } from '../ui/Badge';

interface PropertyHeaderProps {
  property: Property;
  onFavorite?: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
}

export function PropertyHeader({ 
  property, 
  onFavorite, 
  onShare,
  isFavorite = false 
}: PropertyHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <a href="#" className="hover:text-gray-900 transition-colors">Ana Sayfa</a>
        <span>/</span>
        <a href="#" className="hover:text-gray-900 transition-colors">{property.location.city}</a>
        <span>/</span>
        <a href="#" className="hover:text-gray-900 transition-colors">{property.location.district}</a>
        <span>/</span>
        <span className="text-gray-700">{property.location.neighborhood}</span>
      </nav>

      {/* Title & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant={property.listingType === 'sale' ? 'info' : 'purple'}
              size="sm"
            >
              {formatListingType(property.listingType)}
            </Badge>
            {property.priceDrop && (
              <Badge variant="success" size="sm">
                💰 Fiyat Düştü
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {property.title}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {property.location.neighborhood}, {property.location.district}, {property.location.city}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatRelativeDate(property.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {property.viewCount.toLocaleString('tr-TR')} görüntülenme
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {property.favoriteCount} favori
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFavorite}
            className={`p-2.5 rounded-lg border transition-all ${
              isFavorite 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={isFavorite ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={onShare}
            className="p-2.5 rounded-lg border bg-white border-gray-200 text-gray-400 hover:border-gray-300 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
