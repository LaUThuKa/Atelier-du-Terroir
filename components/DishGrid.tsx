import React from 'react';

interface DishGridProps {
  children: React.ReactNode;
}

const DishGrid: React.FC<DishGridProps> = ({ children }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {children}
      </div>
    </div>
  );
};

export default DishGrid;