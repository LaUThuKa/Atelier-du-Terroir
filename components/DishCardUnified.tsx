import React from 'react';
import Button from './Button';
import { Phone, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface DishCardUnifiedProps {
  dish: any; // 使用 any 以兼容來自首頁 THEMES 或外部 API 的不同資料結構
  variant: 'catalog' | 'theme';
}

const DishCardUnified: React.FC<DishCardUnifiedProps> = ({ dish, variant }) => {
  const isCatalog = variant === 'catalog';

  // 1. 欄位適配 (Adapter Logic) - 依照 Ticket U05.1 規格優先取值
  const imageSrc = dish.image 
    || dish.image_url 
    || dish.cover 
    || dish.cover_url 
    || dish.hero_image 
    || dish.heroImage 
    || null;

  const title = dish.title_zh 
    || dish.titleZh 
    || dish.title 
    || "Untitled";

  const subtitle = dish.subtitle_zh 
    || dish.subtitleZh 
    || dish.subtitle 
    || "";

  const description = dish.description_zh 
    || dish.descriptionZh 
    || dish.description 
    || dish.sentenceA 
    || "";

  const description2 = dish.description2_zh 
    || dish.description2Zh 
    || dish.description2 
    || dish.sentenceB 
    || "";

  // 若主要描述為空，則嘗試使用第二描述作為備案
  const finalDescription = description || description2 || "";

  const tag = dish.badges?.[0] 
    || dish.tags?.[0] 
    || dish.tag_zh 
    || dish.tag 
    || "精選作品";

  // 密度與視覺設定分岔
  const styles = {
    container: isCatalog ? "p-5" : "p-6",
    imageAspect: isCatalog ? "aspect-[4/3]" : "aspect-[16/10]",
    titleSize: isCatalog ? "text-xl" : "text-2xl",
    descClamp: isCatalog ? "line-clamp-3" : "line-clamp-4",
    minHeight: isCatalog ? "min-h-[3.75rem]" : "min-h-[5rem]" 
  };

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    // 依據 Ticket 規範：不導外、不撥號，僅保留互動反饋
  };

  return (
    <div className="group flex flex-col h-full bg-card border border-olive_border rounded-2xl overflow-hidden transition-all duration-500 hover:border-olive_hint hover:shadow-md active:scale-[0.99]">
      
      {/* 1. Media (真圖優先 -> 中性 Placeholder) */}
      <div className={`relative ${styles.imageAspect} overflow-hidden`}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Placeholder 依照 Ticket U05.1 視覺規範：bg-surface/20 + border + icon */
          <div className="w-full h-full bg-surface/20 border border-olive_divider rounded-2xl flex flex-col items-center justify-center text-olive_hint">
            <ImageIcon size={32} strokeWidth={1.2} className="mb-2 opacity-50" />
            <span className="text-xs font-medium tracking-wide">尚無圖片</span>
          </div>
        )}
        
        {/* 2. Tag (膠囊) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-bg/90 backdrop-blur-sm border border-olive_border text-olive_muted text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm tracking-wider uppercase">
            {tag}
          </span>
        </div>
      </div>

      {/* 內容區塊 */}
      <div className={`flex flex-col flex-1 ${styles.container}`}>
        
        {/* 3. Title (必) */}
        <h3 className={`font-serif font-bold text-ink mb-2 tracking-wide line-clamp-2 ${styles.titleSize}`}>
          {title}
        </h3>

        {/* 4. Subtitle (可) - 若為空則不渲染，避免留白空間 */}
        {subtitle && (
          <p className="text-sm font-serif font-medium text-text/80 mb-3 leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        )}

        {/* 5. Description (可) - 密度受 variant 控制 */}
        <p className={`text-[13px] font-sans text-muted leading-relaxed mb-6 ${styles.descClamp} ${styles.minHeight}`}>
          {finalDescription}
        </p>

        {/* Theme 變體專有的敘事標註 */}
        {!isCatalog && (
          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-olive_hint tracking-wider">
            <span className="w-1 h-1 rounded-full bg-accent" />
            Curated Narrative
          </div>
        )}

        {/* 6. CTA 區 (必，成對) */}
        <div className="mt-auto flex gap-3 pt-5 border-t border-olive_divider">
          <Button 
            className="flex-1 text-[11px] py-2.5 gap-1.5"
            onClick={handleAction}
          >
            <Phone size={14} />
            品鑑作品
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 text-[11px] py-2.5 gap-1"
            onClick={handleAction}
          >
            合作邀約
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DishCardUnified;