import React from 'react';
import { Timer, Star, Users, Wrench } from 'lucide-react';

const LivingRoom = ({ products, ProductCard, setActiveCategory, t }) => {
  const items = products.filter(p => p.category === 'Living Room').slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mb-20 px-1">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-indigo-600 text-[10px] font-black uppercase mb-1 tracking-widest">Collection</p>
          <h2 className="text-2xl font-black uppercase italic">{t?.living || "Living Room"}</h2>
        </div>
        <button onClick={() => setActiveCategory('Office')} className="text-[10px] font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-1">
          {t?.viewAll || "Бардыгы"} →
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {items.map(item => <ProductCard key={item.id} item={item} />)}
      </div>


    </section>
  );
};

export default LivingRoom;