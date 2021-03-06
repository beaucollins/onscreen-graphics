import React, { CSSProperties } from 'react';

export function Logo({
  logoColor = '#0003',
  size = 100,
  className,
  style,
}: {
  logoColor?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      <svg
        style={{ display: 'block' }}
        width={size}
        height={size}
        viewBox="-50 -50 100 100"
        fill="none"
      >
        <circle r="50%" fill="#DD4A40"></circle>
        <g fill={logoColor} transform="scale(0.6 0.6), translate(-50, -50)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M80.3409 73.2325C73.3285 82.6871 62.1426 88.806 49.5406 88.806C28.3056 88.806 11.0912 71.4319 11.0912 50C11.0912 28.5681 28.3056 11.194 49.5406 11.194C62.1013 11.194 73.2552 17.2729 80.2719 26.6747L89.1467 19.9596C80.1066 7.83813 65.7305 0 49.5406 0C22.1801 0 0 22.3858 0 50C0 77.6142 22.1801 100 49.5406 100C65.7718 100 80.1799 92.1219 89.2157 79.9476L80.3409 73.2325Z"
          ></path>
          <path d="M67.2751 68.0001L59.3775 56.148C64.0634 54.387 67.2751 50.598 67.2751 44.5676V44.4609C67.2751 36.7762 62.0627 32.1334 53.3754 32.1334H35.4218V68.0001H43.5299V57.5356H51.0062L57.798 68.0001H67.2751ZM59.0616 44.9946C59.0616 48.1432 56.7977 50.2778 52.8489 50.2778H43.5299V39.5513H52.691C56.6397 39.5513 59.0616 41.3657 59.0616 44.8878V44.9946Z"></path>
        </g>
      </svg>
    </div>
  );
}
