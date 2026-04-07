import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import { LanguageContext } from '../../App';
import { useCart } from '../../context/CartContext';
import { Plus, Heart } from 'lucide-react';
import CategoryBar from '../../components/CategoryBar';

// Секцияларды импорттоо
import SofaSection from '../../components/sections/Sofa';
import KitchenSection from '../../components/sections/UtensilsCrossed ';
import BedroomSection from '../../components/sections/BedDouble';
import BathSection from '../../components/sections/Bath';
import KidsSection from '../../components/sections/Baby';
import HallwaySection from '../../components/sections/DoorOpen';
import OfficeSection from '../../components/sections/Laptop';
import GardenSection from '../../components/sections/TreePine';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // URL-ден маалымат алуу
  const categoryParam = searchParams.get('category') || 'All';
  const searchTerm = searchParams.get('search') || '';

  const { lang, translations, darkMode } = useContext(LanguageContext);
  const { addToCart, toggleFavorite, favorites } = useCart();
  const t = translations[lang];

  // Категорияны алмаштыруу
  const setActiveCategory = (category) => {
    if (category === 'All' || category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: category.toLowerCase() });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('items').select('*');
      
      if (categoryParam !== 'All') {
        query = query.ilike('category', categoryParam);
      }
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) console.error("Error fetching:", error);
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [categoryParam, searchTerm]);

  const ProductCard = ({ item }) => (
    <div className="group">
      <div className={`aspect-[4/5] mb-4 relative flex items-center justify-center p-4 overflow-hidden rounded-3xl transition-all ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        <button onClick={() => toggleFavorite(item)} className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full">
          <Heart className={`w-4 h-4 ${favorites?.some(f => f.id === item.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>
        <button onClick={() => addToCart(item)} className="absolute bottom-4 right-4 bg-slate-900 text-white p-3 shadow-lg rounded-2xl active:scale-90 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="px-1">
        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 mb-1">{item.category}</p>
        <h2 className="text-sm font-bold line-clamp-1">{item.name}</h2>
        <p className="text-sm font-black mt-1 text-indigo-600">{item.price} сом</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <CategoryBar activeCategory={categoryParam} setActiveCategory={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {categoryParam === 'All' && !searchTerm ? (
          <div className="space-y-16">
            <SofaSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <KitchenSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <BedroomSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <BathSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <KidsSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <HallwaySection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <OfficeSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
            <GardenSection products={products} ProductCard={ProductCard} setActiveCategory={setActiveCategory} t={t.categories} />
          </div>
        ) : (
          <div className="fade-in">
            <div className="mb-10 text-center md:text-left">
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                {searchTerm ? 'Жыйынтыктар' : 'Категория'}
              </p>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                {searchTerm ? `"${searchTerm}"` : (t.categories[categoryParam.toLowerCase()] || categoryParam)}
              </h2>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
                {products.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 opacity-50 italic">
                Товар табылган жок...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;