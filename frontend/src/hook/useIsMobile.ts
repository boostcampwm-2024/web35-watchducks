import { useState, useEffect } from 'react';

export default function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = `(max-width: ${breakpoint}px)`;

    const mediaQueryList = window.matchMedia(mediaQuery);
    setIsMobile(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return isMobile;
}
