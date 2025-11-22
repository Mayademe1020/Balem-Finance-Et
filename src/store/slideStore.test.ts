import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSlideStore } from './slideStore';

describe('slideStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    useSlideStore.setState({
      slides: [
        {
          id: 'test-1',
          elements: [],
          backgroundColor: '#ffffff',
        },
      ],
      currentSlideIndex: 0,
      selectedElementId: null,
      history: {
        past: [],
        future: [],
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with one slide', () => {
    const state = useSlideStore.getState();
    expect(state.slides).toHaveLength(1);
    expect(state.currentSlideIndex).toBe(0);
  });

  it('should add a new slide', () => {
    const { addSlide } = useSlideStore.getState();
    addSlide();
    
    const state = useSlideStore.getState();
    expect(state.slides).toHaveLength(2);
    expect(state.currentSlideIndex).toBe(1);
  });

  it('should limit slides to 5', () => {
    const { addSlide } = useSlideStore.getState();
    
    for (let i = 0; i < 5; i++) {
      addSlide();
    }
    
    const state = useSlideStore.getState();
    expect(state.slides).toHaveLength(5);
  });

  it('should add an element to the current slide', () => {
    const { addElement } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    const state = useSlideStore.getState();
    expect(state.slides[0].elements).toHaveLength(1);
    expect(state.slides[0].elements[0].text).toBe('Test');
    expect(state.selectedElementId).toBeTruthy();
  });

  it('should update an element', () => {
    const { addElement, updateElement } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    const state = useSlideStore.getState();
    const elementId = state.slides[0].elements[0].id;
    
    updateElement(elementId, { text: 'Updated' });
    
    const updatedState = useSlideStore.getState();
    expect(updatedState.slides[0].elements[0].text).toBe('Updated');
  });

  it('should delete an element', () => {
    const { addElement, deleteElement } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    const state = useSlideStore.getState();
    const elementId = state.slides[0].elements[0].id;
    
    deleteElement(elementId);
    
    const updatedState = useSlideStore.getState();
    expect(updatedState.slides[0].elements).toHaveLength(0);
    expect(updatedState.selectedElementId).toBeNull();
  });

  it('should duplicate a slide', () => {
    const { addElement, duplicateSlide } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    const state = useSlideStore.getState();
    const slideId = state.slides[0].id;
    
    duplicateSlide(slideId);
    
    const updatedState = useSlideStore.getState();
    expect(updatedState.slides).toHaveLength(2);
    expect(updatedState.slides[1].elements).toHaveLength(1);
    expect(updatedState.slides[1].elements[0].text).toBe('Test');
    expect(updatedState.slides[1].id).not.toBe(slideId);
  });

  it('should delete a slide', () => {
    const { addSlide, deleteSlide } = useSlideStore.getState();
    
    addSlide();
    const state = useSlideStore.getState();
    const slideId = state.slides[1].id;
    
    deleteSlide(slideId);
    
    const updatedState = useSlideStore.getState();
    expect(updatedState.slides).toHaveLength(1);
  });

  it('should not delete the last slide', () => {
    const state = useSlideStore.getState();
    const slideId = state.slides[0].id;
    
    const { deleteSlide } = useSlideStore.getState();
    deleteSlide(slideId);
    
    const updatedState = useSlideStore.getState();
    expect(updatedState.slides).toHaveLength(1);
  });

  it('should handle undo', () => {
    const { addElement, undo } = useSlideStore.getState();
    
    const initialState = useSlideStore.getState();
    const initialElementCount = initialState.slides[0].elements.length;
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    undo();
    
    const state = useSlideStore.getState();
    expect(state.slides[0].elements).toHaveLength(initialElementCount);
  });

  it('should handle redo', () => {
    const { addElement, undo, redo } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    undo();
    redo();
    
    const state = useSlideStore.getState();
    expect(state.slides[0].elements).toHaveLength(1);
  });

  it('should save to and load from localStorage', () => {
    const { addElement, saveToStorage, loadFromStorage } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    saveToStorage();
    
    const saved = localStorage.getItem('slide-editor-state');
    expect(saved).toBeTruthy();
    
    const parsed = JSON.parse(saved!);
    expect(parsed.slides[0].elements).toHaveLength(1);
    
    useSlideStore.setState({
      slides: [{
        id: 'empty',
        elements: [],
        backgroundColor: '#ffffff',
      }],
      currentSlideIndex: 0,
      selectedElementId: null,
      history: { past: [], future: [] },
    });
    
    loadFromStorage();
    
    const state = useSlideStore.getState();
    expect(state.slides[0].elements).toHaveLength(1);
  });

  it('should select an element', () => {
    const { addElement, selectElement } = useSlideStore.getState();
    
    addElement({
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      text: 'Test',
    });
    
    const state = useSlideStore.getState();
    const elementId = state.slides[0].elements[0].id;
    
    selectElement(elementId);
    
    const updatedState = useSlideStore.getState();
    expect(updatedState.selectedElementId).toBe(elementId);
    
    selectElement(null);
    
    const finalState = useSlideStore.getState();
    expect(finalState.selectedElementId).toBeNull();
  });
});
