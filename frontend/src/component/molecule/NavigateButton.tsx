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
    <div className='flex w-full justify-center'>
      <Button cssOption={cssOption} content={content} onClick={handleNavigate} />
    </div>
  );
}
