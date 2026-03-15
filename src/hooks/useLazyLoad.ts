/**
 * useLazyLoad Hook
 *
 * Intersection Observer hook for lazy loading images and components.
 * Validates: Requirements 16.1
 */

import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyLoad<T extends HTMLElement>(
  options: UseLazyLoadOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = '100px' } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}

export default useLazyLoad;
