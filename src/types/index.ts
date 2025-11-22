import type { ReactNode } from 'react'

export interface SlideElement {
  id: string;
  type: 'text' | 'shape' | 'image';
  left: number;
  top: number;
  width: number;
  height: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  src?: string;
  shapeType?: 'rect' | 'circle' | 'triangle';
}

export interface Slide {
  id: string;
  elements: SlideElement[];
  backgroundColor?: string;
  thumbnail?: string;
}

export interface SlideEditorState {
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementId: string | null;
  history: {
    past: Slide[][];
    future: Slide[][];
  };
}

export interface ToolbarItem {
  id: string;
  label: string;
  icon: ReactNode;
  action: () => void;
  tooltip: string;
}
