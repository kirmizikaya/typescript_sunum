// interface çünkü domain nesnesi
export interface Location {
  city: string;
  district: string;
  neighborhood: string;
  lat: number;
  lng: number;
}

export interface ListingOwner {
  id: number;
  name: string;
  type: "individual" | "agency";
  phone: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: "TRY" | "USD" | "EUR";
  listingType: "satilik" | "kiralik";
  room: string;
  m2: number;
  isHighlighted: boolean;
  images: string[];
  location: Location;
  owner: ListingOwner;
}
