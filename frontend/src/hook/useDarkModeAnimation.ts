import { Dimensions } from '@type/Navbar';
import { useState, useEffect } from 'react';
import { RefObject } from 'react';

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

export function useDuckAnimation({ containerRef }: Props) {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const duckAnimation = {
    x: [0, 0, dimensions.width, dimensions.width, 0, 0],
    y: [-16, -16, -16, dimensions.height, dimensions.height, -16],
    rotate: [0, 10, -10, 10, -10, 0],
    scale: [1, 1.1, 1, 1.1, 1, 1.1],
    transition: {
      duration: 20,
      times: [0, 0.1, 0.3, 0.5, 0.7, 1],
      repeat: Infinity,
      ease: [0.34, 1.56, 0.64, 1],
      rotate: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      },
      scale: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return duckAnimation;
}
