import React, { RefObject, useEffect, useRef, useState } from 'react';
import useWindowSize from './useWindowSize';

type Size = [width: number, height: number];

function useElementSize<T extends HTMLElement>(): [RefObject<T>, Size] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>([0, 0]);
  const updateSize = () => {
    setSize((previous) => {
      if (ref.current == null) {
        return previous;
      }
      const next: Size = [ref.current.offsetWidth, ref.current.offsetHeight];
      return previous[0] === next[0] && previous[1] === next[1]
        ? previous
        : next;
    });
  };
  useEffect(() => updateSize());
  useWindowSize(() => updateSize());
  return [ref, size];
}

type Vector = [magnitude: number, direction: number];
type Point = [x: number, y: number];
type Path = Vector[];

function vectorToCartesian([magnitude, direction]: Vector): Point {
  return [
    Math.cos(direction * (Math.PI / 180)) * magnitude,
    Math.sin(direction * (Math.PI / 180)) * magnitude,
  ];
}

function labeled(label: string): (p: Point) => string {
  return ([x, y]) => ` ${label}${x},${y}`;
}

const l = labeled('l');

const M = labeled('M');

function compose<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C {
  return (a) => fn2(fn1(a));
}

function createPath(path: Path): string {
  const [initial, ...rest] = path;
  return (
    rest.reduce(
      (d, v) => d + compose(vectorToCartesian, l)(v),
      compose(vectorToCartesian, M)(initial)
    ) + ' z'
  );
}

export const UserBar2 = () => {
  const [ref, [width, height]] = useElementSize<HTMLDivElement>();
  const points: Path = [
    [width, 0],
    [height, 90],
    [width, 180],
    [height, 270],
  ];
  return (
    <div ref={ref}>
      <svg height="400" width="100%">
        <path d={createPath(points)} fill="red" />
      </svg>
    </div>
  );
};

export const UserBar = ({
  fill = '#fffc',
  className,
}: {
  fill?: string;
  className?: string;
}) => {
  const [ref, [width, height]] = useElementSize<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <svg style={{ display: 'block' }} height="100%" width="100%">
        <path
          d={`M${height * 0.5},0 l${width - height},0 a ${height * 0.5} ${
            height * 0.5
          } 180 1 1 0,${height} l${-(width - height)},0 a ${height * 0.5} ${
            height * 0.5
          } 180 1 1 0,${-height}`}
          fill={fill}
        />
      </svg>
    </div>
  );
};
