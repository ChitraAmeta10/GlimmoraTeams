import { create } from "zustand";

export type ToastVariant = "default" | "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export function toast(title: string, options?: Partial<Omit<ToastItem, "id" | "title">>) {
  useToastStore.getState().addToast({
    title,
    variant: "default",
    ...options,
  });
}

toast.success = (title: string, description?: string) =>
  useToastStore.getState().addToast({ title, description, variant: "success" });

toast.error = (title: string, description?: string) =>
  useToastStore.getState().addToast({ title, description, variant: "error" });

toast.warning = (title: string, description?: string) =>
  useToastStore.getState().addToast({ title, description, variant: "warning" });

toast.info = (title: string, description?: string) =>
  useToastStore.getState().addToast({ title, description, variant: "info" });
