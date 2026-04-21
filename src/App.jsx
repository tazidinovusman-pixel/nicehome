import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/admin/Admin';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Home/Profile';
import Auth from './Auth/Auth';
import ProductDetail from './pages/ProductDetail';
import { CartProvider, useCart } from './context/CartContext';

import {
  Heart, ShoppingBag, User, Sun, Moon, ShieldCheck, Menu, X,
  Search, Sofa, UtensilsCrossed, BedDouble, Bath, Baby,
  DoorOpen, Laptop, TreePine, LayoutGrid
} from 'lucide-react';
import { supabase } from './api/supabaseClient';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './pages/Home/Checkout';

// МААНИЛҮҮ: Контекстти өзүнчө файлдан алуу керек (Circular Dependency болбошу үчүн)
// Бирок азырынча App ичинде калтырсаңыз, импортту өчүрүп, төмөнкүдөй кылыңыз:
export const LanguageContext = createContext();

const translations = {
  KG: {
    shop: "Дүкөн", admin: "Админ", profile: "Профиль", login: "Кирүү", search: "Издөө...",
    back: "Артка", new_model: "Жаңы модель", price_tag: "сом", model: "Модель",
    date: "Дата", add_to_cart: "Себетке кошуу", similar_products: "Окшош товарлар",
    loading: "Издөөдө...",
    categories: { all: "Баары", living: "Конок бөлмө", kitchen: "Ашкана", bedroom: "Уктоочу бөлмө", bathroom: "Ванна", kids: "Балдар бөлмөсү", hallway: "Кире бериш", office: "Иш бөлмө", garden: "Бакча" }
  },
  RU: {
    shop: "Магазин", admin: "Админ", profile: "Профиль", login: "Войти", search: "Поиск...",
    back: "Назад", new_model: "Новая модель", price_tag: "сом", model: "Модель",
    date: "Дата", add_to_cart: "Добавить в корзину", similar_products: "Похожие товары",
    loading: "Загрузка...",
    categories: { all: "Все", living: "Гостиная", kitchen: "Кухня", bedroom: "Спальня", bathroom: "Ванная", kids: "Детская", hallway: "Прихожая", office: "Кабинет", garden: "Сад" }
  },
  EN: {
    shop: "Store", admin: "Admin", profile: "Profile", login: "Login", search: "Search...",
    back: "Back", new_model: "New Model", price_tag: "som", model: "Model",
    date: "Date", add_to_cart: "Add to cart", similar_products: "Similar products",
    loading: "Loading...",
    categories: { all: "All", living: "Living Room", kitchen: "Kitchen", bedroom: "Bedroom", bathroom: "Bathroom", kids: "Kids Room", hallway: "Hallway", office: "Office", garden: "Garden" }
  }
};

const menuCategories = [
  { key: 'all', icon: <LayoutGrid size={20} /> },
  { key: 'living', icon: <Sofa size={20} /> },
  { key: 'kitchen', icon: <UtensilsCrossed size={20} /> },
  { key: 'bedroom', icon: <BedDouble size={20} /> },
  { key: 'bathroom', icon: <Bath size={20} /> },
  { key: 'kids', icon: <Baby size={20} /> },
  { key: 'hallway', icon: <DoorOpen size={20} /> },
  { key: 'office', icon: <Laptop size={20} /> },
  { key: 'garden', icon: <TreePine size={20} /> },
];

// Аргументтерге "userRole" кошулду
const Navbar = ({ t, darkMode, setDarkMode, setIsMenuOpen, user, ADMIN_EMAIL, userRole }) => { 
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <nav className={`sticky top-0 z-[100] border-b backdrop-blur-xl transition-colors ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex flex-col items-start group">
              <span className="text-lg md:text-2xl font-extrabold tracking-tight italic uppercase transition-all duration-300 group-hover:tracking-wide">
                <span className="bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-900 bg-clip-text text-transparent">
                  Nice
                </span>
                <span className="text-blue-900 group-hover:text-blue-600 transition-colors duration-300">
                  Home
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-0.5 md:gap-2">
            {/* Эми бул жер ката бербейт, анткени userRole жогоруда кабыл алынды */}
            {(userRole === 'admin' || userRole === 'seller') && (
              <Link to="/admin" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                <ShieldCheck size={18} className="animate-pulse" />
              </Link>
            )}
            
            <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 text-slate-400 hover:text-yellow-400 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/favorites" className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
              <Heart size={18} />
            </Link>
            <Link to="/cart" className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <ShoppingBag size={18} />
              {cart?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/auth"} className="ml-1">
              {user ? (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-indigo-500/20">
                  {user.email[0].toUpperCase()}
                </div>
              ) : (
                <div className="p-1.5 text-slate-400"><User size={18} /></div>
              )}
            </Link>
          </div>
        </div>

        <div className="pb-3 px-1 md:px-0">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-100 focus-within:border-indigo-400'}`}>
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                navigate(`/?search=${query}`);
              }}
            >
              <input
                name="search"
                type="text"
                placeholder={t.search}
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
              />
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // Жаңы сап: ролду сактоо
  const [lang, setLang] = useState('KG');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ADMIN_EMAIL = "adminj7@gmail.com";

  useEffect(() => {
    const getProfile = async (sessionUser) => {
      if (sessionUser) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single();
        setUserRole(data?.role || 'user');
      } else {
        setUserRole('user');
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      getProfile(sessionUser); // Ролду текшерүү
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      getProfile(sessionUser); // Ролду текшерүү
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

  return (
    // КАТАНЫ ОҢДОО: LanguageContext.Provider колдонулушу керек, эгер LanguageProvider өзүнчө файлда болбосо
    <LanguageContext.Provider value={{ user, lang, setLang, translations, darkMode, setDarkMode }}>
      <CartProvider>
        <Router>
          <ScrollToTop />

          <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>

            <Navbar
              t={t}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setIsMenuOpen={setIsMenuOpen}
              user={user}
              userRole={userRole}
            />

            {/* {(userRole === 'admin' || userRole === 'seller')
            //  && (
            //   <Link to="/admin" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
            //     <ShieldCheck size={18} className="animate-pulse" />
            //   </Link>
            // )
            } */}

            {/* --- БУРГЕР МЕНЮ --- */}
            {isMenuOpen && (
              <div className="fixed inset-0 z-[110] flex">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                <div className={`relative w-[280px] h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                  <div className="p-6 flex justify-between items-center border-b dark:border-slate-800">
                    <span className="font-black italic uppercase text-indigo-600">Nice Home</span>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-transparent dark:border-slate-700">
                      {['KG', 'RU', 'EN'].map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setIsMenuOpen(false); }}
                          className={`flex-1 py-2 rounded-xl font-bold text-[10px] transition-all ${lang === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-grow p-4 space-y-1">
                    <p className="text-[10px] font-bold uppercase px-4 mb-4 opacity-40 tracking-widest">Категориялар</p>
                    {menuCategories.map((cat) => (
                      <Link
                        key={cat.key}
                        to={cat.key === 'all' ? '/' : `/?category=${cat.key}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
                      >
                        <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">{cat.icon}</span>
                        <span className="font-bold text-sm">{t.categories[cat.key]}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <main className="flex-grow w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={user ? <Navigate to="/profile" /> : <Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                {/* <Route path="/admin" element={user?.email === ADMIN_EMAIL ? <Admin /> : <Navigate to="/" />} /> */}
                <Route path="/admin" element={(userRole === 'admin' || userRole === 'seller') ? <Admin /> : <Navigate to="/" />} />
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