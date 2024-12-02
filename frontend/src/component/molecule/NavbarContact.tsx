import GithubImg from '@asset/image/Github.png';
import Img from '@component/atom/Img';
import P from '@component/atom/P';
import { PATH } from '@constant/Path';
import { Link } from 'react-router-dom';

export default function NavbarContact() {
  return (
    <div className='flex w-[100%] items-center gap-2'>
      <Link to={PATH.GITHUB} target='_blank' className='flex-shrink-0'>
        <Img src={GithubImg} alt='깃허브 이미지' cssOption='w-[24px] h-[24px] dark:invert' />
      </Link>
      <P
        cssOption='text-[0.6vw] flex items-center whitespace-nowrap truncate text-gray'
        content='Contact us : shson1217@naver.com'
      />
    </div>
  );
}
