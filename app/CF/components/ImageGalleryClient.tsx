'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryClientProps {
  images: string[]; // Full URL'ler
  title: string;
  listingId: string;
}

/**
 * Client component for interactive image gallery
 * Bu component SSR sayfası içinde hydrate olur
 */
export function ImageGalleryClient({ images, title, listingId }: ImageGalleryClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[currentImageIndex] || '';

  return (
    <>
      {/* Main Image */}
      <div 
        className="relative aspect-[4/3] bg-gray-100 cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
      >
        {currentImage && (
          <Image
            src={currentImage}
            alt={`${title} - Fotoğraf ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        )}
        {/* Image ID */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          #{listingId}
        </div>
        {/* Image count badge */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {images.length}
        </div>
        {/* Zoom hint */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Büyütmek için tıklayın
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {images.slice(0, 10).map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-16 relative border-2 transition-all rounded overflow-hidden ${
              currentImageIndex === index ? 'border-green-500' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image 
              src={image} 
              alt={`${title} - Küçük ${index + 1}`} 
              fill 
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
        {images.length > 10 && (
          <button 
            onClick={() => setLightboxOpen(true)}
            className="flex-shrink-0 w-20 h-16 bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium rounded border-2 border-transparent hover:border-gray-300"
          >
            +{images.length - 10}
          </button>
        )}
      </div>

      {/* Image Actions */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <button 
          onClick={() => setLightboxOpen(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600"
        >
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
        {currentImageIndex + 1}/{images.length} Fotoğraf
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" 
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10" 
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Main image */}
          <div 
            className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${title} - Fotoğraf ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {/* Navigation buttons */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => { 
              e.stopPropagation(); 
              setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1); 
            }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => { 
              e.stopPropagation(); 
              setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1); 
            }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-12 relative border-2 transition-all rounded overflow-hidden ${
                  currentImageIndex === index ? 'border-green-500' : 'border-transparent hover:border-white/50'
                }`}
              >
                <Image 
                  src={image} 
                  alt={`${title} - Küçük ${index + 1}`} 
                  fill 
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
