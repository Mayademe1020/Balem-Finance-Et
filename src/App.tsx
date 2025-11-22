import { useEffect } from 'react';
import { SlideList } from './components/SlideList';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { useSlideStore } from './store/slideStore';
import { useAutosave } from './hooks/useAutosave';
import './App.css';

function App() {
  const loadFromStorage = useSlideStore((state) => state.loadFromStorage);
  
  useAutosave();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isUndo = (e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey;
      const isRedo = (e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'));
      const isDeleteKey = e.key === 'Delete' || e.key === 'Backspace';
      const activeElement = document.activeElement as HTMLElement | null;
      const isTypingField = Boolean(activeElement?.closest('input, textarea, [contenteditable="true"]'));

      if (isUndo) {
        e.preventDefault();
        useSlideStore.getState().undo();
        return;
      }

      if (isRedo) {
        e.preventDefault();
        useSlideStore.getState().redo();
        return;
      }

      if (isDeleteKey && !isTypingField) {
        const selected = useSlideStore.getState().selectedElementId;
        if (selected) {
          e.preventDefault();
          useSlideStore.getState().deleteElement(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Slide Editor</h1>
        <div className="header-actions">
          <button
            className="btn-action"
            onClick={() => useSlideStore.getState().undo()}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            ↶ Undo
          </button>
          <button
            className="btn-action"
            onClick={() => useSlideStore.getState().redo()}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            ↷ Redo
          </button>
        </div>
      </header>
      
      <div className="app-content">
        <aside className="slide-panel">
          <SlideList />
        </aside>
        
        <main className="canvas-container">
          <Toolbar />
          <Canvas />
        </main>
        
        <aside className="properties-panel">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
}

export default App;
