'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DescriptionProps {
  description: string;
  maxLength?: number;
}

export function Description({ description, maxLength = 500 }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = description.length > maxLength;
  const displayText = expanded ? description : description.slice(0, maxLength);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-4">İlan Açıklaması</h2>
      
      <div className="relative">
        <div 
          className={cn(
            'text-gray-300 leading-relaxed whitespace-pre-line',
            !expanded && shouldTruncate && 'line-clamp-6'
          )}
        >
          {displayText}
          {!expanded && shouldTruncate && '...'}
        </div>
        
        {/* Gradient overlay when truncated */}
        {!expanded && shouldTruncate && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800/50 to-transparent pointer-events-none" />
        )}
      </div>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? (
            <>
              <span>Daha Az Göster</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Devamını Oku</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}

