import MainPage from '@component/page/MainPage';
import ProjectPage from '@component/page/ProjectPage';
import RankingPage from '@component/page/RankingPage';
import RegisterPage from '@component/page/RegisterPage';
import { Routes, Route } from 'react-router-dom';

import MainBoundary from './boundary/MainBoundary';

function App() {
  return (
    <Routes>
      <Route element={<MainBoundary />}>
        <Route path='/' element={<MainPage />} />
        <Route path='/project' element={<ProjectPage />} />
        <Route path='/ranking' element={<RankingPage />} />
      </Route>
      <Route path='/register' element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
