import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient'; // Твой клиент Supabase
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Или стрелочки из твоих иконок

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
}

export default function PromoSlider() {
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Получаем рекламные товары из Supabase
  useEffect(() => {
    const fetchPromo = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true);

      if (data) setPromoProducts(data);
    };
    fetchPromo();
  }, []);

  // 2. Автоматическая смена слайдов каждые 4 секунды
  useEffect(() => {
    if (promoProducts.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, promoProducts]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? promoProducts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === promoProducts.length - 1 ? 0 : prev + 1));
  };

  if (promoProducts.length === 0) return null;

  return (
    <div className="relative w-full max-w-[1400px] mx-auto my-8 px-4 md:px-8 group">
      {/* Контейнер слайдера */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 shadow-sm border border-slate-100">
        
        {/* Слайды */}
        {promoProducts.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Текстовый блок рекламы */}
            <div className="flex-1 order-2 md:order-1 text-center md:text-left mt-4 md:mt-0 max-w-lg">
              <span className="inline-block bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 animate-pulse">
                Жаңы / Акция
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight line-clamp-2">
                {product.title}
              </h2>
              <p className="text-sm md:text-base text-slate-500 mt-2 line-clamp-2">
                {product.description || "Үйүңүзгө ыңгайлуулук жана сулуулук тартуулаңыз."}
              </p>
              <div className="mt-4 md:mt-6 flex items-center justify-center md:justify-start gap-4">
                <span className="text-xl md:text-2xl font-bold text-blue-600">
                  {product.price} сом
                </span>
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md active:scale-95">
                  Көрүү
                </button>
              </div>
            </div>

            {/* Блок картинки — Адаптивный */}
            <div className="flex-1 order-1 md:order-2 w-full h-[140px] sm:h-[220px] md:h-full flex items-center justify-center">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="max-h-full max-w-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка Влево */}
      <button
        onClick={prevSlide}
        className="hidden group-hover:flex absolute top-1/2 left-6 md:left-12 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow border border-slate-200 text-slate-800 hover:bg-white transition-all active:scale-90"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Кнопка Вправо */}
      <button
        onClick={nextSlide}
        className="hidden group-hover:flex absolute top-1/2 right-6 md:right-12 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow border border-slate-200 text-slate-800 hover:bg-white transition-all active:scale-90"
      >
        <ChevronRight size={20} />
      </button>

      {/* Индикаторы (Точки снизу) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {promoProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}