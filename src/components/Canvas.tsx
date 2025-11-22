import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Textbox, Rect, Circle, Triangle, Image as FabricImage, FabricObject as BaseFabricObject } from 'fabric';
import { useSlideStore } from '../store/slideStore';
import type { SlideElement } from '../types';
import './Canvas.css';

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

type FabricObject = BaseFabricObject & { data?: { elementId: string; type: SlideElement['type'] } };

const createFabricObject = async (element: SlideElement): Promise<FabricObject> => {
  const commonProps = {
    left: element.left,
    top: element.top,
    angle: element.angle ?? 0,
    scaleX: element.scaleX ?? 1,
    scaleY: element.scaleY ?? 1,
    data: { elementId: element.id, type: element.type },
    selectable: true,
    hasBorders: true,
    hasControls: true,
    borderColor: '#2563eb',
    cornerColor: '#1d4ed8',
    cornerSize: 12,
    transparentCorners: false,
  };

  if (element.type === 'text') {
    const textObject = new Textbox(element.text ?? 'Double click to edit', {
      width: element.width,
      fill: element.fill ?? '#111827',
      fontSize: element.fontSize ?? 28,
      fontFamily: element.fontFamily ?? 'Arial',
      fontWeight: element.fontWeight ?? 'normal',
      fontStyle: element.fontStyle ?? 'normal',
      textAlign: element.textAlign ?? 'left',
      ...commonProps,
    });
    return textObject as FabricObject;
  }

  if (element.type === 'shape') {
    const fill = element.fill ?? '#f97316';
    const stroke = element.stroke ?? '#ea580c';
    const strokeWidth = element.strokeWidth ?? 2;

    if (element.shapeType === 'circle') {
      const circle = new Circle({
        radius: Math.max(element.width, element.height) / 2,
        fill,
        stroke,
        strokeWidth,
        ...commonProps,
      });
      return circle as FabricObject;
    }

    if (element.shapeType === 'triangle') {
      const triangle = new Triangle({
        width: element.width,
        height: element.height,
        fill,
        stroke,
        strokeWidth,
        ...commonProps,
      });
      return triangle as FabricObject;
    }

    const rectangle = new Rect({
      width: element.width,
      height: element.height,
      rx: 12,
      ry: 12,
      fill,
      stroke,
      strokeWidth,
      ...commonProps,
    });
    return rectangle as FabricObject;
  }

  if (element.type === 'image' && element.src) {
    const img = await FabricImage.fromURL(element.src, { crossOrigin: 'anonymous' });
    img.set({
      ...commonProps,
      scaleX: element.width / (img.width ?? 1),
      scaleY: element.height / (img.height ?? 1),
    });
    return img as FabricObject;
  }

  const fallback = new Rect({
    width: element.width,
    height: element.height,
    fill: '#f3f4f6',
    stroke: '#9ca3af',
    ...commonProps,
  });
  return fallback as FabricObject;
};

const getElementFromObject = (object: FabricObject): Partial<SlideElement> => {
  const updates: Partial<SlideElement> = {
    left: object.left ?? 0,
    top: object.top ?? 0,
    width: (object.width ?? 0) * (object.scaleX ?? 1),
    height: (object.height ?? 0) * (object.scaleY ?? 1),
    angle: object.angle ?? 0,
    scaleX: object.scaleX ?? 1,
    scaleY: object.scaleY ?? 1,
  };

  if (object instanceof Textbox) {
    updates.text = object.text;
    updates.fill = object.fill as string;
    updates.fontSize = object.fontSize;
    updates.fontFamily = object.fontFamily;
    updates.fontStyle = object.fontStyle;
    updates.fontWeight = object.fontWeight as string;
    updates.textAlign = object.textAlign;
  }

  return updates;
};

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const {
    slides,
    currentSlideIndex,
    updateElement,
    selectElement,
    selectedElementId,
    updateSlideThumbnail,
  } = useSlideStore((state) => ({
    slides: state.slides,
    currentSlideIndex: state.currentSlideIndex,
    updateElement: state.updateElement,
    selectElement: state.selectElement,
    selectedElementId: state.selectedElementId,
    updateSlideThumbnail: state.updateSlideThumbnail,
  }));

  const currentSlide = slides[currentSlideIndex];

  const handleObjectModified = useCallback((object: FabricObject | undefined | null) => {
    if (!object?.data?.elementId) return;

    const updates = getElementFromObject(object);
    updateElement(object.data.elementId, updates);
  }, [updateElement]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObjects()[0] as FabricObject | undefined;
      selectElement(activeObject?.data?.elementId ?? null);
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => selectElement(null));
    canvas.on('object:modified', (event) => handleObjectModified(event.target as FabricObject));

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [handleObjectModified, selectElement]);

  useEffect(() => {
    const fabricCanvas = fabricRef.current;
    if (!fabricCanvas || !currentSlide) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = currentSlide.backgroundColor ?? '#ffffff';

    const loadElements = async () => {
      for (const element of currentSlide.elements) {
        const object = await createFabricObject(element);
        fabricCanvas.add(object);
      }
      fabricCanvas.renderAll();
      
      setTimeout(() => {
        const preview = fabricCanvas.toDataURL({ format: 'png', multiplier: 0.25 });
        updateSlideThumbnail(currentSlide.id, preview);
      }, 100);
    };

    loadElements();
  }, [currentSlide, updateSlideThumbnail]);

  useEffect(() => {
    const fabricCanvas = fabricRef.current;
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    const object = objects.find((obj) => {
      const data = (obj as FabricObject).data;
      return data?.elementId === selectedElementId;
    });

    if (object) {
      fabricCanvas.setActiveObject(object);
    } else {
      fabricCanvas.discardActiveObject();
    }

    fabricCanvas.renderAll();
  }, [selectedElementId]);

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Slide editing canvas"
        tabIndex={0}
      />
    </div>
  );
};
