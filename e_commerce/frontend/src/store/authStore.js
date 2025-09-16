import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          const { access, refresh } = response.data;
          
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          
          // Decode user info from token (basic implementation)
          const tokenPayload = JSON.parse(atob(access.split('.')[1]));
          const user = {
            id: tokenPayload.user_id,
            username: tokenPayload.username,
            email: tokenPayload.email,
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.detail || 'Login failed';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          await authAPI.register(userData);
          set({ isLoading: false });
          toast.success('Registration successful! Please login.');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || 'Registration failed';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      // Check if user is authenticated
      checkAuth: () => {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const user = {
              id: tokenPayload.user_id,
              username: tokenPayload.username,
              email: tokenPayload.email,
            };
            set({ user, isAuthenticated: true });
          } catch (error) {
            // Token is invalid
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
