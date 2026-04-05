import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { Search, Plus, Heart } from 'lucide-react'; // Добавили Heart
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Достаем всё необходимое из контекста
  const { addToCart, favorites, toggleFavorite } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('items').select('*');
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (error) console.error('Ошибка:', error.message);
      else setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Заголовок и поиск */}
        <div className="flex flex-col items-center mb-20">
          <h1 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-medium">
            Recent Products
          </h1>
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input 
              type="text"
              placeholder="Издөө..."
              className="w-full pl-8 pr-4 py-2 border-b border-slate-100 focus:border-slate-400 outline-none transition-colors text-sm placeholder:text-slate-300 bg-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Сетка товаров */}
        {products.length === 0 ? (
          <p className="text-center text-slate-400 font-light italic">Азырынча товар жок...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((item) => {
              // Проверяем, находится ли этот конкретный товар в избранном
              const isFavorite = favorites?.some((fav: any) => fav.id === item.id);

              return (
                <div key={item.id} className="group cursor-pointer">
                  {/* Контейнер фото */}
                  <div className="aspect-[4/5] overflow-hidden bg-[#F6F6F6] mb-6 relative flex items-center justify-center p-8 transition-colors group-hover:bg-[#F0F0F0]">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/300'} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Кнопка ИЗБРАННОЕ (Сердечко) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      className="absolute top-4 right-4 p-2 transition-transform active:scale-90"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300 hover:text-slate-400'
                        }`} 
                      />
                    </button>

                    {/* Кнопка КОРЗИНА (Плюс) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="absolute bottom-4 right-4 bg-white text-slate-900 p-3 rounded-full shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Описание товара */}
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                      {item.category || 'Collection'}
                    </p>
                    <h2 className="text-sm font-medium text-slate-800 leading-tight">
                      {item.name}
                    </h2>
                    <p className="text-sm font-bold text-slate-900 pt-1">
                      {item.price} <span className="text-[10px] font-normal text-slate-400 ml-0.5">сом</span>
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