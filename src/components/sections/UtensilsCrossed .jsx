import React from 'react';

const Kitchen = ({ products, ProductCard, setActiveCategory, t }) => {
  // 1. Фильтрлөө (Категория аты Supabase менен бирдей болушу керек)
  const items = products.filter(p => p.category === 'Kitchen').slice(0, 4);
  
  // 2. Эгер товар жок болсо, секция көрүнбөйт
  if (items.length === 0) return null;

  return (
    <section className="mb-20 px-1">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Collection
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">
            {t?.kitchen || "Kitchen"}
          </h2>
        </div>
        
        <button 
          onClick={() => setActiveCategory('Kitchen')} 
          className="text-[10px] font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-1 tracking-widest hover:text-indigo-500 transition-colors"
        >
          {t?.viewAll || "Бардыгы"} →
        </button>
      </div>

      {/* 3. Товарлардын тизмеси (Сетка) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Kitchen;