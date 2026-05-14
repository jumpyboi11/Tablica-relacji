import React from 'react';

export const Canvas = React.forwardRef(({ transform, children }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 origin-top-left"
      style={{
        width: 0,
        height: 0,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
      }}
    >
      {children}
    </div>
  );
});
Canvas.displayName = 'Canvas';
