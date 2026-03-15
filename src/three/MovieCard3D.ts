/**
 * MovieCard3D Module
 *
 * Three.js utilities for 3D card effects.
 * Validates: Requirements 5.1, 5.2
 */

export interface TiltConfig {
  maxTilt: number;
  perspective: number;
  scale: number;
  transitionDuration: number;
}

const defaultConfig: TiltConfig = {
  maxTilt: 15,
  perspective: 1000,
  scale: 1.05,
  transitionDuration: 300,
};

export function calculateTilt(
  element: HTMLElement,
  event: MouseEvent,
  config: Partial<TiltConfig> = {}
): { rotateX: number; rotateY: number } {
  const { maxTilt } = { ...defaultConfig, ...config };
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const mouseX = event.clientX - centerX;
  const mouseY = event.clientY - centerY;
  const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
  const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
  return { rotateX, rotateY };
}

export function applyTiltStyle(
  element: HTMLElement,
  rotateX: number,
  rotateY: number,
  config: Partial<TiltConfig> = {}
): void {
  const { perspective, scale } = { ...defaultConfig, ...config };
  element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
}

export function resetTiltStyle(element: HTMLElement, config: Partial<TiltConfig> = {}): void {
  const { transitionDuration } = { ...defaultConfig, ...config };
  element.style.transition = `transform ${transitionDuration}ms ease-out`;
  element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
}

export function createTiltHandler(element: HTMLElement, config: Partial<TiltConfig> = {}) {
  const handleMouseMove = (e: MouseEvent) => {
    const { rotateX, rotateY } = calculateTilt(element, e, config);
    element.style.transition = 'none';
    applyTiltStyle(element, rotateX, rotateY, config);
  };
  const handleMouseLeave = () => resetTiltStyle(element, config);
  return { handleMouseMove, handleMouseLeave };
}