
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Theme } from '../types';

interface StickyNavProps {
  currentTheme: Theme;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const StickyNav: React.FC<StickyNavProps> = ({
  currentTheme,
  activeSection,
  onNavigate,
}) => {
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  return (
    <div 
      className="sticky z-30 h-fit"
      style={{ top: 'var(--tabsBottom, 112px)' }}
    >
      <div 
        className="bg-surface/10 backdrop-blur-[2px] border-l-[3px] border-accent rounded-r-2xl p-10 flex flex-col gap-10"
        style={{ marginTop: 'var(--safeGap, 40px)' }}
      >
        
        {/* Navigation Section */}
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h5 className="text-[15px] font-semibold text-text tracking-[0.3em] uppercase">
              主題索引
            </h5>
            <div className="w-10 h-[2px] bg-accent/40"></div>
          </div>
          
          <ul className="space-y-1 relative">
            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-olive_divider"></div>

            {/* Editor's Note */}
            <li className="relative">
              <button 
                onClick={() => onNavigate('editor-note')}
                className={`
                  group text-left transition-all duration-300 w-full py-2.5 pl-7 border-l-2 -ml-[1px] rounded-r-md ${focusRing}
                  ${activeSection === 'editor-note' 
                    ? 'text-text border-accent font-bold' 
                    : 'text-olive_hint hover:text-text border-transparent'
                  }
                `}
              >
                <span className="text-[14px] font-sans flex items-center gap-3 tracking-wide">
                  <span className={`text-[10px] font-mono transition-colors ${activeSection === 'editor-note' ? 'text-accent' : 'text-olive_disabled'}`}>
                    00
                  </span>
                  Editor's Note
                </span>
              </button>
            </li>

            {/* Dishes List */}
            {currentTheme.dishes.map((dish, index) => {
              const isActive = activeSection === `dish-${index}`;
              return (
                <li key={dish.id} className="relative">
                  <button 
                    onClick={() => onNavigate(`dish-${index}`)}
                    className={`
                      group text-left transition-all duration-300 w-full py-2.5 pl-7 border-l-2 -ml-[1px] rounded-r-md ${focusRing}
                      ${isActive 
                        ? 'text-text border-accent font-bold' 
                        : 'text-olive_hint hover:text-text border-transparent'
                      }
                    `}
                  >
                    <span className="text-[14px] font-sans flex items-center gap-3 tracking-wide">
                      <span className={`text-[10px] font-mono transition-colors ${isActive ? 'text-accent' : 'text-olive_disabled'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate max-w-[160px]">
                        {dish.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Action Section */}
        <div className="pt-8 border-t border-olive_divider space-y-6">
           <h5 className="text-[10px] font-bold uppercase tracking-[0.25em] text-olive_muted">
             Explore & Connect
           </h5>
           <ul className="space-y-4">
             <li>
               <Link to={`/themes/${currentTheme.id}`} className={`flex items-center justify-between text-[12px] text-text font-medium hover:text-accent transition-colors group rounded-md p-1 ${focusRing}`}>
                 <span>本主題全部作品</span>
                 <ExternalLink size={12} className="text-olive_hint group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
               </Link>
             </li>
             <li>
               <Link to="/catalog" className={`flex items-center justify-between text-[12px] text-text font-medium hover:text-accent transition-colors group rounded-md p-1 ${focusRing}`}>
                 <span>完整作品目錄</span>
                 <ExternalLink size={12} className="text-olive_hint group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
               </Link>
             </li>
           </ul>
        </div>

      </div>
    </div>
  );
};

export default StickyNav;