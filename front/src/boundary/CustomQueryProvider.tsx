import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

export default function CustomQueryProvider({ children }: Props) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1
      },
      mutations: {
        retry: 1
      }
    }
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
