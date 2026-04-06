import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../App';
import { useCart } from '../../context/CartContext';
// 1. Бул жерден Laptop, Baby сыяктуу аттарды өчүрдүк, анткени алар сенин компоненттериң менен чаташат
import { Search, Plus, Heart } from 'lucide-react';
import CategoryBar from '../../components/CategoryBar';

// 2. Секцияларды "Section" деген ат менен импорттоо (Alias колдонуу). 
// Бул TypeScript катасын (ts 2322) толук жоготот.
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
  const [activeCategory, setActiveCategory] = useState('All');
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { lang, translations, darkMode } = useContext(LanguageContext);
  const { addToCart, toggleFavorite, favorites } = useCart();
  const t = translations[lang];

  const handleAddToCart = async (item) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/auth'); return; }
    addToCart(item);
  };

  const handleToggleFavorite = async (item) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/auth'); return; }
    toggleFavorite(item);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('items').select('*');
      if (activeCategory !== 'All') query = query.eq('category', activeCategory);
      if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, searchTerm]);

  const ProductCard = ({ item }) => (
    <div className="group">
      <div className={`aspect-[4/5] mb-4 relative flex items-center justify-center p-4 overflow-hidden rounded-3xl transition-all ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        <button onClick={() => handleToggleFavorite(item)} className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors">
          <Heart className={`w-4 h-4 ${favorites?.some(f => f.id === item.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>
        <button onClick={() => handleAddToCart(item)} className="absolute bottom-4 right-4 bg-slate-900 text-white p-3 shadow-lg rounded-2xl active:scale-90 transition-transform">
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

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-md mx-auto pt-8 px-4">
        <div className={`flex items-center gap-3 border-b pb-2 px-2 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <Search className="text-slate-400 w-4 h-4" />
          <input 
            type="text" placeholder={t.search} className="flex-grow outline-none text-sm bg-transparent"
            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(inputValue)}
          />
        </div>
      </div>

      <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {activeCategory === 'All' && !searchTerm ? (
          <div className="space-y-12">
            {/* 3. Жаңы аттарды (Section) бул жерде колдонобуз */}
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
          <>
            <div className="mb-10 text-center md:text-left">
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{searchTerm ? 'Search Results' : 'Category'}</p>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">{searchTerm ? `"${searchTerm}"` : (t.categories[activeCategory.toLowerCase()] || activeCategory)}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
              {products.map((item) => <ProductCard key={item.id} item={item} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;