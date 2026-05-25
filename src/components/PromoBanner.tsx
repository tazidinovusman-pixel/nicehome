// import { useEffect, useState } from 'react';
// import { supabase } from '../api/supabaseClient'; // Укажи правильный путь к твоему supabaseClient
// import { ChevronLeft, ChevronRight } from 'lucide-react'; // Или используй свои иконки

// interface Item {
//   id: string;
//   title: string;
//   price: number;
//   images: string[];
//   description?: string;
//   category?: string;
// }

// export default function PromoBanner() {
//   const [promoItems, setPromoItems] = useState<Item[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // 1. Получаем из таблицы 'items' только те товары, у которых в колонке is_featured стоит true
//   useEffect(() => {
//     const fetchPromoItems = async () => {
//       try {
//         const { data, error } = await supabase
//         //   .from('items')
//           .select('*')
//           .eq('is_featured', true);

//         if (error) throw error;
//         if (data) setPromoItems(data);
//       } catch (err) {
//         console.error("Ошибка при загрузке рекламы:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPromoItems();
//   }, []);

//   // 2. Автоматическая прокрутка каждые 4 секунды
//   useEffect(() => {
//     if (promoItems.length <= 1) return;

//     const interval = setInterval(() => {
//       handleNext();
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [currentIndex, promoItems]);

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? promoItems.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev === promoItems.length - 1 ? 0 : prev + 1));
//   };

//   if (loading || promoItems.length === 0) return null;

//   return (
//     <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 my-6">
//       {/* Главный контейнер большого баннера */}
//       <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden bg-[#F8F9FA] border border-slate-100 group shadow-sm">
        
//         {/* Рендеринг слайдов */}
//         {promoItems.map((item, index) => (
//           <div
//             key={item.id}
//             className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 md:p-16 transition-all duration-1000 ease-in-out ${
//               index === currentIndex 
//                 ? 'opacity-100 translate-x-0 z-10' 
//                 : 'opacity-0 translate-x-8 z-0 pointer-events-none'
//             }`}
//           >
//             {/* Левая сторона: Текст и Кнопка */}
//             <div className="flex-1 flex flex-col justify-center text-center md:text-left order-2 md:order-1 max-w-xl z-10">
//               <span className="inline-block self-center md:self-start bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
//                 ЖАҢЫ РЕКЛАМА
//               </span>
//               <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight leading-tight line-clamp-2 italic">
//                 {item.title}
//               </h1>
//               <p className="text-sm sm:text-base text-slate-500 mt-3 max-w-md line-clamp-2 font-medium">
//                 {item.description || "Үйүңүзгө өзгөчө стил жана ыңгайлуулук тартуулаңыз."}
//               </p>
              
//               <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
//                 <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
//                   {item.price} сом
//                 </span>
//                 <button className="w-full sm:w-auto bg-slate-950 hover:bg-indigo-600 text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg active:scale-95">
//                   Сатып алуу
//                 </button>
//               </div>
//             </div>

//             {/* Правая сторона: Большое изображение товара */}
//             <div className="flex-1 w-full h-[160px] sm:h-[240px] md:h-full flex items-center justify-center order-1 md:order-2 relative">
//               {/* Декоративный мягкий круг на заднем фоне картинки для объема */}
//               <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-indigo-50 rounded-full blur-3xl -z-10" />
              
//               <imgЯЯЯЯЯЯЯ
//                 src={item.images?.[0]}
//                 alt={item.title}
//                 className="max-h-full max-w-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 ease-out"
//               />
//             </div>
//           </div>
//         ))}

//         {/* Стрелка влево (появляется при наведении на баннер) */}
//         <button
//           onClick={handlePrev}
//           className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden group-hover:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-slate-900 hover:bg-indigo-600 hover:text-white transition-all duration-200 active:scale-90"
//         >
//           <ChevronLeft size={24} strokeWidth={2.5} />
//         </button>

//         {/* Стрелка вправо (появляется при наведении на баннер) */}
//         <button
//           onClick={handleNext}
//           className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden group-hover:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-slate-900 hover:bg-indigo-600 hover:text-white transition-all duration-200 active:scale-90"
//         >
//           <ChevronRight size={24} strokeWidth={2.5} />
//         </button>

//         {/* Навигационные точки (индикаторы) внизу по центру */}
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
//           {promoItems.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 index === currentIndex ? 'w-8 bg-slate-950' : 'w-2 bg-slate-300'
//               }`}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }



// не работает, не отображается, не загружается, не переключается, не реагирует на клики, не отображает данные из базы данных, не отображает изображения, не отображает текст, не отображает кнопки, не отображает стрелки, не отображает индикаторы, не работает анимация, не работает адаптивность, не работает стилизация, не работает дизайн, не работает функциональность.