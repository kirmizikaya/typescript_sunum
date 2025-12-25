import { Property } from '../types';

// Ana demo property
export const mockProperty: Property = {
  id: 'cf-demo-1',
  slug: 'kadikoy-caferaga-deniz-manzarali-3-1',
  title: 'Caferağa\'da Deniz Manzaralı 3+1 Satılık Daire',
  description: `Kadıköy Caferağa Mahallesi'nde, deniz manzaralı, yeni tadilatlı lüks daire.

Daire Özellikleri:
• 140m² brüt, 120m² net kullanım alanı
• 3 yatak odası + geniş salon
• 2 banyo (1 ebeveyn banyosu)
• Amerikan mutfak, ankastre beyaz eşya
• Yerden ısıtma sistemi
• Klima tüm odalarda
• Geniş balkon (deniz manzaralı)

Bina Özellikleri:
• 2019 yapımı, 8 katlı bina
• 7/24 güvenlik
• Kapalı otopark (1 araçlık)
• Fitness salonu ve sauna
• Çocuk oyun alanı
• Jeneratör ve hidrofor

Konum Avantajları:
• Kadıköy sahiline 5 dakika yürüme
• Metroya 3 dakika
• Moda Caddesi'ne 10 dakika
• Hastane ve okullar yakın

Eşyasız teslim edilecektir. Fiyat pazarlığa açıktır.`,
  price: 4500000,
  currency: 'TRY',
  pricePerSqm: 37500,
  listingType: 'sale',
  propertyType: 'apartment',
  location: {
    city: 'İstanbul',
    district: 'Kadıköy',
    neighborhood: 'Caferağa',
    coordinates: { lat: 40.9876, lng: 29.0234 }
  },
  specs: {
    roomCount: '3+1',
    grossArea: 140,
    netArea: 120,
    floor: 4,
    totalFloors: 8,
    buildingAge: 5,
    heatingType: 'Kombi (Doğalgaz)',
    bathroomCount: 2,
    balcony: true,
    furnished: 'no',
    usageStatus: 'empty',
    inComplex: true,
    dues: 1500,
    deposit: null,
    deedStatus: 'Kat Mülkiyetli',
    exchange: false
  },
  features: {
    interior: [
      'ADSL',
      'Alarm (Hırsız)',
      'Ankastre Fırın',
      'Barbekü',
      'Beyaz Eşya',
      'Duşakabin',
      'Gömme Dolap',
      'Hilton Banyo',
      'Interkom',
      'Jakuzi',
      'Kartonpiyer',
      'Klima',
      'Mutfak (Laminat)',
      'Panjur/Jaluzi',
      'Set Üstü Ocak',
      'Spot Aydınlatma',
      'Vestiyer',
      'Yerden Isıtma'
    ],
    exterior: [
      'Asansör',
      'Güvenlik',
      'Hidrofor',
      'Jeneratör',
      'Kablo TV',
      'Kapıcı',
      'Kapalı Garaj',
      'Müstakil Havuzlu',
      'Otopark (Açık)',
      'Oyun Parkı',
      'Spor Salonu',
      'Uydu',
      'Yangın Merdiveni',
      'Yüzme Havuzu (Açık)'
    ],
    location: [
      'AVM\'ye Yakın',
      'Belediye\'ye Yakın',
      'Cadde Üzeri',
      'Camiye Yakın',
      'Denize Yakın',
      'Hastaneye Yakın',
      'Market\'e Yakın',
      'Metroya Yakın',
      'Otobüs Durağına Yakın',
      'Park\'a Yakın',
      'Sahil\'e Yakın',
      'Şehir Merkezine Yakın'
    ]
  },
  images: [
    { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', alt: 'Salon görünümü', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', alt: 'Mutfak', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop', alt: 'Yatak Odası', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop', alt: 'Banyo', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', alt: 'Balkon Manzara', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop', alt: 'Oturma Alanı', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', alt: 'Dış Görünüm', width: 1200, height: 800 },
    { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop', alt: 'İkinci Oda', width: 1200, height: 800 }
  ],
  agent: {
    id: 'agent-1',
    name: 'Ahmet Yılmaz',
    phone: '+90 532 123 45 67',
    whatsapp: '+905321234567',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    agency: {
      name: 'Yılmaz Emlak',
      logo: 'https://via.placeholder.com/100x40?text=Yılmaz+Emlak',
      verified: true
    }
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
  viewCount: 1250,
  favoriteCount: 45,
  status: 'active',
  priceDrop: {
    oldPrice: 4800000,
    dropDate: '2024-01-18T10:00:00Z'
  }
};

// Benzer ilanlar
export const similarProperties: Property[] = [
  {
    id: 'cf-demo-2',
    slug: 'moda-deniz-goren-2-1',
    title: 'Moda\'da Deniz Gören 2+1 Daire',
    description: 'Moda\'da eşsiz konumda deniz manzaralı daire',
    price: 3200000,
    currency: 'TRY',
    pricePerSqm: 35555,
    listingType: 'sale',
    propertyType: 'apartment',
    location: {
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Moda',
      coordinates: { lat: 40.9812, lng: 29.0312 }
    },
    specs: {
      roomCount: '2+1',
      grossArea: 95,
      netArea: 90,
      floor: 3,
      totalFloors: 5,
      buildingAge: 15,
      heatingType: 'Kombi (Doğalgaz)',
      bathroomCount: 1,
      balcony: true,
      furnished: 'no',
      usageStatus: 'empty',
      inComplex: false,
      dues: 800,
      deposit: null,
      deedStatus: 'Kat Mülkiyetli',
      exchange: false
    },
    features: {
      interior: ['Klima', 'Kombi', 'Amerikan Mutfak'],
      exterior: ['Asansör'],
      location: ['Denize Yakın', 'Sahile Yakın']
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', alt: 'Salon', width: 800, height: 600 }
    ],
    agent: {
      id: 'agent-2',
      name: 'Ayşe Kaya',
      phone: '+90 532 987 65 43',
      whatsapp: '+905329876543',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      agency: { name: 'Kaya Gayrimenkul', logo: '', verified: true }
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    viewCount: 890,
    favoriteCount: 32,
    status: 'active'
  },
  {
    id: 'cf-demo-3',
    slug: 'fenerbahce-luks-4-1',
    title: 'Fenerbahçe\'de Lüks 4+1 Villa',
    description: 'Fenerbahçe\'de müstakil bahçeli lüks villa',
    price: 12500000,
    currency: 'TRY',
    pricePerSqm: 41666,
    listingType: 'sale',
    propertyType: 'villa',
    location: {
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Fenerbahçe',
      coordinates: { lat: 40.9756, lng: 29.0456 }
    },
    specs: {
      roomCount: '4+1',
      grossArea: 320,
      netArea: 300,
      floor: 1,
      totalFloors: 3,
      buildingAge: 3,
      heatingType: 'Merkezi Sistem',
      bathroomCount: 3,
      balcony: true,
      furnished: 'yes',
      usageStatus: 'empty',
      inComplex: true,
      dues: 3500,
      deposit: null,
      deedStatus: 'Kat Mülkiyetli',
      exchange: false
    },
    features: {
      interior: ['Jakuzi', 'Şömine', 'Akıllı Ev'],
      exterior: ['Özel Havuz', 'Bahçe', 'Garaj'],
      location: ['Sahile Yakın', 'Parkour Yakın']
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', alt: 'Villa', width: 800, height: 600 }
    ],
    agent: {
      id: 'agent-1',
      name: 'Ahmet Yılmaz',
      phone: '+90 532 123 45 67',
      whatsapp: '+905321234567',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      agency: { name: 'Yılmaz Emlak', logo: '', verified: true }
    },
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    viewCount: 2100,
    favoriteCount: 78,
    status: 'active'
  },
  {
    id: 'cf-demo-4',
    slug: 'besiktas-levent-ofis',
    title: 'Levent\'te Prestijli Ofis',
    description: 'Levent iş merkezinde A+ ofis katı',
    price: 8500000,
    currency: 'TRY',
    pricePerSqm: 42500,
    listingType: 'sale',
    propertyType: 'office',
    location: {
      city: 'İstanbul',
      district: 'Beşiktaş',
      neighborhood: 'Levent',
      coordinates: { lat: 41.0821, lng: 29.0112 }
    },
    specs: {
      roomCount: 'Açık Plan',
      grossArea: 220,
      netArea: 200,
      floor: 15,
      totalFloors: 25,
      buildingAge: 2,
      heatingType: 'Merkezi Sistem',
      bathroomCount: 2,
      balcony: false,
      furnished: 'partial',
      usageStatus: 'empty',
      inComplex: true,
      dues: 5000,
      deposit: null,
      deedStatus: 'Kat Mülkiyetli',
      exchange: false
    },
    features: {
      interior: ['Klima', 'Yangın Algılama'],
      exterior: ['Asansör', 'Güvenlik', 'Otopark'],
      location: ['Metro Yakın', 'AVM Yakın']
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', alt: 'Ofis', width: 800, height: 600 }
    ],
    agent: {
      id: 'agent-3',
      name: 'Mehmet Demir',
      phone: '+90 533 456 78 90',
      whatsapp: '+905334567890',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      agency: { name: 'Demir Ticari', logo: '', verified: true }
    },
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    viewCount: 560,
    favoriteCount: 23,
    status: 'active'
  },
  {
    id: 'cf-demo-5',
    slug: 'uskudar-kiralik-1-1',
    title: 'Üsküdar\'da Merkezi 1+1 Kiralık',
    description: 'Üsküdar merkez\'de metro yakını kiralık daire',
    price: 18000,
    currency: 'TRY',
    pricePerSqm: 300,
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      city: 'İstanbul',
      district: 'Üsküdar',
      neighborhood: 'Altunizade',
      coordinates: { lat: 41.0221, lng: 29.0356 }
    },
    specs: {
      roomCount: '1+1',
      grossArea: 65,
      netArea: 60,
      floor: 6,
      totalFloors: 10,
      buildingAge: 8,
      heatingType: 'Kombi (Doğalgaz)',
      bathroomCount: 1,
      balcony: true,
      furnished: 'yes',
      usageStatus: 'empty',
      inComplex: false,
      dues: 600,
      deposit: 36000,
      deedStatus: 'Kat Mülkiyetli',
      exchange: false
    },
    features: {
      interior: ['Eşyalı', 'Klima', 'Bulaşık Makinesi'],
      exterior: ['Asansör', 'Otopark'],
      location: ['Metroya Yakın', 'AVM Yakın']
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', alt: 'Daire', width: 800, height: 600 }
    ],
    agent: {
      id: 'agent-4',
      name: 'Zeynep Arslan',
      phone: '+90 534 111 22 33',
      whatsapp: '+905341112233',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
      agency: { name: 'Arslan Emlak', logo: '', verified: false }
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    viewCount: 320,
    favoriteCount: 15,
    status: 'active'
  }
];

// Tüm properties
export const allProperties: Property[] = [mockProperty, ...similarProperties];

// Property'yi ID ile bul
export function getPropertyById(id: string): Property | undefined {
  return allProperties.find(p => p.id === id);
}

// Property'yi slug ile bul
export function getPropertyBySlug(slug: string): Property | undefined {
  return allProperties.find(p => p.slug === slug);
}

