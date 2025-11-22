import { useEffect } from 'react';
import { useSlideStore } from '../store/slideStore';
import { saveDraftToAPI } from '../api/slideApi';

const AUTOSAVE_DELAY = 1500;

export const useAutosave = () => {
  const slides = useSlideStore((state) => state.slides);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeout = window.setTimeout(() => {
      void saveDraftToAPI(slides);
    }, AUTOSAVE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [slides]);
};
