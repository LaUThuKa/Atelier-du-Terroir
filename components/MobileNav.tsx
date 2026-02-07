import React, { useState, useEffect } from 'react';
import { ArrowUp, ChevronLeft, ChevronRight, Menu, X, ExternalLink } from 'lucide-react';
import { Theme } from '../types';

interface MobileNavProps {
  currentTheme: Theme;
  onNavigate: (sectionId: string) => void;
  onPrevDish: () => void;
  onNextDish: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({
  currentTheme,
  onNavigate,
  onPrevDish,
  onNextDish,
  canPrev,
  canNext,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [currentTheme.id]);

  const handleNavClick = (id: string) => {
    // 呼叫父組件傳入的 handleNavigate，會自動執行 scrollToAnchor 並處理狀態鎖定
    onNavigate(id);
    setIsOpen(false);
  };

  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-bg border-t border-olive_divider z-50 px-4 flex items-center justify-between lg:hidden shadow-[0_-4px_12px_-2px_rgba(79,88,59,0.12)]">
        <button 
          onClick={() => onNavigate('top')} 
          className={`p-2 text-olive_muted hover:text-text active:scale-90 transition-all rounded-md ${focusRing}`}
        >
          <ArrowUp size={22} />
        </button>

        <div className="flex items-center gap-8">
          <button 
            onClick={onPrevDish}
            disabled={!canPrev}
            className={`p-2 transition-all rounded-md ${focusRing} ${!canPrev ? 'opacity-20' : 'text-olive_muted hover:text-text active:scale-90'}`}
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="h-5 w-px bg-olive_divider"></div>

          <button 
            onClick={onNextDish}
            disabled={!canNext}
            className={`p-2 transition-all rounded-md ${focusRing} ${!canNext ? 'opacity-20' : 'text-olive_muted hover:text-text active:scale-90'}`}
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-surface/40 rounded-full text-xs font-bold text-ink active:scale-95 transition-all ${focusRing}`}
        >
          <Menu size={16} />
          INDEX
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-bg rounded-t-[2.5rem] shadow-2xl p-8 transition-transform duration-500 transform translate-y-0 h-[80vh] flex flex-col">
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-serif text-2xl font-bold text-ink">Index</h3>
              <button onClick={() => setIsOpen(false)} className={`p-2.5 text-olive_muted bg-surface/30 rounded-full ${focusRing}`}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-10 no-scrollbar pb-24">
              <div className="space-y-6">
                <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">On This Page</h5>
                <ul className="space-y-5">
                  <li>
                    <button onClick={() => handleNavClick('editor-note')} className={`text-lg text-text w-full text-left font-medium border-b border-olive_divider pb-2 rounded-md ${focusRing}`}>
                      Editor's Note
                    </button>
                  </li>
                  {currentTheme.dishes.map((dish, index) => (
                    <li key={dish.id}>
                      <button onClick={() => handleNavClick(`dish-${index}`)} className={`text-lg text-text w-full text-left font-medium border-b border-olive_divider pb-2 truncate rounded-md ${focusRing}`}>
                        <span className="font-mono text-xs text-olive_disabled mr-3">{String(index + 1).padStart(2, '0')}</span>
                        {dish.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-surface/20 rounded-3xl border border-olive_border">
                 <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Current Context</span>
                 <p className="font-serif font-bold text-xl text-ink">{currentTheme.name}</p>
                 <p className="text-sm text-olive_muted mt-2 font-medium italic">{currentTheme.tagline}</p>
              </div>

              <div className="space-y-6">
                <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-olive_muted">Explore</h5>
                <ul className="space-y-4">
                  <li>
                    <a href="#full-list" className={`flex items-center justify-between text-lg text-text font-semibold rounded-md p-1 ${focusRing}`}>
                      查看本主題全部作品
                      <ExternalLink size={18} className="text-olive_hint" />
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className={`flex items-center justify-between text-lg text-text font-semibold rounded-md p-1 ${focusRing}`}>
                      完整作品目錄
                      <ExternalLink size={18} className="text-olive_hint" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;