import { ListingListResponse } from "../api/listing";


import { Listing } from "../models/listing";

export const dummyListings: Listing[] = [
  {
    id: 16832968,
    title: "Bağdat Caddesinde Deniz Manzaralı 3+1",
    description: "Full tadilatlı, metroya yakın, site içinde.",
    price: 12500000,
    currency: "TRY",
    listingType: "satilik",
    room: "3+1",
    m2: 140,
    isHighlighted: true,
    images: [
      "https://img.emlakjet.com/listing1.jpg",
      "https://img.emlakjet.com/listing1-2.jpg"
    ],
    location: {
      city: "İstanbul",
      district: "Kadıköy",
      neighborhood: "Suadiye",
      lat: 40.968,
      lng: 29.073,
    },
    owner: {
      id: 2201,
      name: "Doğan Gayrimenkul",
      type: "agency",
      phone: "+90 532 111 22 33",
    }
  },
  {
    id: 16832969,
    title: "Bornova'da Üniversiteye Yakın Kiralık 1+1",
    description: "Eşyalı, kombili, öğrenciye uygun.",
    price: 19000,
    currency: "TRY",
    listingType: "kiralik",
    room: "1+1",
    m2: 55,
    isHighlighted: false,
    images: [
      "https://img.emlakjet.com/listing2.jpg"
    ],
    location: {
      city: "İzmir",
      district: "Bornova",
      neighborhood: "Kazımdirik",
      lat: 38.462,
      lng: 27.215,
    },
    owner: {
      id: 3402,
      name: "Ahmet Yılmaz",
      type: "individual",
      phone: "+90 555 666 77 88",
    }
  }
];



export async function getListings(): Promise<ListingListResponse> {
  return {
    success: true,
    data: {
      items: dummyListings,
      page: 1,
      pageSize: 20,
      total: dummyListings.length,
    }
  };
}
