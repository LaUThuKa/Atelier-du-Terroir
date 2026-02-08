import React from 'react';

interface NeutralHeroProps {
  title: string;
  subtitle: string;
}

const NeutralHero: React.FC<NeutralHeroProps> = ({ title, subtitle }) => {
  return (
    <section className="relative w-full h-[180px] lg:h-[280px] bg-ink overflow-hidden">
      <img 
        src="https://picsum.photos/seed/hero-bg/1920/600" 
        alt="Hero Background" 
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/20 to-ink/60"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-bg font-serif text-2xl lg:text-4xl font-bold mb-3 drop-shadow-md max-w-2xl leading-tight tracking-wide">
          {title}
        </h1>
        <p className="text-surface/90 font-sans text-xs lg:text-sm mb-4 tracking-[0.4em] uppercase font-medium">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default NeutralHero;