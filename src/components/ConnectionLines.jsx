import React, { memo } from 'react';

function getCardCenter(card) {
  const w = parseInt(card.width) || 200;
  const h = parseInt(card.height) || 180;
  return {
    cx: card.x + w / 2,
    cy: card.y + h / 2,
  };
}

export const ConnectionLines = memo(({ links, cards, openModal }) => {
  return (
    <>
      <svg className="absolute top-0 left-0 w-[1px] h-[1px] overflow-visible pointer-events-none -z-10">
        {links.map((link) => {
          const card1 = cards[link.from];
          const card2 = cards[link.to];
          if (!card1 || !card2) return null;

          const { cx: x1, cy: y1 } = getCardCenter(card1);
          const { cx: x2, cy: y2 } = getCardCenter(card2);

          return (
            <line
              key={link.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={link.color}
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute top-0 left-0 pointer-events-none">
        {links.map((link) => {
          const card1 = cards[link.from];
          const card2 = cards[link.to];
          if (!card1 || !card2) return null;

          const { cx: x1, cy: y1 } = getCardCenter(card1);
          const { cx: x2, cy: y2 } = getCardCenter(card2);
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <div
              key={`label-${link.id}`}
              className="absolute pointer-events-auto"
              style={{
                left: `${midX}px`,
                top: `${midY}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openModal('edit', link.id);
              }}
            >
              <span
                className="inline-block bg-white px-2.5 py-1 rounded-full text-[13px] font-bold cursor-pointer border-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-100 hover:scale-110"
                style={{
                  color: link.color,
                  borderColor: link.color,
                }}
              >
                {link.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
});

ConnectionLines.displayName = 'ConnectionLines';
