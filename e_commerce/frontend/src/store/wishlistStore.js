import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistAPI } from '../services/api';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      // Add item to wishlist
      addItem: async (productId) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          toast.error('Please login to add items to wishlist');
          return { success: false };
        }

        set({ isLoading: true });
        try {
          await wishlistAPI.addItem(productId);
          await get().fetchWishlistItems();
          toast.success('Item added to wishlist!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || error.response?.data?.error || 'Failed to add item to wishlist';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Remove item from wishlist
      removeItem: async (productId) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          toast.error('Please login to manage wishlist');
          return { success: false };
        }

        set({ isLoading: true });
        try {
          await wishlistAPI.removeItem(productId);
          await get().fetchWishlistItems();
          toast.success('Item removed from wishlist');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || 'Failed to remove item from wishlist';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Fetch wishlist items
      fetchWishlistItems: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const response = await wishlistAPI.getItems();
          const items = response.data.wishlist?.products || [];
          set({ items, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to fetch wishlist items:', error);
        }
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.product_id === productId);
      },

      // Clear wishlist
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
