import MobileLayout from '@component/template/MobileLayout';
import useIsMobile from '@hook/useIsMobile';
import router from '@router/Router';
import { RouterProvider } from 'react-router-dom';

export default function App() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && <MobileLayout />}
      <RouterProvider router={router} />
    </>
  );
}
