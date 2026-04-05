import React, { useState } from 'react';
import { Sofa, UtensilsCrossed, BedDouble, Bath, Baby, DoorOpen, Laptop, TreePine, Menu, X } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', kg: 'Баары', icon: null },
  { id: 'living', name: 'Living Room', kg: 'Конок бөлмө', icon: <Sofa size={20} /> },
  { id: 'kitchen', name: 'Kitchen', kg: 'Ашкана', icon: <UtensilsCrossed size={20} /> },
  { id: 'bedroom', name: 'Bedroom', kg: 'Уктоочу бөлмө', icon: <BedDouble size={20} /> },
  { id: 'bathroom', name: 'Bathroom', kg: 'Ванна жана даараткана', icon: <Bath size={20} /> },
  { id: 'kids', name: 'Kids Room', kg: 'Балдар бөлмөсү', icon: <Baby size={20} /> },
  { id: 'hallway', name: 'Hallway', kg: 'Кире бериш', icon: <DoorOpen size={20} /> },
  { id: 'office', name: 'Office', kg: 'Иш бөлмө', icon: <Laptop size={20} /> },
  { id: 'garden', name: 'Garden', kg: 'Бакча', icon: <TreePine size={20} /> },
];

const CategoryBar = ({ activeCategory, setActiveCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
     {/* МОБИЛДИК БУРГЕР БАСКЫЧЫ (Эми өйдө жактагы сол бурчта) */}
<div className="md:hidden fixed top-5 left-5 z-[60]">
  <button 
    onClick={() => setIsOpen(true)}
    className="bg-white/80 backdrop-blur-md text-slate-900 p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-95 transition-all"
  >
    <Menu size={20} />
  </button>
</div>
      {/* КОМПЬЮТЕРДЕГИ ВЕРСИЯ (Ошол эле бойдон калат) */}
      <div className="hidden md:block w-full bg-white border-b border-slate-50 sticky top-[65px] z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 py-4 px-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-1 group transition-all ${activeCategory === cat.name ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
            >
              <span className={`text-slate-900 ${activeCategory === cat.name ? 'text-indigo-600' : ''}`}>{cat.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* МОБИЛДИК КАПТАЛ МЕНЮ (Side Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Фонду караңгылатуу */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-[280px] bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="font-black text-xs uppercase tracking-widest">Категориялар</span>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.name); setIsOpen(false); }}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeCategory === cat.name ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}
                >
                  {cat.icon}
                  <div className="text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wider leading-none">{cat.name}</p>
                    <p className={`text-[9px] mt-1 ${activeCategory === cat.name ? 'text-slate-400' : 'text-slate-400'}`}>{cat.kg}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryBar;