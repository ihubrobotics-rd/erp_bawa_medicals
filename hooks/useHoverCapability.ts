// Path: hooks/useHoverCapability.ts

"use client";

import { useState, useEffect } from 'react';

export function useHoverCapability(): boolean {
  const [isHoverCapable, setIsHoverCapable] = useState(false);

  useEffect(() => {
    // The '(hover: hover)' media query checks if the primary input mechanism
    // can conveniently hover over elements. This is the most reliable way to
    // distinguish mouse users from touch users.
    const mediaQuery = window.matchMedia('(hover: hover)');

    // Set the initial value
    setIsHoverCapable(mediaQuery.matches);

    // Optional: Listen for changes, though this is rare
    const listener = (e: MediaQueryListEvent) => setIsHoverCapable(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return isHoverCapable;
}