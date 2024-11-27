import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

import { getErrorByCode } from '@/boundary/toastError';

interface ErrorResponse {
  code: number;
  message: string;
}

export default function useCustomMutation<TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    ...options,
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);

      if (axios.isAxiosError<ErrorResponse>(error)) {
        const errorData = getErrorByCode(error);
        toast.error(`[${errorData.code}] ${errorData.message}`);
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    }
  });
}
