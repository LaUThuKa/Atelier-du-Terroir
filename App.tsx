import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { THEMES } from './data/content';
import { Theme } from './types';
import DishCard from './components/DishCard';
import Button from './components/Button';
import StickyNav from './components/StickyNav';
import MobileNav from './components/MobileNav';
import NeutralHero from './components/NeutralHero';
import ScrollToTop from './components/ScrollToTop';
import { Menu, ArrowRight } from 'lucide-react';

/**
 * 捲動定位常數系統
 */
const SAFE_GAP = 40; // px (視覺留白：對齊基準)
const LINE_PAD = 8;  // px (邏輯基準：紅線位置)

/**
 * 獲取實時 CSS 變數數值
 */
const getV = (name: string) => {
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseFloat(val) || 0;
};

const App: React.FC = () => {
  // ✅ 已依要求關閉紅線
  const DEBUG_SPYLINE = false;

  const [activeThemeId, setActiveThemeId] = useState(THEMES[0].id);
  const [activeSection, setActiveSection] = useState('editor-note');
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scrollEndTimerRef = useRef<number | null>(null);
  const safetyUnlockRef = useRef<number | null>(null);

  const currentTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

  /**
   * 使用 ResizeObserver 自動校準高度
   */
  useLayoutEffect(() => {
    const root = document.documentElement;
    const headerEl = document.querySelector('header');
    const tabsEl = document.getElementById('theme-tabs');

    const updateVars = () => {
      const hH = headerEl?.getBoundingClientRect().height || 0;
      const tH = tabsEl?.getBoundingClientRect().height || 0;
      
      const tabsBottom = hH + tH;
      
      root.style.setProperty('--headerHeight', `${hH}px`);
      root.style.setProperty('--tabsHeight', `${tH}px`);
      root.style.setProperty('--spyLineTop', `${tabsBottom + LINE_PAD}px`);
      root.style.setProperty('--visualLineTop', `${tabsBottom + SAFE_GAP}px`);
      root.style.setProperty('--tabsBottom', `${tabsBottom}px`);
    };

    const observer = new ResizeObserver(updateVars);
    
    if (headerEl) observer.observe(headerEl);
    if (tabsEl) observer.observe(tabsEl);

    updateVars();
    window.addEventListener('resize', updateVars);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateVars);
    };
  }, []);

  const lockUntilScrollEnd = useCallback(() => {
    setIsScrolling(true);
    const DEBOUNCE_MS = 300;
    const SAFETY_MS = 1600;

    const cleanup = () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current);
      if (safetyUnlockRef.current) window.clearTimeout(safetyUnlockRef.current);
      scrollEndTimerRef.current = null;
      safetyUnlockRef.current = null;
    };

    const unlock = () => {
      cleanup();
      setIsScrolling(false);
    };

    const onScroll = () => {
      if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = window.setTimeout(unlock, DEBOUNCE_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    safetyUnlockRef.current = window.setTimeout(unlock, SAFETY_MS);
  }, []);

  const handleNavigate = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    lockUntilScrollEnd();
    setActiveSection(id);

    const visualLineTop = getV('--visualLineTop');
    let targetElement: HTMLElement | null = null;

    if (id === 'editor-note') {
      targetElement = document.getElementById('editor-note');
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const y = rect.top + window.scrollY - visualLineTop;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    } else if (id.startsWith('dish-')) {
      const index = id.split('-')[1];
      targetElement = document.getElementById(`dish-${index}`);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        // ✅ 修正：手動減去 visualLineTop 偏移量
        // 因為 DishCard 不再帶有負 margin 補償，這裡必須顯式計算
        const y = rect.top + window.scrollY - visualLineTop;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleThemeChange = (themeId: string) => {
    setActiveThemeId(themeId);
    setTimeout(() => {
      handleNavigate('editor-note');
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const spyLine = getV('--spyLineTop');
      const EPS = 2;

      const markers = [
        { anchorId: 'anchor-00', sectionId: 'editor-note' },
        ...currentTheme.dishes.map((_, i) => ({ 
          anchorId: `anchor-${i + 1}`, 
          sectionId: `dish-${i}` 
        }))
      ];

      let newActive = 'editor-note';
      for (const marker of markers) {
        const element = document.getElementById(marker.anchorId);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        if (rect.top <= spyLine + EPS) {
          newActive = marker.sectionId;
        } else {
          break;
        }
      }
      
      if (newActive !== activeSection) {
        setActiveSection(newActive);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTheme, isScrolling, activeSection]);

  const handlePrevDish = () => {
    if (activeSection.startsWith('dish-')) {
      const currentIndex = parseInt(activeSection.split('-')[1]);
      if (currentIndex > 0) {
        handleNavigate(`dish-${currentIndex - 1}`);
      }
    } else {
       handleNavigate('dish-0');
    }
  };

  const handleNextDish = () => {
    if (activeSection.startsWith('dish-')) {
      const currentIndex = parseInt(activeSection.split('-')[1]);
      if (currentIndex < currentTheme.dishes.length - 1) {
        handleNavigate(`dish-${currentIndex + 1}`);
      }
    } else if (activeSection === 'editor-note' && currentTheme.dishes.length > 0) {
      handleNavigate('dish-0');
    }
  };
  
  const currentDishIndex = activeSection.startsWith('dish-') ? parseInt(activeSection.split('-')[1]) : -1;
  const canPrev = currentDishIndex > 0;
  const canNext = currentDishIndex < currentTheme.dishes.length - 1 || (currentDishIndex === -1 && currentTheme.dishes.length > 0);

  return (
    <div className="bg-bg min-h-screen text-text selection:bg-surface selection:text-ink pb-20 lg:pb-0">
      <ScrollToTop />
      
      {/* 紅線組件 (已關閉) */}
      {DEBUG_SPYLINE && (
        <div 
          id="spy-line-visual" 
          aria-hidden="true" 
          className="fixed left-0 right-0 h-[1px] bg-red-600 z-[9999] pointer-events-none opacity-100 shadow-[0_0_8px_rgba(220,38,38,0.4)]" 
          style={{ top: 'var(--spyLineTop)' }} 
        />
      )}

      <header className="fixed top-0 left-0 right-0 h-14 lg:h-16 bg-bg/95 backdrop-blur z-50 border-b border-olive_divider px-4 lg:px-8 flex items-center justify-between">
        <div className="w-10">
           <Menu className="text-text cursor-pointer hover:text-accent transition-colors" />
        </div>
        <button 
          onClick={() => handleNavigate('top')}
          className="font-serif font-bold text-lg lg:text-xl tracking-wider text-ink hover:text-accent transition-colors outline-none px-2 rounded-md focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Atelier du Terroir
        </button>
        <div className="w-10 flex justify-end">
           <a href="tel:+123456789" className="text-xs font-semibold bg-ink text-bg px-4 py-1.5 rounded-full hover:bg-accent transition-all">
             Contact
           </a>
        </div>
      </header>

      <main className="pt-14 lg:pt-16">
        {/* [R01-2] 使用共用 NeutralHero */}
        <NeutralHero 
          title="土壤到餐桌的藝術敘事" 
          subtitle="Pure Lait Experience" 
        />

        <section id="theme-tabs" className="sticky top-14 lg:top-16 z-40 bg-bg shadow-[0_1px_3px_rgba(79,88,59,0.1)] border-b border-olive_divider/10">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex overflow-x-auto no-scrollbar py-4 gap-4 lg:justify-center">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`
                    flex-shrink-0 relative overflow-hidden group
                    w-[100px] lg:w-[150px] h-[50px] lg:h-[56px] rounded-lg
                    transition-all duration-300 outline-none
                    ${activeThemeId === theme.id 
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg shadow-[0_12px_32px_rgba(23,26,17,0.16)] scale-[1.02]' 
                      : 'opacity-70 grayscale-[40%] shadow-[0_8px_24px_rgba(23,26,17,0.10)] hover:opacity-100 hover:grayscale-0'
                    }
                  `}
                >
                  <img 
                    src={`https://picsum.photos/seed/${theme.imageKey}/400/200`}
                    alt={theme.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`
                    absolute inset-0 flex items-center justify-center transition-opacity duration-300
                    ${activeThemeId === theme.id ? 'bg-ink/35' : 'bg-ink/50 group-hover:bg-ink/40'}
                  `}>
                    <span className={`
                      text-[12px] lg:text-[13px] text-bg font-serif tracking-[0.25em] font-semibold
                    `}>
                      {theme.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="py-3 border-t border-olive_divider text-center">
              <p className="text-base lg:text-lg text-muted font-medium italic animate-fade-in tracking-wide">
                {currentTheme.tagline}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row relative items-stretch">
          <div className="flex-1 px-4 lg:px-8 pt-0 pb-16 min-h-screen">
            
            {/* ✅ 恢復 00 區別化規則 (單純區塊，不帶 padding/margin 補償) */}
            <section id="editor-note" className="relative mt-2 pt-8 mb-16 lg:mb-20 pb-10 lg:pb-14 border-b border-olive_border/40">
              <div id="anchor-00" className="absolute top-0 left-0 h-0 w-0 invisible pointer-events-none" aria-hidden="true" />
              <div className="bg-surface/10 rounded-2xl p-8 lg:p-14 border border-olive_border shadow-sm">
                <div className="max-w-[72ch] mx-auto space-y-6 text-center">
                  <h2 className="text-accent text-xs font-semibold uppercase tracking-[0.28em] mb-2">Editor's Note</h2>
                  <p className="text-text/90 font-serif text-lg lg:text-[20px] leading-[1.85] font-medium">
                    在每一道料理中，我們堅持還原食材最原始的靈魂。
                  </p>
                  <p className="text-olive_muted font-sans text-base lg:text-lg leading-[1.85] max-w-xl mx-auto font-normal">
                    透過精準的火候控制與調味堆疊，創造出超越味覺的感官體驗。這是一場關於土地、時間與技藝的對話。
                  </p>
                  <div className="pt-2 flex justify-center">
                    <span className="text-[10px] lg:text-xs font-bold text-ink bg-surface/30 px-6 py-2.5 rounded-full uppercase tracking-[0.2em]">
                      Curated Artisanal Experience
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section id="showcase-start">
               {currentTheme.dishes.map((dish, index) => (
                 <DishCard key={`${currentTheme.id}-${dish.id}`} dish={dish} index={index} />
               ))}
               
               {/* [UI-03] 主題底部導流：改用 text variant Button 以降低視覺強度，並維持分隔符 */}
               <div className="border-t border-olive_divider pt-12 pb-8 flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center items-center">
                 <Link to={`/themes/${currentTheme.id}`}>
                   <Button variant="text" className="gap-2 px-4 py-2 text-base">
                     查看本主題全部作品
                     <ArrowRight size={18} />
                   </Button>
                 </Link>
                 <span className="hidden sm:block text-olive_disabled text-lg" aria-hidden="true">/</span>
                 <Link to="/catalog">
                   <Button variant="text" className="gap-2 px-4 py-2 text-base">
                     完整作品目錄
                     <ArrowRight size={18} />
                   </Button>
                 </Link>
               </div>
            </section>
          </div>

          <aside className="hidden lg:block w-[320px] pl-10 relative">
            <StickyNav 
              currentTheme={currentTheme}
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />
          </aside>
        </div>
      </main>

      <MobileNav 
        currentTheme={currentTheme}
        onNavigate={handleNavigate}
        onPrevDish={handlePrevDish}
        onNextDish={handleNextDish}
        canPrev={canPrev}
        canNext={canNext}
      />
    </div>
  );
};

export default App;