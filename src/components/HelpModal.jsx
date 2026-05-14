import React from 'react';

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      icon: '➕',
      title: 'Dodaj osobę',
      desc: 'Kliknij przycisk „+ Dodaj osobę" na pasku narzędzi. Nowa karta pojawi się na środku widoku.',
    },
    {
      icon: '✏️',
      title: 'Edytuj kartę',
      desc: 'Kliknij w pole „Wpisz Imię", aby nadać imię. Rozwiń sekcję „Opis", żeby dodać notatki. Kliknij kółko awatara, aby wgrać zdjęcie.',
    },
    {
      icon: '🎨',
      title: 'Zmień kolor nagłówka',
      desc: 'Użyj kwadratowego przycisku koloru (obok ≡) w nagłówku karty, aby zmienić kolor.',
    },
    {
      icon: '✋',
      title: 'Przeciągaj karty',
      desc: 'Chwyć ciemny nagłówek karty (pasek z ≡) i przeciągnij ją w dowolne miejsce na płótnie.',
    },
    {
      icon: '🔗',
      title: 'Twórz relacje',
      desc: 'Kliknij ikonę 🔗 na pierwszej karcie, a następnie kliknij drugą kartę. Pojawi się okno, w którym nadasz nazwę i kolor relacji.',
    },
    {
      icon: '🏷️',
      title: 'Edytuj relację',
      desc: 'Kliknij etykietę na linii łączącej karty, aby zmienić nazwę, kolor lub usunąć połączenie.',
    },
    {
      icon: '🖱️',
      title: 'Nawiguj po płótnie',
      desc: 'Przeciągaj tło, aby przesuwać widok (pan). Użyj kółka myszy, aby przybliżać i oddalać (zoom).',
    },
    {
      icon: '💾',
      title: 'Zapisz i wczytaj',
      desc: '„Zapisz" zachowa projekt w przeglądarce (LocalStorage). „Pobierz Projekt" wyeksportuje go jako plik .json, który możesz potem wczytać.',
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-[520px] max-h-[85vh] shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee] shrink-0">
          <h2 className="m-0 text-lg font-bold text-[#222]">📖 Jak używać Tablicy Relacji?</h2>
          <button
            className="bg-transparent border-none text-2xl cursor-pointer text-[#999] hover:text-[#333] transition-colors p-1 leading-none"
            onClick={onClose}
            title="Zamknij"
          >
            ✕
          </button>
        </div>

        {/* Steps */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#f0f4ff] flex items-center justify-center text-xl shrink-0">
                {step.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-[14px] text-[#222]">
                  {i + 1}. {step.title}
                </span>
                <span className="text-[13px] text-[#666] leading-relaxed">
                  {step.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eee] shrink-0 flex justify-end">
          <button
            className="px-6 py-2 cursor-pointer border-none rounded font-bold transition-colors duration-200 text-[13px] bg-[#007bff] text-white hover:bg-[#0056b3]"
            onClick={onClose}
          >
            Rozumiem!
          </button>
        </div>
      </div>
    </div>
  );
}
