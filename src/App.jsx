import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/admin/Admin';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites'; // Добавили импорт страницы избранного
import { CartProvider } from './context/CartContext'; // ОБЯЗАТЕЛЬНО: обертка для данных
import { Heart, ShoppingBag } from 'lucide-react';

function App() {
  return (
    // Оборачиваем всё в CartProvider, чтобы корзина и избранное работали везде
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white">
          {/* Навигация в стиле minim */}
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              {/* Логотип */}
              <Link to="/" className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">
                NiceHome
              </Link>

              {/* Ссылки */}
              <div className="flex items-center gap-8">
                <Link to="/" className="text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-900 font-bold transition-colors">
                  Дүкөн
                </Link>
              
                
                <div className="flex items-center gap-4 ml-4">
                  {/* Избранное */}
                  <Link to="/favorites" className="text-slate-900 hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Корзина */}
                  <Link to="/cart" className="relative text-slate-900 hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                    {/* Точка-индикатор, если в корзине что-то есть */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Основной контент */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-secret-99" element={<Admin />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;