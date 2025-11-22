import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Slide, SlideElement, SlideEditorState } from '../types';

interface SlideStore extends SlideEditorState {
  addSlide: () => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  setCurrentSlide: (index: number) => void;
  addElement: (element: Omit<SlideElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  updateSlideElements: (elements: SlideElement[], options?: { pushHistory?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  updateSlideThumbnail: (slideId: string, thumbnail: string) => void;
}

const STORAGE_KEY = 'slide-editor-state';
const MAX_SLIDES = 5;

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Local storage is not available:', error);
    return null;
  }
};

const friendlyNotice = (message: string) => {
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(message);
  } else {
    console.warn(message);
  }
};

const cloneSlides = (slides: Slide[]): Slide[] => JSON.parse(JSON.stringify(slides));

const createInitialSlide = (): Slide => ({
  id: uuidv4(),
  elements: [],
  backgroundColor: '#ffffff',
});

const getInitialState = (): SlideEditorState => {
  const storage = getStorage();
  if (storage) {
    try {
      const stored = storage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          history: {
            past: [],
            future: [],
          },
        } satisfies SlideEditorState;
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  return {
    slides: [createInitialSlide()],
    currentSlideIndex: 0,
    selectedElementId: null,
    history: {
      past: [],
      future: [],
    },
  } satisfies SlideEditorState;
};

export const useSlideStore = create<SlideStore>((set, get) => ({
  ...getInitialState(),

  addSlide: () => {
    const { slides } = get();
    if (slides.length >= MAX_SLIDES) {
      friendlyNotice('Only five slides for now, dear. Please tidy or reuse one.');
      return;
    }

    get().saveToHistory();
    const newSlide = createInitialSlide();

    set((state) => ({
      slides: [...state.slides, newSlide],
      currentSlideIndex: state.slides.length,
      selectedElementId: null,
    }));

    get().saveToStorage();
  },

  deleteSlide: (slideId: string) => {
    const { slides, currentSlideIndex } = get();
    if (slides.length === 1) {
      friendlyNotice('At least one slide must stay.');
      return;
    }

    const slideIndex = slides.findIndex((s) => s.id === slideId);
    if (slideIndex === -1) return;

    get().saveToHistory();

    const newSlides = slides.filter((s) => s.id !== slideId);
    const newCurrentIndex = currentSlideIndex >= newSlides.length
      ? newSlides.length - 1
      : currentSlideIndex;

    set({
      slides: newSlides,
      currentSlideIndex: newCurrentIndex,
      selectedElementId: null,
    });

    get().saveToStorage();
  },

  duplicateSlide: (slideId: string) => {
    const { slides } = get();
    if (slides.length >= MAX_SLIDES) {
      friendlyNotice('Only five slides for now, dear. Please tidy or reuse one.');
      return;
    }

    const slideIndex = slides.findIndex((s) => s.id === slideId);
    if (slideIndex === -1) return;

    get().saveToHistory();

    const slideToDuplicate = slides[slideIndex];
    const newSlide: Slide = {
      ...slideToDuplicate,
      id: uuidv4(),
      elements: slideToDuplicate.elements.map((el) => ({
        ...el,
        id: uuidv4(),
      })),
    };

    const newSlides = [
      ...slides.slice(0, slideIndex + 1),
      newSlide,
      ...slides.slice(slideIndex + 1),
    ];

    set({
      slides: newSlides,
      currentSlideIndex: slideIndex + 1,
      selectedElementId: null,
    });

    get().saveToStorage();
  },

  setCurrentSlide: (index: number) => {
    set({ currentSlideIndex: index, selectedElementId: null });
  },

  addElement: (element: Omit<SlideElement, 'id'>) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    get().saveToHistory();

    const newElement: SlideElement = {
      ...element,
      id: uuidv4(),
    };

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );

    set({
      slides: updatedSlides,
      selectedElementId: newElement.id,
    });

    get().saveToStorage();
  },

  updateElement: (elementId: string, updates: Partial<SlideElement>) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            ),
          }
        : slide
    );

    set({ slides: updatedSlides });
    get().saveToStorage();
  },

  deleteElement: (elementId: string) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    get().saveToHistory();

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.filter((el) => el.id !== elementId),
          }
        : slide
    );

    set({
      slides: updatedSlides,
      selectedElementId: null,
    });

    get().saveToStorage();
  },

  selectElement: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },

  updateSlideElements: (elements: SlideElement[], options) => {
    const { slides, currentSlideIndex } = get();
    const pushHistory = options?.pushHistory;
    if (pushHistory) {
      get().saveToHistory();
    }

    const updatedSlides = slides.map((slide, index) =>
      index === currentSlideIndex ? { ...slide, elements } : slide
    );
    set({ slides: updatedSlides });
    get().saveToStorage();
  },

  saveToHistory: () => {
    const { slides, history } = get();
    set({
      history: {
        past: [...history.past, cloneSlides(slides)].slice(-20),
        future: [],
      },
    });
  },

  undo: () => {
    const { history, slides } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      slides: cloneSlides(previous),
      history: {
        past: newPast,
        future: [cloneSlides(slides), ...history.future],
      },
      selectedElementId: null,
    });

    get().saveToStorage();
  },

  redo: () => {
    const { history, slides } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      slides: cloneSlides(next),
      history: {
        past: [...history.past, cloneSlides(slides)],
        future: newFuture,
      },
      selectedElementId: null,
    });

    get().saveToStorage();
  },

  saveToStorage: () => {
    const storage = getStorage();
    if (!storage) return;

    const { slides, currentSlideIndex, selectedElementId } = get();
    const stateToSave = {
      slides,
      currentSlideIndex,
      selectedElementId,
    } satisfies Omit<SlideEditorState, 'history'>;

    storage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  },

  loadFromStorage: () => {
    const state = getInitialState();
    set(state);
  },

  updateSlideThumbnail: (slideId: string, thumbnail: string) => {
    const { slides } = get();
    const updatedSlides = slides.map((slide) =>
      slide.id === slideId ? { ...slide, thumbnail } : slide
    );
    set({ slides: updatedSlides });
    get().saveToStorage();
  },
}));
