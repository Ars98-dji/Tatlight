// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const REMEMBER_KEY = 'remember_me'

// Stockage des tokens : localStorage si "Se souvenir de moi", sinon sessionStorage
export const tokenStorage = {
  get(key: string): string | null {
    return localStorage.getItem(key) || sessionStorage.getItem(key)
  },
  set(key: string, value: string, remember?: boolean) {
    const persistent = remember ?? localStorage.getItem(REMEMBER_KEY) === 'true'
    const storage = persistent ? localStorage : sessionStorage
    storage.setItem(key, value)
  },
  remove(key: string) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
  setRememberMe(remember: boolean) {
    localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false')
  },
}

// Configuration d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le rafraîchissement du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login/')) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.get('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        tokenStorage.set('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token de rafraîchissement invalide, déconnecter l'utilisateur
        tokenStorage.remove('access_token');
        tokenStorage.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// === AUTHENTIFICATION ===

export const authService = {
  // Inscription
  register: async (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  // Connexion
  login: async (email: string, password: string, remember: boolean = true) => {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.tokens) {
      tokenStorage.setRememberMe(remember);
      tokenStorage.set('access_token', response.data.tokens.access, remember);
      tokenStorage.set('refresh_token', response.data.tokens.refresh, remember);
    }
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const refreshToken = tokenStorage.get('refresh_token');
    try {
      await api.post('/auth/logout/', { refresh_token: refreshToken });
    } finally {
      tokenStorage.remove('access_token');
      tokenStorage.remove('refresh_token');
    }
  },

  // Récupérer le profil
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (data: any) => {
    const response = await api.patch('/auth/profile/update/', data);
    return response.data;
  },

  // Télécharger une photo de profil
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/auth/profile/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }) => {
    const response = await api.post('/auth/password/change/', data);
    return response.data;
  },

  // Demander la réinitialisation du mot de passe
  resetPassword: async (email: string) => {
    const response = await api.post('/auth/password/reset/', { email });
    return response.data;
  },

  // Confirmer la réinitialisation du mot de passe
  confirmResetPassword: async (data: {
    uid: string;
    token: string;
    new_password: string;
    new_password_confirm: string;
  }) => {
    const response = await api.post('/auth/password/reset/confirm/', data);
    return response.data;
  },

  // Vérifier l'adresse email
  verifyEmail: async (uid: string, token: string) => {
    const response = await api.get(`/auth/verify-email/${uid}/${token}/`);
    return response.data;
  },

  // Renvoyer l'email de vérification
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification/', { email });
    return response.data;
  },

  // Supprimer le compte
  deleteAccount: async () => {
    const response = await api.delete('/auth/delete/');
    tokenStorage.remove('access_token');
    tokenStorage.remove('refresh_token');
    return response.data;
  },
};

// === PRODUITS ===

