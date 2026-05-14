import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('quik_token', token);
        }
        set({ user, token });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('quik_token');
          localStorage.removeItem('quik_user');
        }
        set({ user: null, token: null });
      },

      isAuthenticated: () => {
        if (typeof window !== 'undefined') {
          return !!localStorage.getItem('quik_token');
        }
        return false;
      },
    }),
    { name: 'quik-user' }   // removed skipHydration so store rehydrates on refresh
  )
);

export default useUserStore;
