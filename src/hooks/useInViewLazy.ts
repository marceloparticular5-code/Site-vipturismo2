import { useEffect, useState, useRef, RefObject } from 'react';

interface UseInViewLazyOptions {
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

/**
 * Custom hook to detect when an element is approaching or inside the viewport.
 * Perfect for lazy rendering heavy DOM trees, photo grids, and social proof carousels.
 */
export function useInViewLazy<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewLazyOptions = {}
): [RefObject<T | null>, boolean] {
  const { rootMargin = '250px', threshold = 0.01, triggerOnce = true } = options;
  const containerRef = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Fallback if IntersectionObserver is unsupported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, triggerOnce]);

  return [containerRef, isInView];
}
