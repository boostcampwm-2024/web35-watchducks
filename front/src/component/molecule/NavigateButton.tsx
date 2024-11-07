import Button from '@component/atom/Button';
import { useNavigate } from 'react-router-dom';

type Props = {
  path: string;
};

export default function NavigateButton({ path = '' }: Props) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(path);
  };
  return (
    <div className='flex justify-center px-[40px] py-[20px]'>
      <Button
        cssOption='w-[100%] bg-blue rounded-[10px] text-white text-[25px] px-[100px] py-[10px] flex items-center justify-center whitespace-nowrap hover:text-black'
        content='메인으로'
        onClick={handleNavigate}
      />
    </div>
  );
}
