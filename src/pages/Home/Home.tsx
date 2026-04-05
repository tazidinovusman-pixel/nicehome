import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../api/supabaseClient';
import { Search, Plus, Heart } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';
import CategoryBar from '../../components/CategoryBar'; 
import { useNavigate } from 'react-router-dom'; // Жаңы кошулду
import { LanguageContext } from '../../App'; // Жаңы кошулду

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // Инициализация
  const { addToCart, favorites, toggleFavorite } = useCart();
  const { user, darkMode, lang, translations } = useContext(LanguageContext); // App'тен маалыматтарды алуу
  const t = translations[lang];

  // --- ЖАҢЫ ЛОГИКА (Катталбагандарды текшерүү) ---
  const handleAddToCart = (item: any) => {
    if (!user) {
      navigate('/auth'); // Эгер кирбесе, логин барагына айдайт
      return;
    }
    addToCart(item);
  };

  const handleToggleFavorite = (item: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleFavorite(item);
  };
  // ---------------------------------------------

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('items').select('*');
      if (searchTerm) query = query.ilike('name', `${searchTerm}%`);
      if (activeCategory !== 'All') query = query.eq('category', activeCategory);

      const { data, error } = await query;
      if (error) console.error('Error:', error.message);
      else setProducts(data || []);
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

  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="w-6 h-6 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      
      {/* ПОИСК */}
      <div className={`w-full pt-8 pb-4 px-4 sticky top-0 md:relative z-30 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className={`max-w-md mx-auto flex items-center gap-3 border-b transition-colors pb-2 px-2 ${darkMode ? 'border-slate-800 focus-within:border-white' : 'border-slate-100 focus-within:border-slate-900'}`}>
          <Search className="text-slate-300 w-4 h-4 shrink-0" />
          <input 
            type="text"
            placeholder={t.search}
            className={`flex-grow outline-none text-sm bg-transparent ${darkMode ? 'text-white' : 'text-slate-900'}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="text-[10px] font-black uppercase tracking-widest">
             {lang === 'KG' ? 'Табуу' : lang === 'RU' ? 'Найти' : 'Find'}
          </button>
        </div>
      </div>

      <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20 italic text-slate-400">Табылган жок...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {products.map((item) => (
              <div key={item.id} className="group">
                <div className={`aspect-[4/5] mb-4 relative flex items-center justify-center p-4 overflow-hidden rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-[#F9F9F9]'}`}>
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Сүйүктүүлөр баскычы */}
                  <button onClick={() => handleToggleFavorite(item)} className="absolute top-3 right-3 p-1">
                    <Heart className={`w-4 h-4 ${favorites?.some(f => f.id === item.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                  </button>

                  {/* Корзинага кошуу баскычы */}
                  <button onClick={() => handleAddToCart(item)} className="absolute bottom-3 right-3 bg-white p-2.5 shadow-sm rounded-full active:scale-90 transition-transform">
                    <Plus className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
                
                <div className="px-1">
                  <p className="text-[7px] uppercase tracking-widest text-slate-400 mb-1">{item.category}</p>
                  <h2 className={`text-[11px] md:text-sm font-medium line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h2>
                  <p className={`text-xs font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.price} сом</p>
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