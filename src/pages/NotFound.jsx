import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-white">
      
      {/* ЛУПА МЕНЕН ЧОҢ 404 ДИЗАЙНЫ */}
      <div className="relative mb-10 flex items-center justify-center w-full max-w-lg mx-auto select-none">
        <div className="text-[12rem] md:text-[16rem] font-black text-indigo-600/10 tracking-tight leading-none flex items-center justify-center">
          <span>4</span>
          <span className="opacity-0 w-[8rem] md:w-[11rem]">0</span>
          <span>4</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-indigo-50/40 flex items-center justify-center animate-pulse">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-xl flex items-center justify-center relative">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce">
                <Search className="w-8 md:w-10 md:h-10 text-indigo-600" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ТЕКСТТЕР БӨЛҮГҮ */}
      <div className="max-w-2xl mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">
          Баракча табылган жок
        </h3>
        <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed max-w-sm mx-auto mb-10">
          Мындай шилтеме же баракча биздин сайтта жок. Башкы бетке өтүүнү сунуштайбыз.
        </p>
      </div>

      {/* БАШКЫ БЕТКЕ КҮҮЛӨНҮҮ БАСКЫЧЫ */}
      <button
        onClick={() => navigate('/')}
        className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_16px_32px_-6px_rgba(79,70,229,0.4)] transition-all duration-300 transform active:scale-95"
      >
        Башкы бетке өтүү
      </button>

    </div>
  );
}