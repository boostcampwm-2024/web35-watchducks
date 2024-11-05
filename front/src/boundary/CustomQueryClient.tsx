import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getErrorByCode } from './toastError';
import axios from 'axios';

export default function CustomQueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        throwOnError: true
      },
      mutations: {
        onError: (error: any) => {
          const errorData = getErrorByCode(error);
          toast.error(`[${errorData.code}] ${errorData.message}`);
        }
      }
    }
  });

  const postFn = async () => {
    const response = await axios.post('/error');
    return response;
  };

  queryClient.setMutationDefaults(['error'], { mutationFn: postFn });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
