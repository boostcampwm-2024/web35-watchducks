import MobileLayout from '@component/template/MobileLayout';
import useIsMobile from '@hook/useIsMobile';
import router from '@router/Router';
import { Fragment } from 'react/jsx-runtime';
import { RouterProvider } from 'react-router-dom';

export default function App() {
  const isMobile = useIsMobile();

  return (
    <Fragment>
      {isMobile && <MobileLayout />}
      <RouterProvider router={router} />
    </Fragment>
  );
}
