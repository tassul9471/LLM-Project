import { 
  User, 
  Product, 
  Advertisement, 
  AdContent, 
  DashboardStats,
  AdminDashboardStats,
  AdminUserItem,
  AdminProductItem,
  AdminAdItem
} from '../types/index.js';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('ai_ad_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: 'Invalid response format from server.',
  }));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () =>
    request<{ success: boolean; user: User }>('/auth/me', {
      method: 'GET',
    }),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),
};

export const productApi = {
  getAll: () =>
    request<{ success: boolean; count: number; products: Product[] }>('/products', {
      method: 'GET',
    }),

  getById: (id: string) =>
    request<{ success: boolean; product: Product }>(`/products/${id}`, {
      method: 'GET',
    }),

  create: (data: Omit<Product, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    request<{ success: boolean; message: string; product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Product>) =>
    request<{ success: boolean; message: string; product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  seedSampleData: () =>
    request<{ success: boolean; message: string }>('/products/seed', {
      method: 'POST',
    }),
};

export const adApi = {
  generate: (params: {
    name: string;
    category?: string;
    description: string;
    features: string;
    benefits: string;
    audience: string;
    price?: string | number;
    offer?: string;
    tone?: string;
    platform?: string;
    contentLength?: string;
    adType?: string;
    isRegeneration?: boolean;
  }) =>
    request<{ success: boolean; message: string; generatedContent: AdContent }>('/ads/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  save: (data: {
    productId?: string | null;
    productName: string;
    tone: string;
    platform: string;
    contentLength: string;
    adType: string;
    generatedContent: AdContent;
    editedContent?: Partial<AdContent>;
  }) =>
    request<{ success: boolean; message: string; ad: Advertisement }>('/ads/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getHistory: () =>
    request<{ success: boolean; count: number; ads: Advertisement[] }>('/ads/history', {
      method: 'GET',
    }),

  getById: (id: string) =>
    request<{ success: boolean; ad: Advertisement }>(`/ads/${id}`, {
      method: 'GET',
    }),

  update: (id: string, data: { editedContent?: Partial<AdContent>; tone?: string; platform?: string }) =>
    request<{ success: boolean; message: string; ad: Advertisement }>(`/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/ads/${id}`, {
      method: 'DELETE',
    }),

  getDashboardStats: () =>
    request<{ success: boolean; stats: DashboardStats }>('/ads/dashboard-stats', {
      method: 'GET',
    }),
};

export const healthApi = {
  check: () =>
    request<{ status: string; service: string; version: string; uptime: number }>('/health', {
      method: 'GET',
    }),
};

export const adminApi = {
  getDashboard: () =>
    request<{ success: boolean; stats: AdminDashboardStats }>('/admin/dashboard', {
      method: 'GET',
    }),

  getUsers: (search?: string) =>
    request<{ success: boolean; count: number; users: AdminUserItem[] }>(
      `/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`,
      { method: 'GET' }
    ),

  getUserById: (id: string) =>
    request<{ success: boolean; user: AdminUserItem & { products: Product[]; ads: Advertisement[] } }>(
      `/admin/users/${id}`,
      { method: 'GET' }
    ),

  deleteUser: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  getProducts: (search?: string) =>
    request<{ success: boolean; count: number; products: AdminProductItem[] }>(
      `/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`,
      { method: 'GET' }
    ),

  getProductById: (id: string) =>
    request<{ success: boolean; product: AdminProductItem }>(`/admin/products/${id}`, {
      method: 'GET',
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  getAds: (search?: string) =>
    request<{ success: boolean; count: number; ads: AdminAdItem[] }>(
      `/admin/ads${search ? `?search=${encodeURIComponent(search)}` : ''}`,
      { method: 'GET' }
    ),

  getAdById: (id: string) =>
    request<{ success: boolean; ad: Advertisement & { ownerName: string; ownerEmail: string } }>(
      `/admin/ads/${id}`,
      { method: 'GET' }
    ),

  deleteAd: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/ads/${id}`, {
      method: 'DELETE',
    }),
};
