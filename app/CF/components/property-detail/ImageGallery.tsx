'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PropertyImage } from '../../types';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: PropertyImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div 
          className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden cursor-pointer group shadow-sm"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[currentIndex]?.url || '/placeholder.jpg'}
            alt={images[currentIndex]?.alt || 'Property image'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Icon */}
          <div className="absolute bottom-4 left-4 bg-white/90 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shadow-sm',
                currentIndex === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox 
          images={images}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setCurrentIndex}
        />
      )}
    </>
  );
}

// Lightbox component
function Lightbox({ 
  images, 
  currentIndex, 
  onClose,
  onIndexChange 
}: { 
  images: PropertyImage[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const handlePrev = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Image */}
      <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
        <Image
          src={images[currentIndex]?.url || '/placeholder.jpg'}
          alt={images[currentIndex]?.alt || 'Property image'}
          fill
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-3xl overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={cn(
              'flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
              currentIndex === index 
                ? 'border-white' 
                : 'border-transparent opacity-50 hover:opacity-100'
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
