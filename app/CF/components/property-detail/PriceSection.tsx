'use client';

import { Property } from '../../types';
import { formatPrice, formatPricePerSqm } from '../../lib/formatters';
import { Badge } from '../ui/Badge';

interface PriceSectionProps {
  property: Property;
}

export function PriceSection({ property }: PriceSectionProps) {
  const hasPriceDrop = property.priceDrop;
  const dropPercentage = hasPriceDrop 
    ? Math.round(((property.priceDrop!.oldPrice - property.price) / property.priceDrop!.oldPrice) * 100)
    : 0;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {/* Price Drop Banner */}
      {hasPriceDrop && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <Badge variant="success" size="sm">
            <span className="mr-1">📉</span>
            %{dropPercentage} İndirim
          </Badge>
          <span className="text-gray-400 line-through text-sm">
            {formatPrice(property.priceDrop!.oldPrice, property.currency)}
          </span>
        </div>
      )}

      {/* Main Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl md:text-4xl font-bold text-gray-900">
          {formatPrice(property.price, property.currency)}
        </span>
        {property.listingType === 'rent' && (
          <span className="text-gray-500 text-lg">/ ay</span>
        )}
      </div>

      {/* Price per sqm */}
      <div className="mt-2 text-gray-500">
        {formatPricePerSqm(property.pricePerSqm)}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Ara
        </button>
        <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
        {property.specs.dues && (
          <div>
            <span className="text-gray-400">Aidat</span>
            <div className="text-gray-800 font-medium">{formatPrice(property.specs.dues)} / ay</div>
          </div>
        )}
        {property.specs.deposit && (
          <div>
            <span className="text-gray-400">Depozito</span>
            <div className="text-gray-800 font-medium">{formatPrice(property.specs.deposit)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
