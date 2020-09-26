import React, { useState, useEffect, useRef } from 'react';
import useWindowSize from './useWindowSize';

const Shape = ({
  scope = 1,
  className,
}: {
  scope?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, setDimensions] = useState<[number, number]>([0, 0]);

  useWindowSize(
    () =>
      ref.current &&
      setDimensions([ref.current.offsetWidth, ref.current.offsetHeight])
  );
  useEffect(() => {
    setDimensions((d) => {
      if (!ref.current) {
        return d;
      }
      const [newWidth, newHeight] = [
        ref.current.offsetWidth,
        ref.current.offsetHeight,
      ] as const;
      return d[0] !== newWidth || d[1] !== newHeight
        ? [newWidth, newHeight]
        : d;
    });
  }, [setDimensions]);

  const [w, h] = [
    ref.current?.offsetWidth ?? 0,
    ref.current?.offsetHeight ?? 0,
  ];

  return (
    <div ref={ref} className={className}>
      <svg width={w} height={h}>
        <defs>
          <linearGradient id="bar-fill" x1={0} y1={0} x2={0} y2={1}>
            <stop offset="0" stopColor="#FFFA" />
            <stop offset="100%" stopColor="#FFFA" />
          </linearGradient>
        </defs>
        <polyline
          points={`${h * scope} 0, ${w} 0, ${w} ${h}, 0 ${h}`}
          fill="url(#bar-fill)"
        />
      </svg>
    </div>
  );
};

export { Shape as default };
