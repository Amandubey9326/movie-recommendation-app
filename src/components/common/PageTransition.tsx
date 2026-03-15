/**
 * PageTransition Component
 *
 * Fade and slide transition animations for page navigation.
 * Validates: Requirements 14.1, 14.2, 14.4
 */

import { type ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: ReactNode[];
  delay?: number;
}

export function StaggeredList({ children, delay = 100 }: StaggeredListProps) {
  return (
    <>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-slide-up"
          style={{ animationDelay: `${index * delay}ms` }}
        >
          {child}
        </div>
      ))}
    </>
  );
}

export default PageTransition;
