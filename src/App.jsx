import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/admin/Admin';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Home/Profile'; // Жаңы Профиль барагын коштук
import Auth from './Auth/Auth'; 
import { CartProvider } from './context/CartContext';
import { Heart, ShoppingBag, User, LogOut } from 'lucide-react';
import { supabase } from './api/supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const ADMIN_EMAIL = "adminj7@gmail.com"; 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to="/" className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">NiceHome</Link>
              
              <div className="flex items-center gap-6">
                <Link to="/" className="text-[11px] font-bold text-slate-400">Дүкөн</Link>
                
                {user?.email === ADMIN_EMAIL && (
                  <Link to="/admin" className="text-[10px] font-bold text-red-500 underline decoration-2 underline-offset-4">Админ</Link>
                )}

                <div className="flex items-center gap-4">
                  <Link to="/favorites"><Heart className="w-5 h-5 text-slate-700" /></Link>
                  <Link to="/cart" className="relative">
                    <ShoppingBag className="w-5 h-5 text-slate-700" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                  </Link>
                  
                  {/* ПРОФИЛЬ ЖЕ КИРҮҮ ИКОНКАСЫ */}
                  {user ? (
                    <Link to="/profile">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                         <User className="w-4 h-4 text-slate-600" />
                      </div>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <User className="w-5 h-5 text-slate-400 hover:text-slate-900 transition-colors" />
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
              <Route path="/profile" element={<Profile />} /> {/* Профиль маршруту */}
              <Route 
                path="/admin" 
                element={user?.email === ADMIN_EMAIL ? <Admin /> : <Navigate to="/" />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;