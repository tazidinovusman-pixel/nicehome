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
  KG: {
    shop: "Дүкөн", admin: "Админ", profile: "Профиль", login: "Кирүү", search: "Издөө...", find: "Табуу",
    categories: { all: "Баары", living: "Конок бөлмө", kitchen: "Ашкана", bedroom: "Уктоочу бөлмө", bathroom: "Ванна", kids: "Балдар бөлмөсү", hallway: "Кире бериш", office: "Иш бөлмө", garden: "Бакча" }
  },
  RU: {
    shop: "Магазин", admin: "Админ", profile: "Профиль", login: "Войти", search: "Поиск...", find: "Найти",
    categories: { all: "Все", living: "Гостиная", kitchen: "Кухня", bedroom: "Спальня", bathroom: "Ванная", kids: "Детская", hallway: "Прихожая", office: "Кабинет", garden: "Сад" }
  },
  EN: {
    shop: "Store", admin: "Admin", profile: "Profile", login: "Login", search: "Search...", find: "Find",
    categories: { all: "All", living: "Living Room", kitchen: "Kitchen", bedroom: "Bedroom", bathroom: "Bathroom", kids: "Kids Room", hallway: "Hallway", office: "Office", garden: "Garden" }
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('KG');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true); // Жүктөлүү статусу
  const ADMIN_EMAIL = "adminj7@gmail.com";

  useEffect(() => {
    // 1. Сессияны текшерүү
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Auth абалын тыңшоо
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = translations[lang];

  // Жүктөлүп жатканда бош экран көрсөтпөө үчүн
  if (loading) return null;

  return (
    // МААНИЛҮҮ: 'user'ди бул жерге коштук, ошондо Home.jsx аны көрө алат
    <LanguageContext.Provider value={{ user, lang, setLang, translations, darkMode, setDarkMode }}>
      <CartProvider>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>

            <nav className={`sticky top-0 z-50 border-b px-4 md:px-6 py-4 backdrop-blur-lg transition-colors ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-50'}`}>
              <div className="max-w-7xl mx-auto flex justify-between items-center">

                <Link
                  to="/"
                  className="flex items-center group transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xl md:text-2xl font-black tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      NICE<span className="text-indigo-600 italic">HOME</span>
                    </span>
                    <div className={`w-0 group-hover:w-full h-[2px] bg-indigo-600 transition-all duration-500 rounded-full mt-1`}></div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                  {/* АДМИН БАСКЫЧЫ */}
                  {user?.email === ADMIN_EMAIL && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-tighter animate-pulse"
                    >
                      <ShieldCheck size={12} />
                      {t.admin}
                    </Link>
                  )}

                  {/* ТИЛ КОТОРУУ */}
                  <button
                    onClick={() => {
                      const langs = ['KG', 'RU', 'EN'];
                      const nextIndex = (langs.indexOf(lang) + 1) % langs.length;
                      setLang(langs[nextIndex]);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all active:scale-90 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
                      }`}
                  >
                    <Languages size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black">{lang}</span>
                  </button>

                  {/* DARK MODE */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-xl border transition-all active:scale-90 ${darkMode ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>

                  <div className="flex items-center gap-3 ml-1 border-l dark:border-slate-800 pl-3">
                    <Link to="/favorites"><Heart className="w-5 h-5 text-slate-400" /></Link>
                    <Link to="/cart" className="relative">
                      <ShoppingBag className="w-5 h-5 text-slate-400" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                    </Link>

                    {user ? (
                      <Link to="/profile">
                        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                          {user.email[0].toUpperCase()}
                        </div>
                      </Link>
                    ) : (
                      <Link to="/auth">
                        <User className="w-5 h-5 text-slate-400" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={user ? <Navigate to="/profile" /> : <Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
                <Route
                  path="/admin"
                  element={user?.email === ADMIN_EMAIL ? <Admin /> : <Navigate to="/" />}
                />
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