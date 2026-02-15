import React from 'react';

interface NeutralHeroProps {
  title: string;
  subtitle: string;
  hint?: string;
  imageSeed?: number;
}

const NeutralHero: React.FC<NeutralHeroProps> = ({ title, subtitle, hint, imageSeed }) => {
  return (
    <section className="relative w-full bg-bg pt-12 lg:pt-16 pb-6 min-h-[200px] sm:min-h-[220px] lg:min-h-[260px] flex items-center border-b border-olive_divider overflow-hidden">
      {/* 背景圖策略：柔化處理，確保文字可讀性 */}
      {imageSeed && (
        <div className="absolute inset-0 z-0">
          <img 
            src={`https://picsum.photos/seed/${imageSeed}/1920/600`} 
            alt="" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/0 via-bg/40 to-bg"></div>
        </div>
      )}

      {/* 內容容器 */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 w-full text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-ink leading-tight">
          {title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-olive_muted leading-relaxed max-w-[70ch] mx-auto">
          {subtitle}
        </p>
        {hint && (
          <p className="mt-2 text-sm text-olive_hint italic">
            {hint}
          </p>
        )}
      </div>
    </section>
  );
};

export default NeutralHero;