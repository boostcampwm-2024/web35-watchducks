import ProjectActiveImg from '@asset/image/ProjectActive.png';
import ProjectInactiveImg from '@asset/image/ProjectInactive.png';
import ProjectsActiveImg from '@asset/image/ProjectsActive.svg';
import ProjectsInactiveImg from '@asset/image/ProjectsInactive.svg';
import RankingActiveImg from '@asset/image/RankingActive.png';
import RankingInactiveImg from '@asset/image/RankingInactive.png';
import { MenuItem } from '@type/Navbar';

const MENU_ITEMS: MenuItem[] = [
  {
    path: '/',
    label: '전체 프로젝트 보기',
    activeIcon: ProjectsActiveImg,
    inactiveIcon: ProjectsInactiveImg
  },
  {
    path: '/project',
    label: '개별 프로젝트 보기',
    activeIcon: ProjectActiveImg,
    inactiveIcon: ProjectInactiveImg
  },
  {
    path: '/ranking',
    label: '프로젝트 랭킹 보기',
    activeIcon: RankingActiveImg,
    inactiveIcon: RankingInactiveImg
  }
] as const;

export { MENU_ITEMS };
