import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sofa, UtensilsCrossed, BedDouble, Bath, Baby, DoorOpen, Laptop, TreePine, Menu, X } from 'lucide-react';
import { LanguageContext } from '../App';

// 1. МАССИВ СӨЗСҮЗ КОМПОНЕНТТИН СЫРТЫНДА ТУРУШУ КЕРЕК
const categories = [
  { id: 'all', key: 'all', name: 'All', icon: null },
  { id: 'living', key: 'living', name: 'Living Room', icon: <Sofa size={20} /> },
  { id: 'kitchen', key: 'kitchen', name: 'Kitchen', icon: <UtensilsCrossed size={20} /> },
  { id: 'bedroom', key: 'bedroom', name: 'Bedroom', icon: <BedDouble size={20} /> },
  { id: 'bathroom', key: 'bathroom', name: 'Bathroom', icon: <Bath size={20} /> },
  { id: 'kids', key: 'kids', name: 'Kids Room', icon: <Baby size={20} /> },
  { id: 'hallway', key: 'hallway', name: 'Hallway', icon: <DoorOpen size={20} /> },
  { id: 'office', key: 'office', name: 'Office', icon: <Laptop size={20} /> },
  { id: 'garden', key: 'garden', name: 'Garden', icon: <TreePine size={20} /> },
];

const CategoryBar = ({ activeCategory, setActiveCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, translations, darkMode } = useContext(LanguageContext);
  const t = translations[lang].categories;

  // Категорияны басканда иштөөчү функция
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName); 
    
    // URL-ди тазалоо (боштуктарды өчүрүү жана кичине тамгага келтирүү)
    if (categoryName === 'All') {
      navigate('/');
    } else {
      const urlFriendlyName = categoryName.replace(/\s+/g, '').toLowerCase();
      navigate(`/?category=${urlFriendlyName}`);
    }
    
    setIsOpen(false); 
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className={`p-3 rounded-2xl shadow-lg border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* DESKTOP VERSION */}
      <div className={`hidden md:block w-full border-b transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-50'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 py-4 px-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center gap-1 group transition-all ${activeCategory === cat.name ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
            >
              <span className={activeCategory === cat.name ? 'text-indigo-500' : (darkMode ? 'text-white' : 'text-slate-900')}>
                {cat.icon}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                {t[cat.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className={`relative w-[280px] h-full shadow-2xl p-6 flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-10">
              <span className={`font-black text-[10px] uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Категориялар</span>
              <button onClick={() => setIsOpen(false)} className={darkMode ? 'text-white' : 'text-slate-900'}><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeCategory === cat.name ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600')}`}
                >
                  {cat.icon}
                  <span className="text-[11px] font-bold uppercase tracking-wider">{t[cat.key]}</span>
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