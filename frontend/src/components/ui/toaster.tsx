"use client";

import { useToastStore } from "@/lib/stores/toast-store";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          title={t.title}
          description={t.description}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}
