import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { Search, Plus, Heart } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';
// Категориялар компонентин импорттойбуз
import CategoryBar from '../../components/CategoryBar'; 

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeCategory, setActiveCategory] = useState('All'); // Тандалган категория
  const [loading, setLoading] = useState(true);
  
  const { addToCart, favorites, toggleFavorite } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('items').select('*');
      
      // 1. Поиск боюнча фильтр
      if (searchTerm) {
        query = query.ilike('name', `${searchTerm}%`);
      }

      // 2. Категория боюнча фильтр (Эгер "All" эмес болсо)
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
  }, [searchTerm, activeCategory]); // activeCategory өзгөргөндө кайра жүктөлөт

  const handleSearch = () => {
    setSearchTerm(inputValue);
    setActiveCategory('All'); // Поиск кылганда категорияны баштапкы абалга келтирет
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-6 h-6 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. ПОИСК ЭМИ ЭҢ ЖОГОРУДА */}
      <div className="w-full bg-white pt-8 pb-4 px-4 sticky top-0 md:relative z-30">
        <div className="max-w-md mx-auto flex items-center gap-3 border-b border-slate-100 focus-within:border-slate-900 transition-colors pb-2 px-2">
          <Search className="text-slate-300 w-4 h-4 shrink-0" />
          <input 
            type="text"
            placeholder="Эмерек издөө..."
            className="flex-grow outline-none text-sm placeholder:text-slate-300 bg-transparent"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch} className="text-[10px] font-black uppercase tracking-widest">Табуу</button>
        </div>
      </div>

      {/* 2. КАТЕГОРИЯЛАР (Компьютерде поисктун астында, телефондо бургерде) */}
      <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* АКТИВДҮҮ КАТЕГОРИЯНЫН АТЫ */}
        <div className="mb-10 flex flex-col items-center">
             <h1 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">
               {activeCategory === 'All' ? 'NiceHome Collection' : activeCategory}
             </h1>
             <div className="w-8 h-[1px] bg-slate-200 mt-4"></div>
        </div>

        {/* ТОВАРЛАР ТИЗМЕСИ (Адаптацияланган сетка) */}
        {products.length === 0 ? (
          <div className="text-center py-20 italic text-slate-400">Товар табылган жок...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {products.map((item) => (
              <div key={item.id} className="group">
                {/* Карточканын дизайны мурункудай, бирок телефонго ыңгайлуу */}
                <div className="aspect-[4/5] bg-[#F9F9F9] mb-4 relative flex items-center justify-center p-4 overflow-hidden rounded-2xl">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Кнопкалар телефондо ар дайым көрүнүп турганы жакшы */}
                  <button onClick={() => toggleFavorite(item)} className="absolute top-3 right-3 p-1">
                    <Heart className={`w-4 h-4 ${favorites?.some(f => f.id === item.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                  </button>
                  <button onClick={() => addToCart(item)} className="absolute bottom-3 right-3 bg-white p-2.5 shadow-sm rounded-full active:scale-90 transition-transform">
                    <Plus className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
                
                <div className="px-1">
                  <p className="text-[7px] uppercase tracking-widest text-slate-400 mb-1">{item.category}</p>
                  <h2 className="text-[11px] md:text-sm font-medium text-slate-900 line-clamp-1">{item.name}</h2>
                  <p className="text-xs font-bold text-slate-900 mt-1">{item.price} сом</p>
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