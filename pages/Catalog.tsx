import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import ScrollToTop from '../components/ScrollToTop';
import DishGrid from '../components/DishGrid';
import DishCardUnified from '../components/DishCardUnified';
import NeutralHero from '../components/NeutralHero';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import EmptyState from '../components/EmptyState';
import ThemeChips from '../components/ThemeChips';
import { THEMES } from '../data/content';

const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const catalogDishes = useMemo(() => {
    return THEMES.flatMap(theme => 
      theme.dishes.map(dish => ({ 
        ...dish, 
        theme_id: theme.id 
      }))
    );
  }, []);
  const themesForChips = useMemo(
    () => THEMES.map((t) => ({ id: t.id, title_zh: t.name })),
    []
  );

  const handleScrollToControls = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 全站統一文字按鈕語彙
  const textButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg text-base font-bold tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95 text-olive_muted hover:text-ink px-6 py-2 bg-transparent hover:bg-surface/5";

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <ScrollToTop />
      
      {/* [Ticket C06] 改用 SiteHeader 元件 */}
      <SiteHeader />

      <main className="pt-14 lg:pt-16 flex-1">
        <div className="pointer-events-none md:pointer-events-auto">
          <NeutralHero 
            title="完整作品目錄"
            subtitle="以主題策展方式整理所有作品"
            hint="使用下方標籤篩選作品類別"
            imageSeed={888}
          />
        </div>

        <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-olive_divider/20 py-2">
          <section className="max-w-[1200px] mx-auto px-4">
            <ThemeChips
              themes={themesForChips}
              value=""
              onChange={(id) => navigate(`/themes/${id}`)}
            />
          </section>
        </div>

        {/* 作品展示區 */}
        <div className="pt-4">
          {catalogDishes.length > 0 ? (
            <DishGrid>
              {catalogDishes.map((dish) => (
                <DishCardUnified key={`${(dish as any).theme_id}-${dish.id}`} dish={dish as any} variant="catalog" />
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