export const productService = {
  getProducts: async (params?: Record<string, string>) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  getProduct: async (slug: string) => {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories/');
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured/');
    return response.data;
  },

  getProductsByType: async (type: string, params?: Record<string, string>) => {
    const response = await api.get(`/products/type/${type}/`, { params });
    return response.data;
  },

  getProductsByCategory: async (categorySlug: string, params?: Record<string, string>) => {
    const response = await api.get('/products/', { params: { category__slug: categorySlug, ...params } });
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await api.get('/products/search/', { params: { q: query } });
    return response.data;
  },

  getProductReviews: async (productId: string) => {
    const response = await api.get(`/products/${productId}/reviews/`);
    return response.data;
  },

  createReview: async (productId: string, data: { rating: number; comment: string }) => {
    const response = await api.post(`/products/${productId}/reviews/`, data);
    return response.data;
  },

  // Admin
  adminGetProducts: async () => {
    const response = await api.get('/products/admin/products/');
    return response.data;
  },

  adminCreateProduct: async (data: any) => {
    const response = await api.post('/products/admin/products/', data)
    return response.data;
  },

  adminUpdateProduct: async (slug: string, data: any) => {
    const response = await api.patch(`/products/admin/products/${slug}/`, data)
    return response.data;
  },

  adminDeleteProduct: async (slug: string) => {
    const response = await api.delete(`/products/admin/products/${slug}/`);
    return response.data;
  },

  adminGetProductGallery: async (slug: string) => {
    const response = await api.get(`/products/admin/products/${slug}/gallery/`);
    return response.data;
  },

  adminAddGalleryImage: async (slug: string, file: File) => {
    const fd = new FormData()
    fd.append('image', file)
    const response = await api.post(`/products/admin/products/${slug}/gallery/`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  adminDeleteGalleryImage: async (slug: string, imageId: string) => {
    const response = await api.delete(`/products/admin/products/${slug}/gallery/${imageId}/`);
    return response.data;
  },

  adminCreateCategory: async (data: any) => {
    const response = await api.post('/products/admin/categories/', data);
    return response.data;
  },

  adminUpdateCategory: async (slug: string, data: any) => {
    const response = await api.patch(`/products/admin/categories/${slug}/`, data);
    return response.data;
  },

  adminDeleteCategory: async (id: number) => {
    const response = await api.delete(`/products/admin/categories/${id}/`);
    return response.data;
  },

  adminGetReviews: async () => {
    const response = await api.get('/products/admin/reviews/');
    return response.data;
  },

  adminDeleteReview: async (id: string) => {
    const response = await api.delete(`/products/admin/reviews/${id}/`);
    return response.data;
  },
};

// === COMMANDES ===

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  createOrder: async (data: {
    items: Array<{ product: string; quantity: number }>;
    billing_name?: string;
    billing_email?: string;
    billing_address?: string;
    coupon_code?: string;
    payment_method?: string;
  }) => {
    const response = await api.post('/orders/create/', data);
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post('/orders/confirm-payment/', { payment_intent_id: paymentIntentId });
    return response.data;
  },

  guestCheckout: async (data: {
    email: string;
    items: Array<{ product_id: string; quantity: number }>;
  }) => {
    const response = await api.post('/orders/guest-checkout/', data);
    return response.data;
  },

  getPurchases: async () => {
    const response = await api.get('/orders/purchases/');
    return response.data;
  },

  // Téléchargement protégé d'un produit acheté (authentifié + vérifié)
  downloadProduct: async (productId: string) => {
    const response = await api.get(`/orders/purchases/${productId}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  validateCoupon: async (code: string, total: number) => {
    const response = await api.post('/orders/coupons/validate/', { code, total });
    return response.data;
  },

  getCoupons: async () => {
    const response = await api.get('/orders/coupons/');
    return response.data;
  },

  createCoupon: async (data: any) => {
    const response = await api.post('/orders/coupons/', data);
    return response.data;
  },

  updateCoupon: async (id: string, data: any) => {
    const response = await api.patch(`/orders/coupons/${id}/`, data);
    return response.data;
  },

  deleteCoupon: async (id: string) => {
    const response = await api.delete(`/orders/coupons/${id}/`);
    return response.data;
  },

  adminGetOrders: async () => {
    const response = await api.get('/orders/admin/orders/');
    return response.data;
  },

  fedapayInitialize: async (data: {
    items: Array<{ product: string; quantity: number }>;
    billing_name?: string;
    billing_email?: string;
    billing_address?: string;
    coupon_code?: string;
  }) => {
    const response = await api.post('/orders/fedapay/initialize/', { ...data, payment_method: 'fedapay' });
    return response.data;
  },

  fedapayVerify: async (transaction_id: string) => {
    const response = await api.post('/orders/fedapay/verify/', { transaction_id });
    return response.data;
  },
};

// === FIDÉLITÉ ===

export const loyaltyService = {
  getSummary: async () => {
    const response = await api.get('/loyalty/summary/');
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/loyalty/transactions/');
    return response.data;
  },

  getRewards: async () => {
    const response = await api.get('/loyalty/rewards/');
    return response.data;
  },

  getRedemptions: async () => {
    const response = await api.get('/loyalty/redemptions/');
    return response.data;
  },

  redeemReward: async (rewardId: string) => {
    const response = await api.post('/loyalty/redeem/', { reward_id: rewardId });
    return response.data;
  },
};

// === UTILITAIRES ===

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/auth/admin/users/');
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/auth/admin/users/${id}/`);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.patch(`/auth/admin/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/auth/admin/users/${id}/`);
    return response.data;
  },
};

export const isAuthenticated = (): boolean => {
  return !!tokenStorage.get('access_token');
};

export default api;