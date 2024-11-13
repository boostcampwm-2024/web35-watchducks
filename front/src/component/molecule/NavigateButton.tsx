import Button from '@component/atom/Button';
import { useNavigate } from 'react-router-dom';

type Props = {
  path: string;
  content: string;
  cssOption?: string;
};

export default function NavigateButton({ path = '', content = '', cssOption }: Props) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(path);
  };
  return (
    <div className='flex justify-center px-[40px] py-[20px]'>
      <Button cssOption={cssOption} content={content} onClick={handleNavigate} />
    </div>
  );
}
