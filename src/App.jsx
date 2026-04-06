import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/admin/Admin';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Home/Profile';
import Auth from './Auth/Auth';
import { CartProvider } from './context/CartContext';
import { Heart, ShoppingBag, User, Sun, Moon, Languages, ShieldCheck } from 'lucide-react';
import { supabase } from './api/supabaseClient';
import Footer from './components/Footer';

export const LanguageContext = createContext();

const translations = {
  KG: { shop: "Дүкөн", admin: "Админ", profile: "Профиль", login: "Кирүү", search: "Издөө...", find: "Табуу", categories: { all: "Баары", living: "Конок бөлмө", kitchen: "Ашкана", bedroom: "Уктоочу бөлмө", bathroom: "Ванна", kids: "Балдар бөлмөсү", hallway: "Кире бериш", office: "Иш бөлмө", garden: "Бакча" } },
  RU: { shop: "Магазин", admin: "Админ", profile: "Профиль", login: "Войти", search: "Поиск...", find: "Найти", categories: { all: "Все", living: "Гостиная", kitchen: "Кухня", bedroom: "Спальня", bathroom: "Ванная", kids: "Детская", hallway: "Прихожая", office: "Кабинет", garden: "Сад" } },
  EN: { shop: "Store", admin: "Admin", profile: "Profile", login: "Login", search: "Search...", find: "Find", categories: { all: "All", living: "Living Room", kitchen: "Kitchen", bedroom: "Bedroom", bathroom: "Bathroom", kids: "Kids Room", hallway: "Hallway", office: "Office", garden: "Garden" } }
};

function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('KG');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const ADMIN_EMAIL = "adminj7@gmail.com";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const t = translations[lang];
  if (loading) return null;

  return (
    <LanguageContext.Provider value={{ user, lang, setLang, translations, darkMode, setDarkMode }}>
      <CartProvider>
        <Router>
          <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
            
            {/* --- НАВИГАЦИЯ (Мобилдик версияга ылайыкталган) --- */}
            <nav className={`sticky top-0 z-50 border-b px-3 md:px-6 py-3 backdrop-blur-lg transition-colors ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-50'}`}>
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Логотип: Телефондо кичине, компьютерде чоң */}
                <Link to="/" className="flex items-center group">
                  <div className="flex flex-col items-start">
                    <span className={`text-lg md:text-2xl font-black tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      NICE<span className="text-indigo-600 italic">HOME</span>
                    </span>
                  </div>
                </Link>

                {/* Оң тараптагы баскычтар */}
                <div className="flex items-center gap-1.5 md:gap-4">
                  
                  {/* Админ баскычы (Телефондо иконка гана, текстсиз) */}
                  {user?.email === ADMIN_EMAIL && (
                    <Link to="/admin" className="flex items-center gap-1 bg-red-500 text-white p-1.5 md:px-2 md:py-1.5 rounded-lg text-[9px] font-bold uppercase animate-pulse">
                      <ShieldCheck size={14} />
                      <span className="hidden md:inline">{t.admin}</span>
                    </Link>
                  )}

                  {/* Тил которуу */}
                  <button 
                    onClick={() => { const langs = ['KG', 'RU', 'EN']; const nextIndex = (langs.indexOf(lang) + 1) % langs.length; setLang(langs[nextIndex]); }} 
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border transition-all active:scale-90 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <Languages size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black">{lang}</span>
                  </button>

                  {/* Түнкү режим */}
                  <button 
                    onClick={() => setDarkMode(!darkMode)} 
                    className={`p-2 rounded-xl border transition-all active:scale-90 ${darkMode ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>

                  {/* Иконкалар тобу: Телефондо аралыгы кичирээк */}
                  <div className="flex items-center gap-2 md:gap-4 ml-1 border-l dark:border-slate-800 pl-2 md:pl-4">
                    <Link to="/favorites"><Heart className="w-5 h-5 text-slate-400" /></Link>
                    
                    <Link to="/cart" className="relative">
                      <ShoppingBag className="w-5 h-5 text-slate-400" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-950"></span>
                    </Link>

                    {user ? (
                      <Link to="/profile">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold border-2 border-indigo-200 dark:border-indigo-900">
                          {user.email[0].toUpperCase()}
                        </div>
                      </Link>
                    ) : (
                      <Link to="/auth"><User className="w-5 h-5 text-slate-400" /></Link>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            {/* Негизги мазмун: Телефондо четтеринен кичине боштук калтыруу */}
            <main className="flex-grow w-full max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={user ? <Navigate to="/profile" /> : <Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
                <Route path="/admin" element={user?.email === ADMIN_EMAIL ? <Admin /> : <Navigate to="/" />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </LanguageContext.Provider>
  );
}

export default App;