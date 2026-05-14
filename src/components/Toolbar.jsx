import React, { useRef } from 'react';

export function Toolbar({ 
  addCard, 
  cards, 
  links, 
  loadData, 
  showStatus, 
  statusText,
  viewportRef,
  onHelpClick
}) {
  const fileInputRef = useRef(null);

  const getProjectData = () => ({
    cards,
    links,
  });

  const handleSaveData = () => {
    try {
      localStorage.setItem('relBoardData', JSON.stringify(getProjectData()));
      showStatus("✅ Zapisano pomyślnie!", 3000);
    } catch (e) {
      showStatus("❌ Błąd zapisu! Obrazy są zbyt duże.", 3000);
    }
  };

  const handleLoadData = () => {
    const savedDataStr = localStorage.getItem('relBoardData');
    if (!savedDataStr) {
      showStatus("⚠️ Brak zapisanych danych.", 3000);
      return;
    }
    try {
      loadData(JSON.parse(savedDataStr));
      showStatus("✅ Wczytano z przeglądarki!", 3000);
    } catch (e) {
      showStatus("❌ Błąd podczas wczytywania danych.", 3000);
    }
  };

  const handleExportProject = () => {
    const dataStr = JSON.stringify(getProjectData());
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = "tablica-relacji.json";
    link.click();
    
    URL.revokeObjectURL(url);
    showStatus("✅ Plik projektu pobrany!", 3000);
  };

  const handleImportProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        loadData(data);
        showStatus("✅ Projekt wczytany z pliku!", 3000);
        if (fileInputRef.current) fileInputRef.current.value = ""; 
      } catch (error) {
        showStatus("❌ Błąd: Nieprawidłowy plik projektu.", 3000);
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="absolute top-5 left-5 z-[100] bg-white p-2.5 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex gap-2 items-center flex-wrap max-w-[90vw]">
      <button 
        className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-[#007bff] text-white hover:bg-[#0056b3]"
        onClick={() => addCard(viewportRef.current)}
      >
        + Dodaj osobę
      </button>
      <button 
        className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-[#28a745] text-white hover:bg-[#218838]"
        onClick={handleSaveData}
      >
        💾 Zapisz (Przeglądarka)
      </button>
      <button 
        className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-[#ddd] text-[#333] hover:bg-[#ccc]"
        onClick={handleLoadData}
      >
        📂 Wczytaj (Przeglądarka)
      </button>
      <button 
        className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-[#17a2b8] text-white hover:bg-[#138496]"
        onClick={handleExportProject}
      >
        ⬇️ Pobierz Projekt
      </button>
      <label className="px-4 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-[#17a2b8] text-white hover:bg-[#138496] inline-block box-border">
        ⬆️ Wczytaj Projekt
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          onChange={handleImportProject}
          ref={fileInputRef}
        />
      </label>
      <button
        className="w-9 h-9 rounded-full bg-[#6c757d] text-white border-none cursor-pointer text-lg font-bold flex items-center justify-center transition-colors duration-200 hover:bg-[#545b62] shrink-0"
        onClick={onHelpClick}
        title="Poradnik"
      >
        i
      </button>
      {statusText && (
        <span className="ml-[15px] text-[#555] font-bold">
          {statusText}
        </span>
      )}
    </div>
  );
}
