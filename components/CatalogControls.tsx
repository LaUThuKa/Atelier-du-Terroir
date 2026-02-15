import React from 'react';
import ThemeChips from './ThemeChips';
import SortSelect from './SortSelect';

interface ThemeChipData {
  id: string;
  title_zh: string;
}

interface CatalogControlsProps {
  themes: ThemeChipData[];
  activeTheme: string;
  onThemeChange: (id: string) => void;
  sortValue: string;
  sortOptions: string[];
  onSortChange: (value: string) => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

const CatalogControls: React.FC<CatalogControlsProps> = ({
  themes,
  activeTheme,
  onThemeChange,
  sortValue,
  sortOptions,
  onSortChange,
  leftSlot,
  rightSlot
}) => {
  return (
    <div className="w-full bg-bg shadow-sm sticky top-14 lg:top-16 z-40">
      <div className="max-w-[1200px] mx-auto px-4 py-3 lg:py-4 border-b border-olive_divider/10">
        {/* 主要控制行：確保 Chips、Slot 與 Sort 處於同一行 */}
        <div className="flex items-center gap-3 lg:gap-6 w-full">
          
          {/* Left: Desktop Only Context Slot */}
          <div className="hidden md:flex items-center w-[180px] shrink-0">
            {leftSlot || <div className="w-full" />}
          </div>

          {/* Middle: Theme Chips (核心捲動區) */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <ThemeChips 
              themes={themes} 
              value={activeTheme} 
              onChange={onThemeChange} 
            />
          </div>

          {/* Right: Actions (CTA + Sort Select) */}
          <div className="shrink-0 flex items-center gap-2 lg:gap-4">
            {rightSlot}
            <SortSelect 
              value={sortValue} 
              options={sortOptions} 
              onChange={onSortChange} 
            />
          </div>
        </div>

        {/* Mobile Only: Left Slot (顯示於下方，避免擠壓) */}
        {leftSlot && (
          <div className="md:hidden w-full flex justify-center mt-3 pt-3 border-t border-olive_divider/5">
            {leftSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogControls;