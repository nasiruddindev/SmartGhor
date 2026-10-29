export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  slug: string;
  category: 'smart-home' | 'kitchen-gadgets' | 'audio-wearables' | 'lifestyle' | 'lighting';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isFlashSale?: boolean;
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  colors?: { name: string; hex: string }[];
  warranty?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  itemCount: number;
  image: string;
  iconName: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  verified: boolean;
}
