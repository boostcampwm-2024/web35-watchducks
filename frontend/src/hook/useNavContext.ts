import { useOutletContext } from 'react-router-dom';

export function useNavContext<T>() {
  return useOutletContext<T>();
}
