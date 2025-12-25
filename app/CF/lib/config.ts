/**
 * Base URL Configuration
 * 
 * Vercel'de VERCEL_URL otomatik set edilir.
 * Localhost'ta fallback olarak localhost:3000 kullanılır.
 */

function getBaseUrl(): string {
  // Vercel production/preview
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Custom base URL (environment variable)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Localhost fallback
  return 'http://localhost:3000';
}

export const BASE_URL = getBaseUrl();

