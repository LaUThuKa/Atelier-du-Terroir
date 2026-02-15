import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "抱歉，找不到符合的結果",
  description = "請嘗試切換上方標籤，或調整排序再瀏覽。",
  primaryLabel = "回到上方篩選",
  onPrimary,
  secondaryLabel,
  onSecondary
}) => {
  return (
    <div className="max-w-[720px] mx-auto px-4 py-16 sm:py-24">
      <div className="rounded-2xl border border-olive_divider bg-surface/10 p-8 sm:p-12 text-center flex flex-col items-center">
        {/* 極簡內嵌 SVG Icon */}
        <div className="mb-6 text-olive_hint opacity-40">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>

        <h4 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          {title}
        </h4>
        
        <p className="mt-3 text-sm sm:text-base text-olive_muted leading-relaxed max-w-[320px] mx-auto">
          {description}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="primary" 
            onClick={onPrimary}
            className="px-8 py-3"
          >
            {primaryLabel}
          </Button>
          
          {secondaryLabel && onSecondary && (
            <Button 
              variant="ghost" 
              onClick={onSecondary}
              className="px-8 py-3"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;