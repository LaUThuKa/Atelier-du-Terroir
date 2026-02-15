import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import ScrollToTop from '../components/ScrollToTop';
import CatalogControls from '../components/CatalogControls';
import DishGrid from '../components/DishGrid';
import DishCardUnified from '../components/DishCardUnified';
import NeutralHero from '../components/NeutralHero';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import EmptyState from '../components/EmptyState';
import { THEMES } from '../data/content';

const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const sortOptions = useMemo(() => ["精選優先", "名稱（A→Z）", "最新上架"], []);
  const validThemeIds = useMemo(() => new Set(["all", ...THEMES.map(t => t.id)]), []);

  // 1. 初始化 State：從 URL 讀取並驗證
  const [activeTheme, setActiveTheme] = useState(() => {
    const themeFromUrl = searchParams.get("theme");
    return themeFromUrl && validThemeIds.has(themeFromUrl) ? themeFromUrl : "all";
  });

  const [activeSort, setActiveSort] = useState(() => {
    const sortFromUrl = searchParams.get("sort");
    return sortFromUrl && sortOptions.includes(sortFromUrl) ? sortFromUrl : "精選優先";
  });

  // 2. 狀態同步至 URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const nextParams = new URLSearchParams();
    if (activeTheme !== "all") nextParams.set("theme", activeTheme);
    if (activeSort !== "精選優先") nextParams.set("sort", activeSort);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [activeTheme, activeSort, setSearchParams, searchParams]);

  const themesForChips = useMemo(() => [
    { id: 'all', title_zh: '全部' },
    ...THEMES.map(t => ({ id: t.id, title_zh: t.name }))
  ], []);

  const dishesAll = useMemo(() => {
    return THEMES.flatMap(theme => 
      theme.dishes.map(dish => ({ 
        ...dish, 
        theme_id: theme.id 
      }))
    );
  }, []);

  const filteredDishes = useMemo(() => {
    const results = activeTheme === "all" 
      ? dishesAll 
      : dishesAll.filter(dish => (dish as any).theme_id === activeTheme);

    return [...results].sort((a, b) => {
      if (activeSort === "精選優先") {
        const featA = (a as any).is_featured ? 1 : 0;
        const featB = (b as any).is_featured ? 1 : 0;
        if (featA !== featB) return featB - featA;
        return ((a as any).order || 99) - ((b as any).order || 99);
      }
      if (activeSort === "名稱（A→Z）") {
        return a.title.localeCompare(b.title, 'zh-Hant');
      }
      return 0; // 最新上架邏輯暫略，保持原序
    });
  }, [dishesAll, activeTheme, activeSort]);

  const handleScrollToControls = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 全站統一文字按鈕語彙
  const textButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg text-base font-bold tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95 text-olive_muted hover:text-ink px-6 py-2 bg-transparent hover:bg-surface/5";

  // [Ticket] 對齊 ThemeAll 頁面的 leftSlot：將連結移至左側，並移除背景色，僅保留文字互動感
  const leftSlot = useMemo(() => {
    if (activeTheme === 'all') return null;
    return (
      <Link 
        to={`/themes/${activeTheme}`} 
        className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent_hover transition-colors group whitespace-nowrap"
      >
        查看本主題專頁
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  }, [activeTheme]);

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <ScrollToTop />
      
      {/* [Ticket C06] 改用 SiteHeader 元件 */}
      <SiteHeader />

      <main className="pt-14 lg:pt-16 flex-1">
        <NeutralHero 
          title="完整作品目錄"
          subtitle="以主題策展方式整理所有作品"
          hint="使用下方標籤篩選作品類別"
          imageSeed={888}
        />

        {/* 控制列：純粹篩選工具 */}
        <section className="relative z-40 mb-12">
          <CatalogControls 
            themes={themesForChips}
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme} 
            sortValue={activeSort}
            sortOptions={sortOptions}
            onSortChange={setActiveSort}
            leftSlot={leftSlot}
            rightSlot={null}
          />
        </section>

        {/* 作品展示區：緊跟在控制列後 */}
        <div className="mt-8">
          {filteredDishes.length > 0 ? (
            <DishGrid>
              {filteredDishes.map((dish) => (
                <DishCardUnified key={dish.id} dish={dish as any} variant="catalog" />
              ))}
            </DishGrid>
          ) : (
            <EmptyState 
              onPrimary={handleScrollToControls}
            />
          )}
        </div>

        <div className="max-w-[1200px] mx-auto w-full px-4 py-16 border-t border-olive_divider flex justify-center">
          <Link to="/" className={textButtonClass}>
            <Home size={18} />
            回到首頁
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Catalog;