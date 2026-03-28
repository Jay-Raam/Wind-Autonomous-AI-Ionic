/**
 * UI Store (Zustand)
 * Manages global UI state (toasts, modals, etc.)
 */

import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  toasts: Toast[];
  isSideMenuOpen: boolean;

  // Toast Actions
  addToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Menu Actions
  setSideMenuOpen: (isOpen: boolean) => void;
  toggleSideMenu: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set: any) => ({
  toasts: [],
  isSideMenuOpen: false,

  addToast: (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
    const id = `toast-${toastCounter++}`;
    set((state: any) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration !== 0) {
      setTimeout(() => {
        set((state: any) => ({
          toasts: state.toasts.filter((t: any) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id: string) => {
    set((state: any) => ({
      toasts: state.toasts.filter((t: any) => t.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),

  setSideMenuOpen: (isOpen: boolean) => set({ isSideMenuOpen: isOpen }),
  toggleSideMenu: () => set((state: any) => ({ isSideMenuOpen: !state.isSideMenuOpen })),
}));
