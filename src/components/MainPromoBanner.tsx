import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../api/supabaseClient';
import { useCart } from '../context/CartContext'; // 🔥 Сиздин бирдиктүү контекст
import { ArrowUpRight, ChevronLeft, ChevronRight, X, ShoppingCart, Heart } from 'lucide-react';

export default function MainPromoBanner() {
  const [banners, setBanners] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  // МОДАЛДЫК ТЕРЕЗЕНИ БАШКАРУУ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);

  // 🔥 Сиздин контексттен Себетке кошуу (addToCart) жана Избранноего кошуу (toggleFavorite) функцияларын алабыз
  // Ошондой эле товар мурун кошулганбы же жокпу текшериш үчүн 'favorites' тизмесин да алабыз
  const { addToCart, toggleFavorite, favorites } = useCart(); 

  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBanners(data);
        
        const imagesAccumulator = [];
        data.forEach(banner => {
          if (banner.image_url1) imagesAccumulator.push({ url: banner.image_url1, title: banner.title, desc: banner.description, item: banner });
          if (banner.image_url2) imagesAccumulator.push({ url: banner.image_url2, title: banner.title, desc: banner.description, item: banner });
          if (banner.image_url3) imagesAccumulator.push({ url: banner.image_url3, title: banner.title, desc: banner.description, item: banner });
          if (banner.image_url4) imagesAccumulator.push({ url: banner.image_url4, title: banner.title, desc: banner.description, item: banner });
        });
        
        setAllImages(imagesAccumulator);
      }
      setLoading(false);
    };
    fetchBanners();
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (allImages.length <= 1 || isModalOpen) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 3500);

    return () => resetTimeout();
  }, [currentImgIndex, allImages, isModalOpen]);

  if (loading || allImages.length === 0) return null;

  const currentSlide = allImages[currentImgIndex];

  const nextSlide = (e) => {
    e.stopPropagation();
    resetTimeout();
    setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    resetTimeout();
    setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openPromoModal = () => {
    setSelectedSlide(currentSlide);
    setIsModalOpen(true);
  };

  // 🔥 СЕБЕТКЕ (КОРЗИНА) СИЗДИН КОНТЕКСТ АРКЫЛУУ КОШУУ
  const handleAddToCart = (e, slide) => {
    e.stopPropagation();
    
    const productToCart = {
      id: slide.item.id || String(Date.now()), 
      name: slide.title, 
      price: Number(slide.item.price) || 0, 
      image_url: slide.url,
      quantity: 1
    };

    if (typeof addToCart === 'function') {
      addToCart(productToCart); 
      alert(`"${slide.title}" себетке кошулду!`);
    } else {
      alert("Ката: Сиздин useCart() ичинде addToCart функциясы табылган жок.");
    }
  };

  // 🔥 ИЗБРАННОЕГО СИЗДИН КОНТЕКСТ (toggleFavorite) АРКЫЛУУ КОШУУ
  const handleAddToFavorites = (e, slide) => {
    e.stopPropagation();
    
    const productToFav = {
      id: slide.item.id || String(Date.now()),
      name: slide.title, // Favorites.tsx файлыңыздагы item.name ушул жерден окулат
      price: Number(slide.item.price) || 0,
      image_url: slide.url
    };

    if (typeof toggleFavorite === 'function') {
      // Сиздин контексттеги toggleFavorite функциясын чакырабыз
      toggleFavorite(productToFav);
      
      // Товар мурун тизмеде бар беле же жокпу текшерип, билдирүү чыгарабыз
      const isAlreadyFav = favorites?.some(item => item.id === productToFav.id);
      if (isAlreadyFav) {
        alert(`"${slide.title}" тандалгандардан өчүрүлдү.`);
      } else {
        alert(`"${slide.title}" тандалгандарга кошулду!`);
      }
    } else {
      alert("Ката: Сиздин useCart() ичинде toggleFavorite функциясы табылган жок.");
    }
  };

  // Учурдагы товар Избранное тизмесинде бар же жогун текшерүү (жүрөкчөнүн өңүн өзгөртүү үчүн)
  const isCurrentItemFavorite = favorites?.some(item => item.id === selectedSlide?.item?.id);

  return (
   <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-6">
      {/* БАННЕР КОРПУСУ */}
      <div 
        onClick={openPromoModal}
        className="relative w-full rounded-[2rem] overflow-hidden bg-slate-900 text-white flex flex-col md:flex-row md:items-center shadow-xl group/banner transition-all duration-500 min-h-[300px] md:min-h-[340px] cursor-pointer hover:shadow-2xl"
      >
        {/* СҮРӨТТӨР (КОМПЬЮТЕР) */}
        <div className="absolute inset-0 w-full h-full hidden md:block">
          {allImages.map((slide, idx) => (
            <img 
              key={idx}
              src={slide.url} 
              alt={slide.title} 
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${idx === currentImgIndex ? 'opacity-85' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        {/* СҮРӨТТӨР (ТЕЛЕФОН) */}
        <div className="relative w-full h-[180px] sm:h-[220px] block md:hidden bg-slate-950">
          {allImages.map((slide, idx) => (
            <img 
              key={idx}
              src={slide.url} 
              alt={slide.title} 
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${idx === currentImgIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* ТЕКСТТЕР */}
        <div className="relative z-10 w-full md:max-w-xl p-6 sm:p-10 md:p-16 flex flex-col items-start gap-3 bg-slate-900 md:bg-transparent -mt-2 md:mt-0 rounded-t-[1.5rem] md:rounded-none">
          <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
            АКЦИЯ / РЕКЛАМА
          </span>
          
          <h2 className="text-xl sm:text-2xl md:text-5xl font-black uppercase italic tracking-tight leading-tight drop-shadow-md text-white">
            {currentSlide.title}
          </h2>
          
          {currentSlide.desc && (
            <p className="text-xs sm:text-sm md:text-base text-slate-300 md:text-slate-200/90 font-medium line-clamp-3 md:line-clamp-2 max-w-md">
              {currentSlide.desc}
            </p>
          )}

          {/* 🔥 БУЛ ЖЕРДЕ БААСЫ БАННЕРДИН ӨЗҮНДӨ ДА КӨРҮНӨТ */}
          {currentSlide.item.price && (
            <p className="text-lg md:text-2xl font-black text-amber-400 mt-1">
              {currentSlide.item.price} сом
            </p>
          )}

          {/* "Толук маалымат" баскычына да openPromoModal функциясын байладык */}
          <button 
            onClick={(e) => { e.stopPropagation(); openPromoModal(); }}
            className="mt-2 flex items-center gap-1.5 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 shadow-lg w-full sm:w-auto justify-center"
          >
            Толук маалымат <ArrowUpRight size={14} />
          </button>
        </div>

        {/* СТРЕЛКАЛАР */}
        {allImages.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-3 top-[75px] sm:top-[95px] md:top-1/2 md:-translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-indigo-600 text-white backdrop-blur-xs md:opacity-0 group-hover/banner:opacity-100 transition-all duration-300">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextSlide} className="absolute right-3 top-[75px] sm:top-[95px] md:top-1/2 md:-translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-indigo-600 text-white backdrop-blur-xs md:opacity-0 group-hover/banner:opacity-100 transition-all duration-300">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* ЧЕКИTТЕР */}
        {allImages.length > 1 && (
          <div className="absolute top-[160px] sm:top-[200px] md:top-auto md:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5">
            {allImages.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-5 bg-indigo-500' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      {/* 🔥 МОДАЛДЫК ТЕРЕЗЕ (БААСЫ МЕНЕН ОҢДОЛДУ) */}
      {isModalOpen && selectedSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-white text-slate-900 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 z-30 p-2 rounded-full bg-black/50 md:bg-slate-100 text-white md:text-slate-700 hover:bg-red-500 hover:text-white transition-all shadow-md"
            >
              <X size={18} />
            </button>

            <div className="w-full md:w-1/2 h-[220px] sm:h-[260px] md:h-[380px] relative bg-slate-100 flex-shrink-0">
              <img src={selectedSlide.url} alt={selectedSlide.title} className="w-full h-full object-cover object-center" />
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between gap-6 bg-white">
              <div className="space-y-3">
                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-black px-3 py-1 rounded-md uppercase tracking-wider">
                  Атайын Сунуш
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                  {selectedSlide.title}
                </h3>
                
                {/* 🔥 МОДАЛКАДАГЫ КООЗ БААСЫ (СОМ) */}
                {selectedSlide.item.price && (
                  <p className="text-2xl font-black text-blue-600">
                    {selectedSlide.item.price} сом
                  </p>
                )}

                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                  {selectedSlide.desc || "Бул товар боюнча кошумча маалымат жазылган эмес."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                <button 
                  onClick={(e) => handleAddToCart(e, selectedSlide)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  <ShoppingCart size={16} /> Себетке кошуу
                </button>
                
                <button 
                  onClick={(e) => handleAddToFavorites(e, selectedSlide)}
                  className="p-3.5 border border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all flex items-center justify-center active:scale-95"
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}