"use client";

import toast from "react-hot-toast";

export interface ToastService {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (toastId: string) => void;
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
}

class ToastServiceImpl implements ToastService {
  success(message: string) {
    toast.success(message);
  }

  error(message: string) {
    toast.error(message);
  }

  loading(message: string): string {
    return toast.loading(message);
  }

  dismiss(toastId: string) {
    toast.dismiss(toastId);
  }

  promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ): Promise<T> {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  }

  // Helper methods for common API scenarios
  apiSuccess(operation: string) {
    this.success(`${operation} completed successfully`);
  }

  apiError(operation: string, error?: any) {
    const message = error?.message || error || `Failed to ${operation.toLowerCase()}`;
    this.error(message);
  }

  apiLoading(operation: string): string {
    return this.loading(`${operation}...`);
  }
}

export const toastService = new ToastServiceImpl();

// Export individual functions for convenience
export const { success, error, loading, dismiss, promise } = toastService;

// Helper functions for common patterns
export const showSuccess = (message: string) => toastService.success(message);
export const showError = (message: string) => toastService.error(message);
export const showLoading = (message: string) => toastService.loading(message);

// API-specific helpers
export const showApiSuccess = (operation: string) => toastService.apiSuccess(operation);
export const showApiError = (operation: string, error?: any) => toastService.apiError(operation, error);
export const showApiLoading = (operation: string) => toastService.apiLoading(operation);
