import Loading from '@component/atom/Loading';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import CustomErrorFallback from './CustomErrorFallback';

type Props = {
  children: React.ReactNode;
};

export default function CustomErrorBoundary({ children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={CustomErrorFallback}>
          <div className='w-full'>
            <Suspense
              fallback={
                <div className='flex h-full w-full items-center justify-center'>
                  <Loading />
                </div>
              }>
              {children}
            </Suspense>
          </div>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
