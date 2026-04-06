import React from 'react';

const Bedroom = ({ products, ProductCard, setActiveCategory, t }) => {
  // Категория аты Supabase'дегидей 'Bedroom' болушу керек
  const items = products.filter(p => p.category === 'Bedroom').slice(0, 4);
  
  if (items.length === 0) return null;

  return (
    <section className="mb-20 px-1">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-indigo-600 text-[10px] font-black uppercase mb-1 tracking-widest">
            Collection
          </p>
          <h2 className="text-2xl font-black uppercase italic">
            {/* ТҮЗӨТҮҮ: t?.bedroom деп жаз */}
            {t?.bedroom || "Bedroom"} 
          </h2>
        </div>
        <button 
          onClick={() => setActiveCategory('Bedroom')} 
          className="text-indigo-600 text-[10px] font-bold uppercase border-b border-indigo-600 pb-1"
        >
          {t?.viewAll || "Бардыгы"} →
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Bedroom;