import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "搜尋作品名稱、關鍵詞" 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full group">
      {/* 搜尋圖示 */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-olive_hint pointer-events-none group-focus-within:text-accent transition-colors">
        <Search size={20} />
      </div>

      {/* 輸入框 */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="搜尋作品"
        className="w-full bg-surface/10 border border-olive_border rounded-2xl py-4 pl-14 pr-12 text-text placeholder:text-olive_hint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-300 font-sans font-medium"
      />

      {/* 清除按鈕 */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-olive_hint hover:text-ink hover:bg-surface/20 transition-all"
          title="清除搜尋"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;