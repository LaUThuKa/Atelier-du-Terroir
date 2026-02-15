import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SiteHeader - 全站共用頂欄
 * [Ticket A01-T10a] 僅調整色彩 className，嚴禁改動 DOM 結構、佈局與高度。
 */
const SiteHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 lg:h-16 bg-surface z-50 border-b border-olive_divider px-4 lg:px-8 flex items-center justify-between transition-colors duration-200">
      {/* 左側：章印裝飾 (保持原結構與間距) */}
      <div className="shrink-0 flex items-center">
        <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl border border-olive_border bg-surface/10 overflow-hidden flex items-center justify-center">
          <span aria-hidden="true" className="text-base leading-none text-olive_hint">
            {/* 裝飾性內容，不改動 DOM */}
          </span>
        </div>
      </div>

      {/* 中央：品牌 Logo (僅調整文字色彩語意) */}
      <Link 
        to="/"
        className="font-serif font-bold text-lg lg:text-xl tracking-wider text-dark hover:text-accent transition-colors outline-none px-2 rounded-md focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Atelier du Terroir
      </Link>

      {/* 右側：聯絡按鈕 (僅調整背景色彩語意) */}
      <div className="shrink-0 flex items-center justify-end">
         <a 
           href="tel:+123456789" 
           className="text-xs font-semibold bg-dark text-bg px-4 py-1.5 rounded-full hover:bg-accent transition-all whitespace-nowrap"
         >
           Contact
         </a>
      </div>
    </header>
  );
};

export default SiteHeader;
