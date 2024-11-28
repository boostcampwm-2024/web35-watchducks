import MainBoundary from '@boundary/MainBoundary';
import ErrorPage from '@component/page/ErrorPage';
import MainPage from '@component/page/MainPage';
import ProjectDetailPage from '@component/page/ProjectDetailPage';
import ProjectPage from '@component/page/ProjectPage';
import RankingPage from '@component/page/RankingPage';
import RegisterPage from '@component/page/RegisterPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route element={<MainBoundary />}>
        <Route path='/' element={<MainPage />} />
        <Route path='/project' element={<ProjectPage />} />
        <Route path='/project/:id' element={<ProjectDetailPage />} />
        <Route path='/ranking' element={<RankingPage />} />
      </Route>
      <Route path='/register' element={<RegisterPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
