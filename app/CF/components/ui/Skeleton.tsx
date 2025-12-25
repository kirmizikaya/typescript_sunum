'use client';

import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'text',
  width,
  height 
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={cn(
        'animate-pulse bg-gray-700',
        variants[variant],
        !height && variant === 'text' && 'h-4',
        className
      )}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <Skeleton width="75%" />
      <Skeleton width="50%" />
      <div className="flex gap-2">
        <Skeleton width={60} />
        <Skeleton width={60} />
        <Skeleton width={60} />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 ? '60%' : '100%'} 
        />
      ))}
    </div>
  );
}

