import React from 'react';
import { Dish } from '../types';
import Button from './Button';
import { Phone, ChevronRight } from 'lucide-react';

interface CatalogDishCardProps {
  dish: Dish;
}

const CatalogDishCard: React.FC<CatalogDishCardProps> = ({ dish }) => {
  return (
    <div className="group flex flex-col h-full bg-bg border border-olive_border rounded-2xl overflow-hidden transition-all duration-300 hover:border-olive_hint hover:shadow-xl hover:-translate-y-1">
      {/* 1. Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface/20">
        <img 
          src={`https://picsum.photos/seed/${dish.imageKey}/800/600`} 
          alt={dish.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-bg/90 backdrop-blur-sm border border-olive_border text-olive_muted text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm tracking-wider">
            {dish.badges?.[0] ?? '精選作品'}
          </span>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex flex-col flex-1 p-6">
        {/* Title (line-clamp-2) */}
        <h3 className="text-xl font-serif font-bold text-ink mb-2 tracking-wide line-clamp-2 min-h-[3.5rem]">
          {dish.title}
        </h3>

        {/* Subtitle (line-clamp-2) */}
        <p className="text-sm font-serif font-medium text-text/90 mb-3 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {dish.sentenceA}
        </p>

        {/* Description (line-clamp-3) */}
        <p className="text-[13px] font-sans text-olive_muted leading-relaxed line-clamp-3 mb-6 min-h-[3.75rem]">
          {dish.sentenceB}
        </p>

        {/* 3. CTA Group (Primary + Ghost) */}
        <div className="mt-auto flex gap-3 pt-4 border-t border-olive_divider">
          <Button 
            className="flex-1 text-[11px] py-2.5 gap-1.5"
            onClick={(e) => {
              e.preventDefault();
              // 暫不執行電話撥打，保留互動反饋
            }}
          >
            <Phone size={14} />
            品鑑作品
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 text-[11px] py-2.5 gap-1"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            合作邀約
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatalogDishCard;