import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import { LanguageContext } from '../../App';
import { useCart } from '../../context/CartContext';
import { Plus, Heart, Timer, Star, Users, Wrench, Phone, MessageCircle } from 'lucide-react';
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

// --- КӨП МААЛЫМАТТУУ ЖАНА ДИЗАЙНДУУ БАННЕР ---
const ServiceBanner = ({ serviceName, lang, variant = 1 }) => {
  const contacts = ["+996 (700) 11-22-33", "+996 (555) 00-99-88", "+996 (999) 77-66-55"];
  const randomPhone = contacts[variant % contacts.length];

  const variants = {
    1: "bg-indigo-600 shadow-indigo-500/50",
    2: "bg-emerald-600 shadow-emerald-500/50",
    3: "bg-rose-600 shadow-rose-500/50",
    4: "bg-sky-600 shadow-sky-500/50",
    5: "bg-amber-500 shadow-amber-500/50",
    6: "bg-slate-700 shadow-slate-500/50",
    7: "bg-violet-600 shadow-violet-500/50",
    8: "bg-lime-600 shadow-lime-500/50",
  };

  return (
    <div className={`w-full mt-20 p-10 rounded-[3rem] ${variants[variant] || variants[1]} text-white relative overflow-hidden shadow-2xl transition-all hover:-translate-y-1`}>
      <div className="absolute -bottom-10 -left-10 text-[10rem] font-black opacity-10 select-none italic leading-none">SERVICE</div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="max-w-md text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold uppercase mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" /> Бош адис
          </div>
          <h2 className="text-4xl font-black uppercase italic mb-2">{serviceName}</h2>
          <p className="opacity-80 text-sm mb-6">Биздин кесипкөй адистер сиздин үйүңүздү иретке келтирүүгө жардам берет. Сапат кепилдиги 100%!</p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-lg flex items-center gap-3">
              <Phone size={20} /> {randomPhone}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
            <p className="text-2xl font-black">20</p>
            <p className="text-[10px] uppercase opacity-60 font-bold tracking-tighter">мүнөттө жетет</p>
          </div>
          <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
            <p className="text-2xl font-black">1000+</p>
            <p className="text-[10px] uppercase opacity-60 font-bold tracking-tighter">кардарлар</p>
          </div>
          <div className="p-4 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 text-center col-span-2">
            <div className="flex justify-center gap-1 text-yellow-400 mb-1">
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p className="text-sm font-bold italic">4.9 Орточо рейтинг</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || 'All';
  const searchTerm = searchParams.get('search') || '';

  const { lang, translations, darkMode, user } = useContext(LanguageContext);
  const { addToCart, toggleFavorite, favorites } = useCart();
  const t = translations[lang];

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
      if (categoryParam !== 'All') query = query.ilike('category', categoryParam);
      if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
      const { data, error } = await query;
      if (error) console.error("Error fetching:", error);
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [categoryParam, searchTerm]);

 const ProductCard = ({ item }) => (
    <div className="group">
      {/* Сүрөт бөлүгү - басканда жеке баракка өтөт */}
      <div 
        onClick={() => navigate(`/product/${item.id}`)} 
        className={`aspect-[4/5] mb-4 relative flex items-center justify-center p-4 overflow-hidden rounded-3xl transition-all cursor-pointer shadow-sm hover:shadow-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50'}`}
      >
        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
        
        {/* "ЖАҢЫ" белгиси - эгер базада is_new true болсо гана чыгат */}
        {item.is_new && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">
            New
          </div>
        )}

        {/* Favorite баскычы - бул баракка өткөрбөйт (e.stopPropagation) */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Баракка өтүп кетпеши үчүн
            !user ? navigate('/auth') : toggleFavorite(item);
          }} 
          className="absolute top-4 right-4 p-2 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 ${favorites?.some(f => f.id === item.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>

        {/* Себетке кошуу баскычы */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Баракка өтүп кетпеши үчүн
            !user ? navigate('/auth') : addToCart(item);
          }} 
          className="absolute bottom-4 right-4 bg-slate-900 text-white p-3 shadow-lg rounded-2xl active:scale-90 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Төмөнкү текст бөлүгү - басканда жеке баракка өтөт */}
      <div className="px-1 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 mb-1">{item.category}</p>
        <h2 className="text-sm font-bold line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.name}</h2>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-black text-indigo-600">{item.price} сом</p>
          {/* Бул жерде жылды көрсөтүп койсоңуз болот (милдеттүү эмес) */}
          <p className="text-[9px] text-slate-400 font-bold">{item.year}</p>
        </div>
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
          /* --- БАШКЫ БЕТТЕ БАННЕРЛЕР ЖОК --- */
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
          /* --- ИЗДӨӨ ЖЕ КАТЕГОРИЯ ТАНДАЛГАНДА БАННЕР МЕНЕН ЧЫГАТ --- */
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
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
                  {products.map((item) => <ProductCard key={item.id} item={item} />)}
                </div>

                {/* ЧОҢ ЖАНА КӨП МААЛЫМАТТУУ БАННЕР */}
                <ServiceBanner 
                  lang={lang}
                  serviceName={
                    searchTerm ? "Универсал уста" 
                    : categoryParam.toLowerCase() === 'kitchen' ? "Сантехник / Ашкана устасы"
                    : categoryParam.toLowerCase() === 'bedroom' ? "Эмерек жыйноочу адис"
                    : categoryParam.toLowerCase() === 'bathroom' ? "Кесипкөй сантехник"
                    : categoryParam.toLowerCase() === 'kids' ? "Балдар эмерек устасы"
                    : categoryParam.toLowerCase() === 'hallway' ? "Шкаф жана эшик устасы"
                    : categoryParam.toLowerCase() === 'office' ? "IT / Электрик адиси"
                    : categoryParam.toLowerCase() === 'garden' ? "Ландшафт дизайнери"
                    : "Үй адиси"
                  }
                  variant={
                    categoryParam.toLowerCase() === 'kitchen' ? 2
                    : categoryParam.toLowerCase() === 'bedroom' ? 3
                    : categoryParam.toLowerCase() === 'bathroom' ? 4
                    : categoryParam.toLowerCase() === 'kids' ? 5
                    : categoryParam.toLowerCase() === 'hallway' ? 6
                    : categoryParam.toLowerCase() === 'office' ? 7
                    : categoryParam.toLowerCase() === 'garden' ? 8
                    : 1
                  }
                />
              </>
            ) : (
              <div className="text-center py-20 opacity-50 italic">Товар табылган жок...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;