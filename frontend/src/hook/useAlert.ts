import { useState, useEffect } from 'react';

type Props = {
  time: number;
};

export default function useAlert({ time }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const showAlert = (alertMessage: string) => {
    setMessage(alertMessage);
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setMessage('');
      }, time);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return { isVisible, message, showAlert };
}
