import React, { useRef, memo, useEffect, useState } from 'react';

export const PersonCard = memo(({ 
  card, 
  viewportRef, 
  updateCard, 
  deleteCard, 
  startConnection, 
  isConnectingMode,
  onCardClick,
  usedColors = []
}) => {
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  const handlePointerDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const rect = cardRef.current.getBoundingClientRect();
    if (e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20) return;

    if (!e.target.closest('.card-header')) return;

    isDraggingRef.current = true;
    const vp = viewportRef.current;
    
    offsetRef.current = {
      x: (e.clientX - vp.x) / vp.scale - card.x,
      y: (e.clientY - vp.y) / vp.scale - card.y
    };
    
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

  useEffect(() => {
    if (!cardRef.current) return;
    
    let isInitial = true;
    const ro = new ResizeObserver((entries) => {
      if (isInitial) {
        isInitial = false;
        return;
      }
      for (let entry of entries) {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!colorDropdownOpen) return;
    const handleClickOutside = () => setColorDropdownOpen(false);
    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, [colorDropdownOpen]);

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
        <div className="flex items-center gap-2 relative">
          <span className="drag-handle">≡</span>
          <input 
            type="color" 
            className="w-[22px] h-[22px] p-0 border border-white rounded cursor-pointer bg-transparent"
            value={card.headerColor || '#333333'} 
            onChange={(e) => updateCard(card.id, { headerColor: e.target.value })}
            title="Zmień kolor" 
          />
          {usedColors.length > 0 && (
            <button
              className="bg-black/30 border-none text-white cursor-pointer text-[10px] rounded px-1 py-0.5 transition-colors hover:bg-black/60 leading-none"
              onClick={(e) => {
                e.stopPropagation();
                setColorDropdownOpen(!colorDropdownOpen);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Szybki wybór koloru"
            >
              ▼
            </button>
          )}
          {colorDropdownOpen && usedColors.length > 0 && (
            <div
              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.2)] p-2 flex gap-1.5 flex-wrap z-50 min-w-[80px]"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {usedColors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-[#ddd] cursor-pointer p-0 transition-transform hover:scale-125 hover:border-white"
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCard(card.id, { headerColor: color });
                    setColorDropdownOpen(false);
                  }}
                />
              ))}
            </div>
          )}
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

