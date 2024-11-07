import MainPage from '@component/page/MainPage';
import RegisterPage from '@component/page/RegisterPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainPage />}></Route>
      <Route path='/register' element={<RegisterPage />}></Route>
    </Routes>
  );
}

export default App;
