'use client';

import { Property } from '../../types';
import { formatArea, formatFloor, formatBuildingAge } from '../../lib/formatters';

interface QuickInfoBarProps {
  property: Property;
}

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function QuickInfoBar({ property }: QuickInfoBarProps) {
  const items: InfoItem[] = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      label: 'Oda Sayısı',
      value: property.specs.roomCount
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      label: 'Brüt / Net',
      value: `${formatArea(property.specs.grossArea)} / ${formatArea(property.specs.netArea)}`
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
        </svg>
      ),
      label: 'Kat',
      value: formatFloor(property.specs.floor, property.specs.totalFloors)
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Bina Yaşı',
      value: formatBuildingAge(property.specs.buildingAge)
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      label: 'Isıtma',
      value: property.specs.heatingType
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      label: 'Banyo',
      value: `${property.specs.bathroomCount} Banyo`
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex-shrink-0 flex flex-col items-center justify-center p-4 min-w-[120px] border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors"
          >
            <div className="text-blue-500 mb-2">
              {item.icon}
            </div>
            <div className="text-gray-800 font-semibold text-sm text-center">
              {item.value}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
