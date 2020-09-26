import { useState, useEffect } from 'react';

function windowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useWindowSize(
  onChange?: (size: { width: number; height: number }) => void
) {
  const [size, setSize] = useState(windowSize);

  useEffect(() => {
    const onResize = () => {
      setSize((previous) => {
        const newSize = windowSize();
        const unchanged =
          previous.width === newSize.width &&
          previous.height === newSize.height;

        !unchanged && onChange?.(newSize);

        return unchanged ? previous : newSize;
      });
    };

    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  });
  return size;
}
