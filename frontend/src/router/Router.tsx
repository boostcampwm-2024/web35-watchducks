import MainBoundary from '@boundary/MainBoundary';
import Loading from '@component/atom/Loading';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const MainPage = lazy(() => import('@component/page/MainPage'));
const ProjectPage = lazy(() => import('@component/page/ProjectPage'));
const ProjectDetailPage = lazy(() => import('@component/page/ProjectDetailPage'));
const RankingPage = lazy(() => import('@component/page/RankingPage'));
const RegisterPage = lazy(() => import('@component/page/RegisterPage'));
const ErrorPage = lazy(() => import('@component/page/ErrorPage'));

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className='flex h-full w-full items-center justify-center'>
          <Loading />
        </div>
      }>
      {children}
    </Suspense>
  );
}

export default createBrowserRouter([
  {
    element: <MainBoundary />,
    children: [
      {
        path: '/',
        element: (
          <LazyWrapper>
            <MainPage />
          </LazyWrapper>
        )
      },
      {
        path: '/project',
        element: (
          <LazyWrapper>
            <ProjectPage />
          </LazyWrapper>
        )
      },
      {
        path: '/project/:id',
        element: (
          <LazyWrapper>
            <ProjectDetailPage />
          </LazyWrapper>
        )
      },
      {
        path: '/ranking',
        element: (
          <LazyWrapper>
            <RankingPage />
          </LazyWrapper>
        )
      }
    ]
  },
  {
    path: '/register',
    element: (
      <LazyWrapper>
        <RegisterPage />
      </LazyWrapper>
    )
  },
  {
    path: '*',
    element: (
      <LazyWrapper>
        <ErrorPage />
      </LazyWrapper>
    )
  }
]);
