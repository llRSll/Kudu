"use client";

import { useCallback } from "react";
import { toastService, ToastService } from "@/lib/services/toast-service";

export interface UseAppToastReturn extends ToastService {
  // Additional helper methods
  handleApiCall: <T>(
    apiCall: () => Promise<T>,
    options: {
      loadingMessage: string;
      successMessage: string;
      errorMessage?: string;
    }
  ) => Promise<T>;
}

export function useAppToast(): UseAppToastReturn {
  const handleApiCall = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      options: {
        loadingMessage: string;
        successMessage: string;
        errorMessage?: string;
      }
    ): Promise<T> => {
      return toastService.promise(apiCall(), {
        loading: options.loadingMessage,
        success: options.successMessage,
        error: (error) => {
          if (options.errorMessage) return options.errorMessage;
          return error?.message || "An error occurred";
        },
      });
    },
    []
  );

  return {
    ...toastService,
    handleApiCall,
  };
}
