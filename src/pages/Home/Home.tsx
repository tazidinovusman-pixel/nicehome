import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { Search, Plus, Heart } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(''); // Для ввода текста
  const [searchTerm, setSearchTerm] = useState(''); // Для запуска поиска
  const [loading, setLoading] = useState(true);
  
  const { addToCart, favorites, toggleFavorite } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('items').select('*');
      
      if (searchTerm) {
        // Ищем товары, которые НАЧИНАЮТСЯ на введённые буквы
        // (убрали % в начале для точности)
        query = query.ilike('name', `${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Ката кетти:', error.message);
      } else {
        setProducts(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Запрос в базу только когда нажали кнопку поиска
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Секция поиска */}
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-6 font-bold">
            NiceHome Collection
          </h1>
          
          <div className="flex items-center gap-4 w-full max-w-md border-b border-slate-100 focus-within:border-slate-900 transition-colors pb-2">
            <Search className="text-slate-300 w-4 h-4" />
            <input 
              type="text"
              placeholder="Издөө..."
              className="flex-grow outline-none text-sm placeholder:text-slate-300 bg-transparent"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSearch}
              className="text-[10px] uppercase tracking-widest font-black text-slate-900 hover:text-indigo-600 transition-colors"
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
                className="text-[10px] uppercase tracking-widest font-bold underline text-slate-400 hover:text-slate-900"
            >
                Баарын көрсөтүү
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((item) => {
              const isFavorite = favorites?.some((fav: any) => fav.id === item.id);

              return (
                <div key={item.id} className="group">
                  {/* Изображение */}
                  <div className="aspect-[3/4] bg-[#F9F9F9] mb-6 relative flex items-center justify-center p-10 overflow-hidden">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/400'} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" 
                    />
                    
                    {/* Кнопка сердечко */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      className="absolute top-5 right-5 z-10"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all ${
                          isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300 hover:text-slate-900'
                        }`} 
                      />
                    </button>

                    {/* Кнопка в корзину (появляется при наведении) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <div className="bg-white text-slate-900 px-6 py-3 text-[10px] uppercase tracking-widest font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        Корзинага кош
                      </div>
                    </button>
                  </div>
                  
                  {/* Текст */}
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                      {item.category || 'Жалпы'}
                    </p>
                    <h2 className="text-sm font-medium text-slate-900 mb-2">
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