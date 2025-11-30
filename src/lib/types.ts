export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  hours: {
    [key: string]: string;
  };
  amenities: string[];
  studentDiscount: boolean;
  latitude: number;
  longitude: number;
  nearbyInstitutions: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Review {
  id: string;
  businessId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  businessId?: string;
  businessName?: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
}

export interface FilterOptions {
  category: string[];
  priceRange: string[];
  rating: number;
  studentDiscount: boolean;
  openNow: boolean;
  searchQuery: string;
  institution?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university';
  lat: number;
  lon: number;
  address?: string;
}

export interface NearbyBusiness {
  name: string;
  category: string;
  open_now: boolean;
  rating: number;
  address?: string;
  distance: number;
  lat: number;
  lng: number;
  place_id: string;
}

export interface RealDataResponse {
  institutions: Institution[];
  nearby_businesses: NearbyBusiness[];
  status: string;
  message?: string;
}

export interface ExternalBusiness {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  price_range: string;
  source: string;
}
