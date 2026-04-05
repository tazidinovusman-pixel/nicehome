import React, { useContext } from 'react';
import { Clock, Phone, Mail, MapPin } from 'lucide-react';
import { LanguageContext } from '../App';

const Footer = () => {
  const { lang, darkMode } = useContext(LanguageContext);

  return (
    <footer className={`border-t py-12 px-6 mt-20 transition-colors ${
      darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* 1. БИЗ ЖӨНҮНДӨ */}
          <div className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              NiceHome
            </h3>
            <p className="text-[11px] leading-relaxed max-w-[250px]">
              {lang === 'KG' ? 'Биздин дүкөн сизге эң кооз жана сапаттуу эмеректерди сунуштайт. Үйүңүзгө жылуулук тартуулаңыз.' : 
               lang === 'RU' ? 'Наш магазин предлагает вам самую красивую и качественную мебель. Принесите уют в свой дом.' : 
               'Our store offers you the most beautiful and high-quality furniture. Bring warmth to your home.'}
            </p>
          </div>

          {/* 2. КАРДАРЛАР ҮЧҮН */}
          <div className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'KG' ? 'Кызматтар' : lang === 'RU' ? 'Сервис' : 'Customer Service'}
            </h3>
            <ul className="text-[10px] space-y-3 font-medium uppercase tracking-wider">
              <li className="hover:text-indigo-500 cursor-pointer transition-colors">Help</li>
              <li className="hover:text-indigo-500 cursor-pointer transition-colors">Shipping</li>
              <li className="hover:text-indigo-500 cursor-pointer transition-colors">Returns</li>
              <li className="hover:text-indigo-500 cursor-pointer transition-colors">Terms</li>
            </ul>
          </div>

          {/* 3. БАЙЛАНЫШ (Тиркемелерсиз) */}
          <div className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'KG' ? 'Байланыш' : lang === 'RU' ? 'Контакты' : 'Contact'}
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-[10px]">
                <Phone size={12} className="text-indigo-500" /> +996 700 123 456
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <Mail size={12} className="text-indigo-500" /> nicehome@gmail.com
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <MapPin size={12} className="text-indigo-500" /> Бишкек, Күрөңкөева 123
              </div>
              <div className="flex items-center gap-2 text-[10px] pt-2 border-t border-slate-100 dark:border-slate-800 w-fit">
                <Clock size={12} className="text-slate-400" /> 
                <span className="italic">09:00 - 21:00 (Пн-Сб)</span>
              </div>
            </div>
          </div>

        </div>

        {/* АСТЫНКЫ СЫЗЫК */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
          <p>© 2026 NiceHome. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;