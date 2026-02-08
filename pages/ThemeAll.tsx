import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { THEMES } from '../data/content';
import { Menu, ArrowLeft, Phone, ChevronRight, ListFilter, Check, Home, ArrowRight, SearchX } from 'lucide-react';
import Button from '../components/Button';
import NeutralHero from '../components/NeutralHero';
import ScrollToTop from '../components/ScrollToTop';

const ThemeAll: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const [activeFilter, setActiveFilter] = useState('全部');

  const filters = ['全部', '人氣 No.1', '蛋奶素', '新品'];

  // [UX] 整合排序與篩選邏輯
  const displayDishes = useMemo(() => {
    // 1. 先進行排序 (featured_first)
    const sorted = [...theme.dishes].sort((a, b) => {
      const featA = a.is_featured ? 1 : 0;
      const featB = b.is_featured ? 1 : 0;
      if (featA !== featB) return featB - featA;

      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return 0;
    });

    // 2. 進行篩選
    if (activeFilter === '全部') return sorted;
    return sorted.filter(dish => dish.badges.includes(activeFilter));
  }, [theme.dishes, activeFilter]);

  return (
    <div className="bg-bg min-h-screen text-text">
      <ScrollToTop />
      {/* 全站統一 Header */}
      <header className="fixed top-0 left-0 right-0 h-14 lg:h-16 bg-bg/95 backdrop-blur z-50 border-b border-olive_divider px-4 lg:px-8 flex items-center justify-between">
        <div className="w-10">
           <Menu className="text-text cursor-pointer hover:text-accent transition-colors" />
        </div>
        <Link 
          to="/"
          className="font-serif font-bold text-lg lg:text-xl tracking-wider text-ink hover:text-accent transition-colors"
        >
          Atelier du Terroir
        </Link>
        <div className="w-10 flex justify-end">
           <a href="tel:+123456789" className="text-xs font-semibold bg-ink text-bg px-4 py-1.5 rounded-full hover:bg-accent transition-all">
             Contact
           </a>
        </div>
      </header>

      <main className="pt-14 lg:pt-16">
        {/* [R01-2] 使用共用 NeutralHero */}
        <NeutralHero 
          title={theme.name} 
          subtitle={theme.tagline} 
        />

        {/* [R02] Filter / Sort Bar */}
        <nav className="sticky top-14 lg:top-16 z-30 bg-bg/95 backdrop-blur-md border-b border-olive_divider shadow-sm">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8 h-14 lg:h-16 flex items-center justify-between overflow-x-auto no-scrollbar">
            {/* Sort Section (Left) - 目前預設為精選優先 */}
            <div className="flex items-center gap-3 shrink-0 mr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-olive_hint flex items-center gap-1.5">
                <ListFilter size={12} />
                排序
              </span>
              <div className="h-6 w-px bg-olive_divider"></div>
              <button className="text-xs font-bold text-ink hover:text-accent transition-colors flex items-center gap-1.5 whitespace-nowrap">
                精選優先
                <Check size={14} className="text-accent" />
              </button>
            </div>

            {/* [UX] Filter Chips: 點擊後切換篩選條件 */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all
                    ${activeFilter === f 
                      ? 'bg-ink text-bg shadow-lg scale-105 border-ink' 
                      : 'bg-surface/30 text-olive_muted border border-olive_border hover:bg-surface/50 hover:text-ink hover:border-olive_hint'
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10 lg:py-12">
          {/* Back Action */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-olive_muted hover:text-accent transition-colors font-medium text-sm lg:text-base group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              返回首頁選單
            </Link>
          </div>

          {/* Dish Grid 或 Empty State */}
          {displayDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 animate-fade-in">
              {displayDishes.map((dish) => (
                <div key={dish.id} className="flex flex-col group">
                  {/* Image Card */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-surface mb-6">
                    <img 
                      src={`https://picsum.photos/seed/${dish.imageKey}/600/750`} 
                      alt={dish.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {dish.is_featured && (
                        <span className="bg-accent text-bg text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      {dish.badges.slice(0, 1).map(badge => (
                        <span key={badge} className="bg-bg/90 border border-olive_border backdrop-blur text-olive_muted text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-serif font-bold text-ink mb-3 tracking-wide">
                    {dish.title}
                  </h3>
                  <p className="text-sm text-olive_muted font-sans leading-relaxed mb-6 line-clamp-2">
                    {dish.sentenceA}
                  </p>

                  {/* Lait Structure */}
                  <div className="bg-surface/10 rounded-xl p-4 mb-6 border border-olive_border/50">
                    <ul className="space-y-2 text-[13px] text-text font-medium italic">
                      {dish.laitStructure.base && (
                        <li className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                          <span className="truncate">{dish.laitStructure.base}</span>
                        </li>
                      )}
                      {dish.laitStructure.note && (
                        <li className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/60"></span>
                          <span className="truncate">{dish.laitStructure.note}</span>
                        </li>
                      )}
                      {dish.laitStructure.finish && (
                        <li className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/20"></span>
                          <span className="truncate">{dish.laitStructure.finish}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <Button 
                      className="flex-1 text-xs py-2.5 font-bold"
                      onClick={() => window.location.href = 'tel:+1234567890'}
                    >
                      <Phone size={14} className="mr-2" />
                      品鑑洽詢
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-xs py-2.5 font-bold"
                    >
                      合作邀約
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* [UX] Empty State: 當篩選結果為 0 時顯示 */
            <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 bg-surface/20 rounded-full flex items-center justify-center mb-6 text-olive_disabled">
                <SearchX size={40} />
              </div>
              <h4 className="text-2xl font-serif font-bold text-ink mb-3">
                目前沒有符合「{activeFilter}」的作品
              </h4>
              <p className="text-olive_muted mb-10 max-w-sm">
                建議您嘗試其他的篩選條件，或查看該主題下的所有精選料理。
              </p>
              <Button 
                variant="primary" 
                onClick={() => setActiveFilter('全部')}
                className="px-10"
              >
                回到全部作品
              </Button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-20 pt-12 border-t border-olive_divider flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
            <Link to="/">
              <Button variant="text" className="gap-2 px-6 py-2 text-base">
                <Home size={18} />
                回到首頁
              </Button>
            </Link>
            <span className="hidden sm:block text-olive_disabled text-lg" aria-hidden="true">/</span>
            <Link to="/catalog">
              <Button variant="text" className="gap-2 px-6 py-2 text-base">
                瀏覽完整目錄
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-ink text-surface/40 py-12 text-center text-xs tracking-widest mt-20">
        <p className="mb-2">© ATELIER DU TERROIR. ALL RIGHTS RESERVED.</p>
        <p className="font-serif">從土壤到餐桌的藝術敘事</p>
      </footer>
    </div>
  );
};

export default ThemeAll;