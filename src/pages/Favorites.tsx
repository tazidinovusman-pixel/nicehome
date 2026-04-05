import React from 'react';
import { useCart } from '../context/CartContext';
import { HeartOff,Heart  } from 'lucide-react';


const Favorites = () => {
  const { favorites, toggleFavorite } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <HeartOff className="w-12 h-12 mb-4 opacity-20" />
        <p className="uppercase tracking-widest text-xs font-medium">Тизме бош</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-12 text-center">Избранное</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {favorites.map((item: any) => (
          <div key={item.id} className="group">
            <div className="aspect-[4/5] bg-[#F6F6F6] mb-4 relative flex items-center justify-center p-6">
              <img src={item.image_url} className="w-full h-full object-contain mix-blend-multiply" />
              <button 
                onClick={() => toggleFavorite(item)}
                className="absolute top-4 right-4 text-red-500"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
            <h2 className="text-sm font-medium text-slate-800">{item.name}</h2>
            <p className="text-sm font-bold text-slate-900">{item.price} сом</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;