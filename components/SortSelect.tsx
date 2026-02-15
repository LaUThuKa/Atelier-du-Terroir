import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ListFilter, Check } from 'lucide-react';

interface SortSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* 觸發按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-olive_border bg-surface/10 hover:bg-surface/20 transition-all duration-300 group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-olive_hint flex items-center gap-1.5">
          <ListFilter size={14} />
          排序
        </span>
        <div className="w-px h-4 bg-olive_divider" />
        <span className="text-sm font-bold text-ink min-w-[80px] text-left">
          {value}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-olive_hint transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div 
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-bg border border-olive_border rounded-xl shadow-xl z-40 overflow-hidden backdrop-blur-md"
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                role="menuitem"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors
                  ${value === option 
                    ? 'text-accent bg-surface/10' 
                    : 'text-olive_muted hover:bg-surface/20 hover:text-ink'
                  }
                `}
              >
                {option}
                {value === option && <Check size={14} className="text-accent" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortSelect;