import React, { useState, useEffect } from 'react';

export function RelationModal({ isOpen, mode, linkId, linkData, onClose, onSave, onDelete }) {
  const [relName, setRelName] = useState('');
  const [relColor, setRelColor] = useState('#333333');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        setRelName('');
        setRelColor('#007bff');
      } else if (mode === 'edit' && linkData) {
        setRelName(linkData.label);
        setRelColor(linkData.color);
      }
    }
  }, [isOpen, mode, linkData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(relName || 'Relacja', relColor);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[300px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
        <h3 className="mt-0 mb-[15px] text-lg font-bold">
          {mode === 'create' ? 'Nowa relacja' : 'Edytuj relację'}
        </h3>
        
        <div className="mb-[15px] flex flex-col">
          <label className="text-[12px] font-bold mb-[5px] text-[#555]">Nazwa relacji</label>
          <input 
            type="text" 
            className="p-2 border border-[#ccc] rounded focus:outline-none focus:border-primary"
            placeholder="np. Przyjaciel, Szef..."
            value={relName}
            onChange={(e) => setRelName(e.target.value)}
          />
        </div>
        
        <div className="mb-[15px] flex flex-col">
          <label className="text-[12px] font-bold mb-[5px] text-[#555]">Kolor linii</label>
          <input 
            type="color" 
            className="w-full h-[40px] border-none cursor-pointer bg-transparent p-0"
            value={relColor}
            onChange={(e) => setRelColor(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-2.5 mt-5">
          {mode === 'edit' && (
            <button 
              className="mr-auto px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-danger text-white hover:bg-danger-hover bg-[#dc3545] hover:bg-[#b02a37]"
              onClick={() => onDelete(linkId)}
            >
              Usuń
            </button>
          )}
          <button 
            className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-secondary text-[#333] hover:bg-secondary-hover bg-[#ddd] hover:bg-[#ccc]"
            onClick={onClose}
          >
            Anuluj
          </button>
          <button 
            className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-primary text-white hover:bg-primary-hover bg-[#007bff] hover:bg-[#0056b3]"
            onClick={handleSave}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
