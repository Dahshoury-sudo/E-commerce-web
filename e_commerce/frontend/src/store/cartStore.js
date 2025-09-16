import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '../services/api';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      totalPrice: 0,
      totalItems: 0,

      // Add item to cart
      addItem: async (productId, quantity = 1) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          toast.error('Please login to add items to cart');
          return { success: false };
        }

        set({ isLoading: true });
        try {
          await cartAPI.addItem(productId, quantity);
          await get().fetchCartItems();
          toast.success('Item added to cart!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || 'Failed to add item to cart';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Remove item from cart
      removeItem: async (productId) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          toast.error('Please login to manage cart');
          return { success: false };
        }

        set({ isLoading: true });
        try {
          await cartAPI.removeItem(productId);
          await get().fetchCartItems();
          toast.success('Item removed from cart');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || 'Failed to remove item from cart';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Update item quantity
      updateQuantity: async (productId, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          toast.error('Please login to manage cart');
          return { success: false };
        }

        if (quantity === 0) {
          return get().removeItem(productId);
        }

        set({ isLoading: true });
        try {
          await cartAPI.editItem(productId, quantity);
          await get().fetchCartItems();
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || 'Failed to update cart';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Fetch cart items
      fetchCartItems: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const response = await cartAPI.getItems();
          const items = response.data.items;
          const totalPrice = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
          const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
          
          set({ items, totalPrice, totalItems, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to fetch cart items:', error);
        }
      },

      // Clear cart
      clearCart: () => {
        set({ items: [], totalPrice: 0, totalItems: 0 });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        totalPrice: state.totalPrice, 
        totalItems: state.totalItems 
      }),
    }
  )
);
