import { useMemo } from 'react';
import { useSlideStore } from '../store/slideStore';
import type { SlideElement } from '../types';
import './PropertiesPanel.css';

const fontFamilies = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Comic Sans MS'];
const alignments: SlideElement['textAlign'][] = ['left', 'center', 'right', 'justify'];

export const PropertiesPanel = () => {
  const slides = useSlideStore((store) => store.slides);
  const currentSlideIndex = useSlideStore((store) => store.currentSlideIndex);
  const selectedElementId = useSlideStore((store) => store.selectedElementId);
  const updateElement = useSlideStore((store) => store.updateElement);
  const deleteElement = useSlideStore((store) => store.deleteElement);

  const selectedElement = useMemo(() => {
    const slide = slides[currentSlideIndex];
    return slide?.elements.find((el) => el.id === selectedElementId) ?? null;
  }, [slides, currentSlideIndex, selectedElementId]);

  const handleChange = (updates: Partial<SlideElement>) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, updates);
  };

  if (!selectedElement) {
    return (
      <div className="properties-empty">
        <p>Select a text, shape, or photo to see easy controls here.</p>
      </div>
    );
  }

  return (
    <div className="properties">
      <div className="properties-header">
        <h2>Friendly Controls</h2>
        <button
          className="btn-remove"
          onClick={() => deleteElement(selectedElement.id)}
          aria-label="Delete selected element"
        >
          Remove
        </button>
      </div>

      <div className="property-group">
        <label htmlFor="property-label">Helpful Label</label>
        <input
          id="property-label"
          type="text"
          value={selectedElement.text ?? ''}
          onChange={(e) => handleChange({ text: e.target.value })}
          placeholder="Type gentle words"
          disabled={selectedElement.type !== 'text'}
        />
      </div>

      {selectedElement.type === 'text' && (
        <>
          <div className="property-group">
            <label>Font Family</label>
            <select
              value={selectedElement.fontFamily ?? 'Arial'}
              onChange={(e) => handleChange({ fontFamily: e.target.value })}
            >
              {fontFamilies.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          </div>

          <div className="property-row">
            <div className="property-group">
              <label>Font Size</label>
              <input
                type="number"
                min={10}
                max={120}
                value={selectedElement.fontSize ?? 28}
                onChange={(e) => handleChange({ fontSize: Number(e.target.value) })}
              />
            </div>
            <div className="property-group">
              <label>Text Color</label>
              <input
                type="color"
                value={selectedElement.fill ?? '#111827'}
                onChange={(e) => handleChange({ fill: e.target.value })}
              />
            </div>
          </div>

          <div className="property-group">
            <label>Alignment</label>
            <div className="alignment-buttons">
              {alignments.map((align) => (
                <button
                  key={align}
                  className={selectedElement.textAlign === align ? 'active' : ''}
                  onClick={() => handleChange({ textAlign: align })}
                  type="button"
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedElement.type === 'shape' && (
        <>
          <div className="property-row">
            <div className="property-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={selectedElement.fill ?? '#f97316'}
                onChange={(e) => handleChange({ fill: e.target.value })}
              />
            </div>
            <div className="property-group">
              <label>Border Color</label>
              <input
                type="color"
                value={selectedElement.stroke ?? '#ea580c'}
                onChange={(e) => handleChange({ stroke: e.target.value })}
              />
            </div>
          </div>
          <div className="property-group">
            <label>Border Width</label>
            <input
              type="range"
              min={0}
              max={12}
              value={selectedElement.strokeWidth ?? 2}
              onChange={(e) => handleChange({ strokeWidth: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {selectedElement.type === 'image' && (
        <div className="property-group">
          <label>Image Info</label>
          <p className="help-text">Use the handles on the canvas to resize your photo.</p>
        </div>
      )}

      <div className="property-row">
        <div className="property-group">
          <label>X Position</label>
          <input
            type="number"
            value={Math.round(selectedElement.left ?? 0)}
            onChange={(e) => handleChange({ left: Number(e.target.value) })}
          />
        </div>
        <div className="property-group">
          <label>Y Position</label>
          <input
            type="number"
            value={Math.round(selectedElement.top ?? 0)}
            onChange={(e) => handleChange({ top: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
};
