import React from 'react';
import { Search } from 'lucide-react';

export default function ProductNotFound({ setSearchQuery }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-[3rem] border border-slate-50 shadow-xs main-content-fade mt-8 relative overflow-hidden">
      
      {/* СҮРӨТТӨГҮДӨЙ НАСТОЯЩИЙ 404 ДИЗАЙН */}
      <div className="relative mb-10 flex items-center justify-center w-full max-w-lg mx-auto select-none">
        
        {/* Чоң жана калың 404 Тексти */}
        <div className="text-[12rem] md:text-[16rem] font-black text-indigo-600/10 tracking-tight leading-none flex items-center justify-center font-sans">
          <span>4</span>
          {/* Ортосундагы 0дун ордуна боштук калтырабыз */}
          <span className="opacity-0 w-[8rem] md:w-[11rem]">0</span>
          <span>4</span>
        </div>

        {/* Сүрөттөгүдөй арткы пландагы назик тегеректер жана Лупа */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Эң сырткы чоң назик тегерек (Сүрөттөгү көгүш фондой) */}
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-indigo-50/40 flex items-center justify-center animate-pulse">
            
            {/* Ички негизги чоң тегерек (Планета сыяктуу) */}
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-xl flex items-center justify-center relative">
              
              {/* Жылдызчалар (Декорация үчүн) */}
              <div className="absolute -top-4 -right-4 text-indigo-300 animate-spin duration-5000">✦</div>
              <div className="absolute -bottom-2 -left-4 text-violet-300 text-xs">✦</div>

              {/* Акылдуу кыймылдаган (Bounce) Лупа */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce transform rotate-12">
                <Search className="w-8 md:w-10 md:h-10 text-indigo-600" strokeWidth={3} />
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ТЕКСТТЕР БӨЛҮГҮ */}
      <div className="max-w-2xl mx-auto px-4 z-10">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">
          Мындай товар табылган жок
        </h3>
        <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed max-w-sm mx-auto mb-10">
          Издөө сөзүн туура жазганыңызды текшериңиз же башка аталыш менен издеп көрүңүз.
        </p>
      </div>

      {/* ПРОФЕССИОНАЛ БАСКЫЧ */}
      <button
        onClick={setSearchQuery}
        className="z-10 px-10 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_16px_32px_-6px_rgba(79,70,229,0.4)] hover:shadow-[0_20px_40px_-6px_rgba(79,70,229,0.5)] transition-all duration-300 transform active:scale-95"
      >
        Бардык товарларды көрсөтүү
      </button>

    </div>
  );
}