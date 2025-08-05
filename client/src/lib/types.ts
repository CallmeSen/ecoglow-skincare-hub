export interface CartItemWithProduct {
  id: string;
  userId?: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    price: string;
    images: string[];
    carbonFootprint: string;
  };
}

export interface WishlistItemWithProduct {
  id: string;
  userId?: string;
  productId: string;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    price: string;
    images: string[];
    rating: string;
  };
}

export interface QuizData {
  skinType: string;
  concerns: string[];
  sustainability: string;
  budget: string;
  age?: string;
  routineComplexity?: string;
}

export interface ProductFilters {
  category?: string;
  skinType?: string;
  concern?: string;
  priceRange?: string;
  features?: string[];
  sortBy?: string;
}

export interface SustainabilityStats {
  treesPlanted: number;
  co2Offset: number;
  sustainablePackaging: number;
  happyCustomers: number;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'ingredient';
  value: string;
  label: string;
}
