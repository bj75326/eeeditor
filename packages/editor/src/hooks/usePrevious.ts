import { useRef } from 'react';

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => a !== b;

export function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
): T | undefined {
  const prevRef = useRef<T>();
  const currRef = useRef<T>();

  if (shouldUpdate(currRef.current, state)) {
    prevRef.current = currRef.current;
    currRef.current = state;
  }

  return prevRef.current;
}

export default usePrevious;
