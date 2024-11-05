import { FallbackProps } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { getErrorByCode } from './toastError';

export default function CustomErrorFallBack({ error, resetErrorBoundary }: FallbackProps) {
  const { reset } = useQueryErrorResetBoundary();
  const errorData = getErrorByCode(error);

  const handleClickReset = () => {
    resetErrorBoundary();
    reset();
  };

  return (
    <div>
      <p>{error.toString()}</p>
      <h1>{errorData?.code}</h1>
      <h2>{errorData?.message}</h2>
      <button onClick={handleClickReset}>재시도</button>
    </div>
  );
}
