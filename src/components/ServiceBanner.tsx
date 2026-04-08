import React from 'react';
import { Timer, Star, Users, Wrench, Phone, MessageCircle } from 'lucide-react';

const ServiceBanner = ({ serviceName, lang, variant = 1 }) => {
  const translations = {
    KG: {
      time: "20 мүнөттө жетип келебиз",
      clients: "1000+ кардар",
      rating: "4.5 рейтинг",
      needed: "Керектүү адис:",
      call: "Чалуу",
      contact: "Байланышуу"
    },
    RU: {
      time: "Прибудем за 20 минут",
      clients: "1000+ клиентов",
      rating: "4.5 рейтинг",
      needed: "Нужен специалист:",
      call: "Позвонить",
      contact: "Связаться"
    }
  };

  const t = translations[lang] || translations.KG;

  // 8 түрдүү дизайн варианттары (Градиенттер жана Түстөр)
  const variants = {
    1: "bg-indigo-600 shadow-indigo-500/50", // Living Room
    2: "bg-emerald-600 shadow-emerald-500/50", // Kitchen
    3: "bg-rose-600 shadow-rose-500/50",       // Bedroom
    4: "bg-sky-600 shadow-sky-500/50",         // Bathroom
    5: "bg-amber-500 shadow-amber-500/50",     // Kids Room
    6: "bg-slate-700 shadow-slate-500/50",     // Hallway
    7: "bg-violet-600 shadow-violet-500/50",   // Office
    8: "bg-lime-600 shadow-lime-500/50",       // Garden
  };

  // Фалшивый номерлердин тизмеси
  const contacts = ["+996 (700) 11-22-33", "+996 (555) 00-99-88", "+996 (999) 77-66-55"];
  const randomPhone = contacts[variant % contacts.length];

  return (
    <div className={`w-full mt-20 p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden border border-white/10 shadow-2xl`}>
      {/* Фондогу чоң текст (дизайн үчүн) */}
      <div className="absolute -bottom-10 -left-10 text-[12rem] font-black opacity-5 select-none italic leading-none">
        SERVICE
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="max-w-md text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Азыр бош
          </div>
          <h2 className="text-5xl font-black uppercase italic mb-4">{serviceName}</h2>
          <p className="text-slate-400 text-lg mb-8 italic">Биздин адистер сиздин үйүңүздү иретке келтирүүгө ар дайым даяр. Сапаттуу жана арзан кызмат!</p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-6 py-4 bg-white text-black rounded-2xl font-black text-xl flex items-center gap-3">
              <Phone size={24} /> {randomPhone}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
            <p className="text-3xl font-black">20</p>
            <p className="text-[10px] uppercase opacity-50">Мүнөттө жетет</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
            <p className="text-3xl font-black">1к+</p>
            <p className="text-[10px] uppercase opacity-50">Кардарлар</p>
          </div>
          <div className="p-6 rounded-3xl bg-indigo-600 text-center col-span-2">
            <p className="text-xl font-bold italic">4.9 Жылдыз</p>
            <div className="flex justify-center gap-1 mt-1 text-yellow-400">
               <Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceBanner;