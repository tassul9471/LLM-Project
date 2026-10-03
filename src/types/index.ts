export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalAds: number;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
  }>;
  recentAds: Array<{
    _id: string;
    productName: string;
    ownerName: string;
    ownerEmail: string;
    tone: string;
    platform: string;
    headline: string;
    createdAt: string;
  }>;
  platformBreakdown: Record<string, number>;
  toneBreakdown: Record<string, number>;
  activityTimeline: Array<{ date: string; count: number }>;
}

export interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  productCount: number;
  adCount: number;
}

export interface AdminProductItem extends Product {
  ownerName: string;
  ownerEmail: string;
}

export interface AdminAdItem {
  _id: string;
  productId?: string | null;
  productName: string;
  tone: string;
  platform: string;
  contentLength: string;
  adType: string;
  headline: string;
  shortDescription: string;
  createdAt: string;
  ownerName: string;
  ownerEmail: string;
}

export interface Product {
  _id: string;
  userId: string;
  name: string;
  category: string;
  description: string;
  features: string;
  benefits: string;
  audience: string;
  price?: string | number;
  offer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdContent {
  headline: string;
  shortDescription: string;
  longDescription: string;
  tagline: string;
  promotionalMessage: string;
  callToAction: string;
  socialMediaCopy: string;
}

export interface Advertisement {
  _id: string;
  userId: string;
  productId?: string | null;
  productName: string;
  tone: string;
  platform: string;
  contentLength: string;
  adType: string;
  generatedContent: AdContent;
  editedContent?: Partial<AdContent>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalAds: number;
  totalProducts: number;
  recentAds: Advertisement[];
}

export type AdTone = 'Professional' | 'Friendly' | 'Modern' | 'Creative' | 'Persuasive' | 'Casual';
export type AdPlatform = 'Social Media' | 'Website' | 'Email' | 'E-commerce' | 'General Advertisement';
export type AdLength = 'Short' | 'Medium' | 'Long';
export type AdType = 'Complete Advertisement' | 'Social Media' | 'Product Description' | 'Promotional Advertisement';
