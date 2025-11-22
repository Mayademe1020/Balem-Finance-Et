import { FiType, FiSquare, FiCircle, FiImage } from 'react-icons/fi';
import { TbTriangle } from 'react-icons/tb';
import { useRef, type ChangeEvent } from 'react';
import { useSlideStore } from '../store/slideStore';
import './Toolbar.css';

export const Toolbar = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addElement = useSlideStore((state) => state.addElement);

  const handleAddText = () => {
    addElement({
      type: 'text',
      text: 'Gentle reminder: type here',
      left: 120,
      top: 100,
      width: 300,
      height: 120,
      fill: '#111827',
      fontSize: 32,
      fontFamily: 'Arial',
      textAlign: 'left',
    });
  };

  const handleAddRectangle = () => {
    addElement({
      type: 'shape',
      shapeType: 'rect',
      left: 160,
      top: 200,
      width: 240,
      height: 160,
      fill: '#fde68a',
      stroke: '#f59e0b',
      strokeWidth: 2,
    });
  };

  const handleAddCircle = () => {
    addElement({
      type: 'shape',
      shapeType: 'circle',
      left: 220,
      top: 160,
      width: 180,
      height: 180,
      fill: '#d3f9d8',
      stroke: '#34d399',
      strokeWidth: 2,
    });
  };

  const handleAddTriangle = () => {
    addElement({
      type: 'shape',
      shapeType: 'triangle',
      left: 200,
      top: 220,
      width: 200,
      height: 160,
      fill: '#fcd5ce',
      stroke: '#f87171',
      strokeWidth: 2,
    });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      addElement({
        type: 'image',
        left: 180,
        top: 140,
        width: 240,
        height: 200,
        src,
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="toolbar" role="toolbar" aria-label="Add things to your slide">
      <button className="toolbar-button" onClick={handleAddText} title="Add kind text" data-testid="toolbar-text">
        <FiType aria-hidden="true" />
        <span>Big Text</span>
      </button>
      <button className="toolbar-button" onClick={handleAddRectangle} title="Add friendly box" data-testid="toolbar-rectangle">
        <FiSquare aria-hidden="true" />
        <span>Soft Box</span>
      </button>
      <button className="toolbar-button" onClick={handleAddCircle} title="Add smooth circle" data-testid="toolbar-circle">
        <FiCircle aria-hidden="true" />
        <span>Round Shape</span>
      </button>
      <button className="toolbar-button" onClick={handleAddTriangle} title="Add pointy triangle" data-testid="toolbar-triangle">
        <TbTriangle aria-hidden="true" />
        <span>Triangle</span>
      </button>
      <label className="toolbar-button upload" title="Add your own photo" data-testid="toolbar-photo">
        <FiImage aria-hidden="true" />
        <span>Photo</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          aria-label="Upload an image"
        />
      </label>
    </div>
  );
};
