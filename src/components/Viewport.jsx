import React, { useRef, useEffect } from 'react';

export function Viewport({ children, viewportRef, transform, setTransform }) {
  const viewportDomRef = useRef(null);
  const isPanningRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      const delta = -e.deltaY * 0.001;
      const currentScale = viewportRef.current.scale;
      let newScale = Math.min(Math.max(0.2, currentScale * Math.exp(delta)), 3);
      
      const rect = viewportDomRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const currentX = viewportRef.current.x;
      const currentY = viewportRef.current.y;

      const panX = mouseX - (mouseX - currentX) * (newScale / currentScale);
      const panY = mouseY - (mouseY - currentY) * (newScale / currentScale);

      viewportRef.current = { x: panX, y: panY, scale: newScale };
      setTransform({ ...viewportRef.current });
    };

    const viewportEl = viewportDomRef.current;
    if (viewportEl) {
      viewportEl.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (viewportEl) {
        viewportEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [setTransform, viewportRef]);

  const handlePointerDown = (e) => {
    if (e.target !== viewportDomRef.current) return;
    isPanningRef.current = true;
    startPosRef.current = {
      x: e.clientX - viewportRef.current.x,
      y: e.clientY - viewportRef.current.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!isPanningRef.current) return;
    const newX = e.clientX - startPosRef.current.x;
    const newY = e.clientY - startPosRef.current.y;
    
    viewportRef.current = { ...viewportRef.current, x: newX, y: newY };
    setTransform({ ...viewportRef.current });
  };

  const handlePointerUp = () => {
    isPanningRef.current = false;
  };

  return (
    <div
      ref={viewportDomRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-screen h-screen relative cursor-grab active:cursor-grabbing bg-grid-pattern"
      style={{
        backgroundPosition: `${transform.x}px ${transform.y}px`,
        backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`
      }}
    >
      {children}
    </div>
  );
}
