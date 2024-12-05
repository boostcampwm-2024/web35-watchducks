import CustomQueryProvider from '@boundary/CustomQueryProvider.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import App from './App.tsx';
import 'react-toastify/ReactToastify.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomQueryProvider>
      <App />
    </CustomQueryProvider>
    <ToastContainer />
  </StrictMode>
);
