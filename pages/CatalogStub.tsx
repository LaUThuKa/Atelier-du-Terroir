import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

const CatalogStub: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-8 text-center">
      <ScrollToTop />
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif font-bold text-ink mb-4">作品目錄</h1>
        <p className="text-olive_muted text-lg mb-10 leading-relaxed">
          這裡是完整作品目錄的預留空間。我們正在整理所有精選料理與背後的工藝敘事。
        </p>
        
        {/* [UI-02] 返回動作統一使用 ghost variant Button */}
        <Link to="/">
          <Button variant="ghost" className="px-10 py-4 font-bold">
            <ArrowLeft size={18} className="mr-2" />
            返回首頁
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CatalogStub;