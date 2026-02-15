import React from 'react';

/**
 * SiteFooter - 全站共用頁尾
 * [Ticket A01-T11] 深色錨點視覺優化：統一 bg-footerDeep 與文字對比度。
 */
const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full bg-footerDeep text-vanilla py-10 sm:py-12 border-t border-olive_divider transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        {/* Copyright 次要資訊：使用 olive_hint 降低視覺權重 */}
        <p className="text-xs tracking-[0.18em] uppercase text-olive_hint transition-colors duration-200">
          © ATELIER DU TERROIR. ALL RIGHTS RESERVED.
        </p>
        
        {/* 品牌標語 */}
        <p className="mt-2 text-sm text-olive_hint font-serif transition-colors duration-200">
          從土壤到餐桌的藝術敘事
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
