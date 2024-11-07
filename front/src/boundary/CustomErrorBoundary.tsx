import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import CustomErrorFallback from './CustomErrorFallback';

import Loading from '@/component/atom/Loading';

export default function CustomErrorBoundary({ children }: { children: React.ReactElement }) {
  return (
    <ErrorBoundary FallbackComponent={CustomErrorFallback}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
