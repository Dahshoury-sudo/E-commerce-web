import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/signup/', userData),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products/'),
  getById: (productId) => api.post('/products/get/', { product_id: productId }),
};

// Cart API
export const cartAPI = {
  addItem: (productId, quantity) => api.post('/cart/add/', { product_id: productId, quantity }),
  removeItem: (productId) => api.delete('/cart/remove/', { data: { product_id: productId } }),
  editItem: (productId, quantity) => api.patch('/cart/edit/', { product_id: productId, quantity }),
  getItems: () => api.get('/cart/items/'),
};

// Wishlist API
export const wishlistAPI = {
  addItem: (productId) => api.post('/wishlist/add/', { product_id: productId }),
  removeItem: (productId) => api.delete('/wishlist/remove/', { data: { product_id: productId } }),
  getItems: () => api.get('/wishlist/items/'),
};

// Orders API
export const ordersAPI = {
  placeOrder: (orderData) => api.post('/order/add/', orderData),
  cancelOrder: (orderId) => api.patch('/order/cancel/', { order_id: orderId }),
};

// Reviews API
export const reviewsAPI = {
  getRecent: () => api.get('/reviews/recent/'),
  addReview: (reviewData) => api.post('/reviews/add/', reviewData),
};

export default api;
