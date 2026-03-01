import React from 'react';

interface ThemeChipData {
  id: string;
  title_zh: string;
}

interface ThemeChipsProps {
  themes: ThemeChipData[];
  value?: string;
  onChange: (id: string) => void;
}

const ThemeChips: React.FC<ThemeChipsProps> = ({ themes, value, onChange }) => {
  return (
    <div className="w-full">
      {/* 橫向滑動容器：確保內容不換行，支援手勢滾動 */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 flex-nowrap [-webkit-overflow-scrolling:touch]">
        {themes.map((theme) => {
          const isActive = value === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onChange(theme.id)}
              aria-pressed={isActive}
              className={`
                whitespace-nowrap px-5 py-2 rounded-full text-[13px] font-bold tracking-wider 
                transition-all duration-300 active:scale-95 border shrink-0
                ${isActive
                  ? 'bg-card/60 text-ink border-accent ring-1 ring-accent/40 shadow-[0_6px_18px_rgba(var(--ink),0.08)]'
                  : 'bg-card/35 border-olive_divider text-text hover:text-ink hover:border-olive_border hover:bg-card/55'
                }
              `}
            >
              {theme.title_zh}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeChips;
