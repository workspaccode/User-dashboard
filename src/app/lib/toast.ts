import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const typeStyles: Record<ToastType, { icon: string }> = {
  success: { icon: '✅' },
  error: { icon: '❌' },
  warning: { icon: '⚠️' },
  info: { icon: 'ℹ️' },
};

function show(type: ToastType, title: string, message?: string, duration = 4000) {
  const content = message ? `${title} — ${message}` : title;
  toast[type](content, { duration });
}

export const brToast = {
  success: (title: string, message?: string) => show('success', title, message),
  error: (title: string, message?: string) => show('error', title, message),
  warning: (title: string, message?: string) => show('warning', title, message),
  info: (title: string, message?: string) => show('info', title, message),
};
