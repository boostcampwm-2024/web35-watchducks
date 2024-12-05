import { useQueryErrorResetBoundary } from '@tanstack/react-query';

type Props = {
  resetErrorBoundary: () => void;
};

export default function CustomErrorFallback({ resetErrorBoundary }: Props) {
  const { reset } = useQueryErrorResetBoundary();

  const handleClickReset = () => {
    reset();
    resetErrorBoundary();
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <h1 className='text-black dark:text-white'>요청이 만료됐습니다. 재시도해주세요</h1>
      <button
        onClick={handleClickReset}
        className='flex items-center gap-2 rounded-lg bg-blue px-6 py-2 text-white shadow-md transition-all duration-200 hover:bg-opacity-90 hover:text-black active:scale-95'>
        재시도
      </button>
    </div>
  );
}
