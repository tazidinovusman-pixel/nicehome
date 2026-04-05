import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { Search, Plus, Heart } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(''); // Для текста в поле ввода
  const [searchTerm, setSearchTerm] = useState(''); // Для активации поиска
  const [loading, setLoading] = useState(true);
  
  const { addToCart, favorites, toggleFavorite } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('items').select('*');
      
      if (searchTerm) {
        // Ищем только те товары, название которых начинается на searchTerm
        query = query.ilike('name', `${searchTerm}%`);
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

  // Вызываем загрузку только когда меняется searchTerm (после кнопки)
  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-6 h-6 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Секция заголовка и поиска */}
        <div className="flex flex-col items-center mb-12 md:mb-20">
          <h1 className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 mb-6 font-bold text-center">
            NiceHome Collection
          </h1>
          
          <div className="flex items-center gap-3 w-full max-w-md border-b border-slate-100 focus-within:border-slate-900 transition-colors pb-2 px-2">
            <Search className="text-slate-300 w-4 h-4 shrink-0" />
            <input 
              type="text"
              placeholder="Издөө..."
              className="flex-grow outline-none text-xs md:text-sm placeholder:text-slate-300 bg-transparent min-w-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSearch}
              className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-slate-900 hover:text-indigo-600 transition-colors shrink-0"
            >
              Табуу
            </button>
          </div>
        </div>

        {/* Сетка товаров */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm font-light italic mb-4">Мындай товар табылган жок</p>
            <button 
                onClick={() => {setInputValue(''); setSearchTerm('');}} 
                className="text-[10px] uppercase tracking-widest font-bold underline text-slate-500 hover:text-slate-900"
            >
                Баарын көрсөтүү
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {products.map((item) => {
              const isFavorite = favorites?.some((fav: any) => fav.id === item.id);

              return (
                <div key={item.id} className="group">
                  {/* Контейнер карточки */}
                  <div className="aspect-[3/4] bg-[#F9F9F9] mb-4 md:mb-6 relative flex items-center justify-center p-6 md:p-10 overflow-hidden rounded-sm">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/400'} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" 
                    />
                    
                    {/* Кнопка Избранное */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      className="absolute top-4 right-4 z-10 p-1 transition-transform active:scale-90"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all ${
                          isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300 hover:text-slate-900'
                        }`} 
                      />
                    </button>

                    {/* Кнопка Плюс (Корзина) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="absolute bottom-4 right-4 z-10 bg-white text-slate-900 p-2.5 md:p-3 shadow-md rounded-full transition-all hover:bg-slate-900 hover:text-white active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Информация о товаре */}
                  <div className="text-center px-2">
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                      {item.category || 'Жалпы'}
                    </p>
                    <h2 className="text-xs md:text-sm font-medium text-slate-900 mb-1.5 line-clamp-1">
                      {item.name}
                    </h2>
                    <p className="text-sm font-bold text-slate-900">
                      {item.price} сом
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;