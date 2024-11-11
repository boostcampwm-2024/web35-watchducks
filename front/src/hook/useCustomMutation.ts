import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { getErrorByCode } from '@/boundary/toastError';

export default function useCustomMutation<TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    ...options,
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);

      const errorData = getErrorByCode(error as AxiosError<{ code: number; message: string }>);
      toast.error(`[${errorData.code}] ${errorData.message}`);
    }
  });
}
