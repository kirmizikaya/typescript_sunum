'use client';

import { useState } from 'react';
import { PropertyFeatures } from '../../types';
import { cn } from '@/lib/utils';

interface FeaturesListProps {
  features: PropertyFeatures;
}

type FeatureCategory = 'interior' | 'exterior' | 'location';

export function FeaturesList({ features }: FeaturesListProps) {
  const [activeTab, setActiveTab] = useState<FeatureCategory>('interior');

  const tabs: { id: FeatureCategory; label: string; icon: React.ReactNode }[] = [
    {
      id: 'interior',
      label: 'İç Özellikler',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'exterior',
      label: 'Dış Özellikler',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'location',
      label: 'Konum Özellikleri',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            <span className={cn(
              'ml-1 px-1.5 py-0.5 rounded-full text-xs',
              activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
            )}>
              {features[tab.id].length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features[activeTab].map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              <svg 
                className="w-4 h-4 text-green-400 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {features[activeTab].length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Bu kategoride özellik bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
}

