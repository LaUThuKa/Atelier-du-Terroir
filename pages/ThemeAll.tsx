import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { THEMES } from '../data/content';
import { Home } from 'lucide-react';
import NeutralHero from '../components/NeutralHero';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import ScrollToTop from '../components/ScrollToTop';
import DishGrid from '../components/DishGrid';
import DishCardUnified from '../components/DishCardUnified';
import EmptyState from '../components/EmptyState';

const ThemeAll: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const displayDishes = useMemo(() => {
    return [...theme.dishes].sort((a, b) => {
      const featA = a.is_featured ? 1 : 0;
      const featB = b.is_featured ? 1 : 0;
      if (featA !== featB) return featB - featA;
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
  }, [theme.dishes]);

  const handleScrollToControls = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // [Ticket C04] 統一導流按鈕風格：對齊 Catalog.tsx 的 textButtonClass
  const textButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg text-base font-bold tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95 text-olive_muted hover:text-ink px-6 py-2 bg-transparent hover:bg-surface/5";

  return (
    <div className="bg-bg min-h-screen text-text">
      <ScrollToTop />
      
      {/* [Ticket C06] 改用 SiteHeader 元件 */}
      <SiteHeader />

      <main className="pt-14 lg:pt-16">
        <div className="pointer-events-none md:pointer-events-auto">
          <NeutralHero 
            title={theme.name} 
            subtitle={theme.tagline} 
            imageSeed={theme.imageKey}
          />
        </div>

        <div className="mt-8">
          {displayDishes.length > 0 ? (
            <DishGrid>
              {displayDishes.map((dish) => (
                <DishCardUnified key={dish.id} dish={dish} variant="theme" />
              ))}
            </DishGrid>
          ) : (
            <EmptyState 
              onPrimary={handleScrollToControls}
              secondaryLabel="切換其他主題"
              onSecondary={handleScrollToControls}
            />
          )}
        </div>

        {/* [Ticket C04] 頁尾導航：位置、樣式、文案與 Catalog 完全一致 */}
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

export default ThemeAll;
