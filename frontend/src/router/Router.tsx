import MainBoundary from '@boundary/MainBoundary';
import ErrorPage from '@component/page/ErrorPage';
import MainPage from '@component/page/MainPage';
import ProjectDetailPage from '@component/page/ProjectDetailPage';
import ProjectPage from '@component/page/ProjectPage';
import RankingPage from '@component/page/RankingPage';
import RegisterPage from '@component/page/RegisterPage';
import { createBrowserRouter } from 'react-router-dom';

export default createBrowserRouter([
  {
    element: <MainBoundary />,
    children: [
      {
        path: '/',
        element: <MainPage />
      },
      {
        path: '/project',
        element: <ProjectPage />
      },
      {
        path: '/project/:id',
        element: <ProjectDetailPage />
      },
      {
        path: '/ranking',
        element: <RankingPage />
      }
    ]
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);
