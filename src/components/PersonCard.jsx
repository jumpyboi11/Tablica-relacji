import React, { useRef, memo, useEffect, useState } from 'react';

export const PersonCard = memo(({ 
  card, 
  viewportRef, 
  updateCard, 
  deleteCard, 
  startConnection, 
  isConnectingMode,
  onCardClick
}) => {
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // We use local state for dragging to make the drag buttery smooth without waiting for React cycle,
  // but we also sync to global state so lines follow.
  const handlePointerDown = (e) => {
    // Ignore if clicking on input or button
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Also ignore resize handle (bottom right)
    const rect = cardRef.current.getBoundingClientRect();
    if (e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20) return;

    // Only allow drag from header
    if (!e.target.closest('.card-header')) return;

    isDraggingRef.current = true;
    const vp = viewportRef.current;
    
    offsetRef.current = {
      x: (e.clientX - vp.x) / vp.scale - card.x,
      y: (e.clientY - vp.y) / vp.scale - card.y
    };
    
    // Add event listeners to window for smooth dragging outside the card bounds
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const vp = viewportRef.current;
    const newX = (e.clientX - vp.x) / vp.scale - offsetRef.current.x;
    const newY = (e.clientY - vp.y) / vp.scale - offsetRef.current.y;
    
    updateCard(card.id, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  // Cleanup listeners
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCard(card.id, { avatarBg: `url('${event.target.result}')` });
      };
      reader.readAsDataURL(file);
    }
  };

  // We need a ResizeObserver to update width/height globally when user resizes the card via native CSS resize
  useEffect(() => {
    if (!cardRef.current) return;
    
    let isInitial = true;
    const ro = new ResizeObserver((entries) => {
      if (isInitial) {
        isInitial = false;
        return;
      }
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // The contentRect is inner width, better to get offsetWidth
        const el = entry.target;
        updateCard(card.id, { 
          width: `${el.offsetWidth}px`, 
          height: `${el.offsetHeight}px` 
        });
      }
    });

    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [card.id, updateCard]);

  const avatarContent = card.avatarBg && card.avatarBg !== 'none' ? '' : '+';
  const bgStyle = card.avatarBg ? { backgroundImage: card.avatarBg } : {};

  return (
    <div
      id={card.id}
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onClick={onCardClick}
      className={`absolute bg-white border-2 border-[#333] rounded-lg shadow-[3px_3px_10px_rgba(0,0,0,0.15)] select-none resize overflow-auto flex flex-col ${isConnectingMode ? 'connecting-mode' : ''}`}
      style={{
        left: `${card.x}px`,
        top: `${card.y}px`,
        width: card.width || '200px',
        height: card.height || 'auto',
        minWidth: '200px',
        minHeight: '180px',
        cursor: onCardClick ? 'crosshair' : 'default'
      }}
    >
      <div 
        className="card-header text-white p-2 text-right cursor-grab active:cursor-grabbing flex justify-between items-center border-b-2 border-[#333] shrink-0"
        style={{ backgroundColor: card.headerColor || '#333333' }}
      >
        <div className="flex items-center gap-2">
          <span className="drag-handle">≡</span>
          <input 
            type="color" 
            className="w-[22px] h-[22px] p-0 border border-white rounded cursor-pointer bg-transparent"
            value={card.headerColor || '#333333'} 
            onChange={(e) => updateCard(card.id, { headerColor: e.target.value })}
            title="Zmień kolor" 
          />
        </div>
        <div>
          <button 
            className="bg-black/30 border-none text-white cursor-pointer text-sm rounded px-2 py-1 transition-colors hover:bg-black/60"
            onClick={(e) => { e.stopPropagation(); startConnection(card.id); }} 
            title="Połącz"
          >
            🔗
          </button>
          <button 
            className="bg-danger border-none text-white cursor-pointer text-sm rounded px-1.5 py-1 transition-colors hover:bg-danger-hover ml-1 bg-[#dc3545] hover:bg-[#b02a37]"
            onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }} 
            title="Usuń kartę"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="p-[15px] flex flex-col items-center flex-1">
        <label 
          className="w-[70px] h-[70px] rounded-full border-2 border-[#ddd] bg-[#fafafa] bg-cover bg-center cursor-pointer mb-3 flex justify-center items-center text-2xl text-[#ccc] transition-colors hover:border-primary shrink-0"
          style={bgStyle}
        >
          {avatarContent}
          <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
        </label>
        
        <input 
          type="text" 
          className="w-[90%] text-center font-bold border-none border-b-2 border-[#eee] mb-[15px] text-base p-1 focus:outline-none focus:border-primary"
          placeholder="Wpisz Imię" 
          value={card.name || ''}
          onChange={(e) => updateCard(card.id, { name: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
        />
        
        <details className="w-full flex-1 flex flex-col">
          <summary className="cursor-pointer font-semibold mb-2 text-sm text-[#555]">Opis</summary>
          <textarea 
            className="w-full box-border resize-y min-h-[80px] border border-[#ddd] rounded p-2 font-inherit text-[13px] flex-1"
            placeholder="Dodatkowe informacje..."
            value={card.desc || ''}
            onChange={(e) => updateCard(card.id, { desc: e.target.value })}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </details>
      </div>
    </div>
  );
});

PersonCard.displayName = 'PersonCard';
