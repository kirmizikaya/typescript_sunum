'use client';

import { useState } from 'react';

/**
 * Emlakjet Site Header Component
 * 
 * Gerçek Emlakjet header'ı gibi görünür.
 * Full width header, centered content.
 */

const SATILIK_MENU = [
  { label: 'Konut', href: '#' },
  { label: 'Arsa', href: '#' },
  { label: 'Kat Karşılığı Arsa', href: '#' },
  { label: 'İşyeri', href: '#' },
  { label: 'Devren İşyeri', href: '#' },
  { label: 'Turistik Tesis', href: '#' },
];

const KIRALIK_MENU = [
  { label: 'Konut', href: '#' },
  { label: 'İşyeri', href: '#' },
  { label: 'Devren İşyeri', href: '#' },
  { label: 'Turistik Tesis', href: '#' },
];

const PROJELER_MENU = [
  { label: 'Tüm Projeler', href: '#' },
  { label: 'Konut Projeleri', href: '#' },
  { label: 'İşyeri Projeleri', href: '#' },
];

const HIZMETLER_MENU = [
  { label: 'Emlak Endeksi', href: '#' },
  { label: 'Gayrimenkul Ekspertiz', href: '#' },
  { label: 'Emlak Alım Rehberi', href: '#' },
  { label: 'Mortgage Hesaplama', href: '#' },
];

export function EmlakjetHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="bg-white border-b border-gray-200 w-full relative z-50">
      {/* Full width background, centered content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left - Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href="https://www.emlakjet.com" className="flex items-center gap-1 text-[#58b847]">
              <svg 
                className="w-6 h-6" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xl font-bold">emlakjet</span>
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <NavDropdown 
                label="Satılık" 
                items={SATILIK_MENU} 
                isOpen={openMenu === 'satilik'}
                onToggle={() => setOpenMenu(openMenu === 'satilik' ? null : 'satilik')}
                onClose={() => setOpenMenu(null)}
              />
              <NavDropdown 
                label="Kiralık" 
                items={KIRALIK_MENU} 
                isOpen={openMenu === 'kiralik'}
                onToggle={() => setOpenMenu(openMenu === 'kiralik' ? null : 'kiralik')}
                onClose={() => setOpenMenu(null)}
              />
              <NavDropdown 
                label="Projeler" 
                items={PROJELER_MENU} 
                isOpen={openMenu === 'projeler'}
                onToggle={() => setOpenMenu(openMenu === 'projeler' ? null : 'projeler')}
                onClose={() => setOpenMenu(null)}
              />
              <NavDropdown 
                label="Hizmetlerimiz" 
                items={HIZMETLER_MENU} 
                isOpen={openMenu === 'hizmetler'}
                onToggle={() => setOpenMenu(openMenu === 'hizmetler' ? null : 'hizmetler')}
                onClose={() => setOpenMenu(null)}
              />
              <a 
                href="#" 
                className="text-gray-700 hover:text-[#58b847] text-sm px-3 py-2 transition-colors"
              >
                Emlak Haberleri
              </a>
            </nav>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1 px-3 py-2"
                onClick={() => setOpenMenu(openMenu === 'uyelik' ? null : 'uyelik')}
              >
                Üyelik
                <svg className={`w-4 h-4 transition-transform ${openMenu === 'uyelik' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMenu === 'uyelik' && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] py-2 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Giriş Yap</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Üye Ol</a>
                </div>
              )}
            </div>
            <a 
              href="#" 
              className="bg-[#58b847] hover:bg-[#4ca33d] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Ücretsiz İlan Ver
            </a>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {openMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenMenu(null)}
        />
      )}
    </header>
  );
}

interface NavDropdownProps {
  label: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function NavDropdown({ label, items, isOpen, onToggle }: NavDropdownProps) {
  return (
    <div className="relative">
      <button 
        className={`flex items-center gap-1 text-sm px-3 py-2 transition-colors ${
          isOpen ? 'text-[#58b847]' : 'text-gray-700 hover:text-[#58b847]'
        }`}
        onClick={onToggle}
      >
        {label}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] py-2 z-50">
          {items.map((item) => (
            <a 
              key={item.label}
              href={item.href} 
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-l-2 border-transparent hover:border-[#58b847] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
