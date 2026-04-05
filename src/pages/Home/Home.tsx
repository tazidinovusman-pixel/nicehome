import React, { useEffect, useState, useContext } from 'react'; // useContext кошулду
import { supabase } from '../../api/supabaseClient';
import { Search, Plus, Heart } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';
import CategoryBar from '../../components/CategoryBar'; 
import { LanguageContext } from '../../App'; // App'тен контекстти импорттойбуз

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [loading, setLoading] = useState(true);
  
  // Контексттен тилди жана теманы алабыз
  const { lang, translations, darkMode } = useContext(LanguageContext);
  const t = translations[lang]; // Учурдагы тилдеги тексттер

  const { addToCart, favorites, toggleFavorite } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('items').select('*');
      
      if (searchTerm) {
        query = query.ilike('name', `${searchTerm}%`);
      }

      if (activeCategory !== 'All') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Ошибка загрузки:', error.message);
      } else {
        setProducts(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, activeCategory]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
    setActiveCategory('All'); 
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className={`w-6 h-6 border-2 rounded-full animate-spin ${darkMode ? 'border-slate-800 border-t-white' : 'border-slate-100 border-t-slate-900'}`}></div>
    </div>
  );

  return (
    // dark:bg-slate-950 кошулду
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      
      {/* 1. ПОИСК (Dark mode колдоосу менен) */}
      <div className={`w-full pt-8 pb-4 px-4 sticky top-0 md:relative z-30 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className={`max-w-md mx-auto flex items-center gap-3 border-b transition-colors pb-2 px-2 ${darkMode ? 'border-slate-800 focus-within:border-white' : 'border-slate-100 focus-within:border-slate-900'}`}>
          <Search className="text-slate-300 w-4 h-4 shrink-0" />
          <input 
            type="text"
            placeholder={t.search} // Тилге жараша өзгөрөт
            className={`flex-grow outline-none text-sm bg-transparent ${darkMode ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-300'}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSearch} 
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-white hover:text-indigo-400' : 'text-slate-900 hover:text-indigo-600'}`}
          >
            {t.find || (lang === 'KG' ? 'Табуу' : lang === 'RU' ? 'Найти' : 'Find')}
          </button>
        </div>
      </div>

      <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-10 flex flex-col items-center">
             <h1 className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
               {activeCategory === 'All' ? 'NiceHome Collection' : activeCategory}
             </h1>
             <div className={`w-8 h-[1px] mt-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 italic text-slate-400">
            {lang === 'KG' ? 'Товар табылган жок...' : lang === 'RU' ? 'Товар не найден...' : 'No products found...'}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {products.map((item) => (
              <div key={item.id} className="group">
                {/* КАРТОЧКА (Dark mode стили) */}
                <div className={`aspect-[4/5] mb-4 relative flex items-center justify-center p-4 overflow-hidden rounded-2xl transition-colors ${darkMode ? 'bg-slate-900/50' : 'bg-[#F9F9F9]'}`}>
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700" />
                  
                  <button onClick={() => toggleFavorite(item)} className="absolute top-3 right-3 p-1">
                    <Heart className={`w-4 h-4 transition-all ${favorites?.some(f => f.id === item.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                  </button>
                  <button 
                    onClick={() => addToCart(item)} 
                    className={`absolute bottom-3 right-3 p-2.5 shadow-sm rounded-full active:scale-90 transition-all ${darkMode ? 'bg-white text-slate-950 hover:bg-indigo-400' : 'bg-white text-slate-900 hover:bg-slate-900 hover:text-white'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="px-1 text-center">
                  <p className="text-[7px] uppercase tracking-widest text-slate-400 mb-1">{item.category}</p>
                  <h2 className={`text-[11px] md:text-sm font-medium line-clamp-1 transition-colors ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.name}</h2>
                  <p className={`text-xs font-bold mt-1 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.price} сом</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;