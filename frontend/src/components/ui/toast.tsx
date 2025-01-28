import { toast as sonnerToast } from "sonner";

export const toast = {
  error: (message: string) => sonnerToast.error(message),
  success: (message: string) => sonnerToast.success(message),
  warning: (message: string) => sonnerToast.warning(message),
};
