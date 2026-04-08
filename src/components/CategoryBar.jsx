import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sofa, UtensilsCrossed, BedDouble, Bath, Baby, DoorOpen, Laptop, TreePine, LayoutGrid } from 'lucide-react';
import { LanguageContext } from '../App';

const categories = [
  { id: 'all', key: 'all', name: 'All', icon: <LayoutGrid size={20} /> },
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
  const navigate = useNavigate();
  const { lang, translations, darkMode } = useContext(LanguageContext);
  const t = translations[lang].categories;

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName); 
    if (categoryName === 'All') {
      navigate('/');
    } else {
      const urlFriendlyName = categoryName.replace(/\s+/g, '').toLowerCase();
      navigate(`/?category=${urlFriendlyName}`);
    }
  };

  return (
    /* БУЛ ЖЕРДЕГИ ӨЗГӨРТҮҮ: top-0 жана sticky */
    <div className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center gap-6 py-3 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center gap-1.5 min-w-fit transition-all active:scale-95 ${activeCategory === cat.name ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`p-2 rounded-xl transition-all ${activeCategory === cat.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : (darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600')}`}>
                {/* Иконкаларды бир аз кичирейттик, sticky болгондо орун аз алыш үчүн */}
                {React.cloneElement(cat.icon, { size: 18 })}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeCategory === cat.name ? 'text-indigo-600' : (darkMode ? 'text-slate-500' : 'text-slate-900')}`}>
                {t[cat.key]}
                
              </span>
            </button>
          ))}
          
        </div>
      </div>
      
    </div>
  );
};

export default CategoryBar;