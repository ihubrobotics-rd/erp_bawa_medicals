import { useRef } from 'react';
import type { MouseEvent } from 'react';

export function useGrabToScroll(ref: React.RefObject<HTMLElement>) {
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: MouseEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element) return;

    isDown.current = true;
    element.classList.add('grabbing');
    // Use e.pageX which is consistent, and element.offsetLeft to get position relative to the page
    startX.current = e.pageX - element.offsetLeft;
    scrollLeft.current = element.scrollLeft;
  };

  const onMouseLeave = () => {
    const element = ref.current;
    if (!element) return;
    
    isDown.current = false;
    element.classList.remove('grabbing');
  };

  const onMouseUp = () => {
    const element = ref.current;
    if (!element) return;
    
    isDown.current = false;
    element.classList.remove('grabbing');
  };

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const element = ref.current;
    if (!isDown.current || !element) return;

    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX.current) * 1; 
    element.scrollLeft = scrollLeft.current - walk;
  };

  // Return the props so they can be spread onto the element
  return {
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
  };
}