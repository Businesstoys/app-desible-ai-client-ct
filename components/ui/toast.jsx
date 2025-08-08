"use client";

import { toast, Toaster } from "sonner";

// Toaster component setup
export const ToastProvider = () => {
  return <Toaster richColors position="bottom-right" />;
};

// Success toast
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    description: options.description,
    duration: options.duration || 3000,
  });
};

// Error toast with custom red styling
export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    description: options.description || 'Somthing went wrrong',
    duration: options.duration || 5000, // Default: 5 seconds
    style: {
      backgroundColor: "#ff0000",
      color: "#ffffff",
      border: "1px solid #cc0000",
    },
  });
};