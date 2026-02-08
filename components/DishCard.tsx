import React from 'react';
import { Dish } from '../types';
import Button from './Button';
import { Phone, ChevronRight } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  index: number;
}

const DishCard: React.FC<DishCardProps> = ({ dish, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <section 
      id={`dish-${index}`} 
      // ✅ 移除 style 中的負邊距補償，改用 CSS class 控制 scroll-margin-top
      // ✅ 這樣做可以確保區塊不會在視覺上「越位」覆蓋到上一個區塊的點擊區域
      className="relative jump-anchor"
    >
      {/* Spy 錨點：僅用於判定觸發，與視覺補償無關 */}
      <div
        id={`anchor-${index + 1}`}
        className="absolute top-0 left-0 h-0 w-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* 料理內容區塊 */}
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-14 mb-16 lg:mb-28 items-stretch`}>
        
        {/* Image Container */}
        <div className="w-full lg:w-5/12 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md bg-surface">
          <img 
            src={`https://picsum.photos/seed/${dish.imageKey}/800/1000`} 
            alt={dish.title}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
             {dish.badges.map(badge => (
               <span key={badge} className="bg-bg/85 border border-olive_border backdrop-blur text-olive_muted text-[10px] lg:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm tracking-wider">
                 {badge}
               </span>
             ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full lg:w-7/12 flex flex-col justify-start">
          <h3 id={`title-dish-${index}`} className="text-2xl lg:text-3xl font-serif font-bold text-ink mb-5 tracking-wide">
            {dish.title}
          </h3>
          
          <div className="space-y-4 mb-10">
            <p className="text-xl lg:text-2xl text-text font-serif leading-relaxed line-clamp-2 font-medium">
              {dish.sentenceA}
            </p>
            <p className="text-base lg:text-[17px] text-olive_muted font-sans leading-relaxed line-clamp-2">
              {dish.sentenceB}
            </p>
          </div>

          {/* Lait Structure */}
          <div className="bg-surface/20 rounded-2xl p-7 mb-10 border border-olive_border">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-muted mb-5 font-bold">Lait Structure</h4>
            <ul className="space-y-4 font-mono text-sm lg:text-[15px] text-text">
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="line-clamp-1">{dish.laitStructure.base}</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-accent/60"></span>
                <span className="line-clamp-1">{dish.laitStructure.note}</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-accent/30"></span>
                <span className="line-clamp-1">{dish.laitStructure.finish}</span>
              </li>
            </ul>
          </div>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button 
              className="flex-1 sm:flex-none gap-2 px-8"
              onClick={() => window.location.href = 'tel:+1234567890'}
            >
              <Phone size={18} />
              品鑑洽詢
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none gap-2 px-8"
              onClick={() => window.location.href = 'mailto:info@atelier.com'}
            >
              合作邀約
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DishCard;