import React from 'react';

const KidsRoom = ({ products, ProductCard, setActiveCategory, t }) => {
  // Базадагы категориянын аты 'Kids Room' экенин текшер
  const items = products.filter(p => p.category === 'Kids Room').slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="mb-20 px-1">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
            Collection
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">
            {/* Тилге жараша "Детская" же "Kids Room" деп чыгат */}
            {t?.kidsRoom || "Kids Room"}
          </h2>
        </div>
       <button 
          onClick={() => setActiveCategory('Bathroom')} 
          className="text-indigo-600 text-[10px] font-bold uppercase border-b border-indigo-600 pb-1"
        >
          {t?.viewAll || "Бардыгы"} →
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => <ProductCard key={item.id} item={item} />)}
      </div>
    </section>
  );
};

export default KidsRoom;