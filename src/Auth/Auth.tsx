import React, { useState } from 'react';
import { supabase } from "../api/supabaseClient";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ФУНКЦИЯ ДЛЯ ВХОДА (И для тебя, и для клиентов)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Почта жана пароль жазыңыз!");
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password 
    });
    
    if (error) {
      alert('Кирүүдө ката: ' + error.message);
    } else {
      alert('Кош келиңиз!');
      navigate('/'); 
    }
    setLoading(false);
  };

  // ФУНКЦИЯ ДЛЯ РЕГИСТРАЦИИ (Только для новых клиентов)
  const handleSignUp = async () => {
    if (!email || !password) return alert("Катталуу үчүн почта жана пароль жазыңыз!");
    
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email: email.trim(), 
      password: password 
    });
    
    if (error) {
      alert('Катталууда ката: ' + error.message);
    } else {
      alert('Каттоо ийгиликтүү! Эми "Кирүү" баскычын басыңыз.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full border border-slate-100 p-8 md:p-12 shadow-sm text-center">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-10 font-bold">
          NiceHome Авторизация
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="email" 
            placeholder="Электрондук почта" 
            className="w-full border-b border-slate-200 py-3 text-sm outline-none focus:border-slate-900 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            className="w-full border-b border-slate-200 py-3 text-sm outline-none focus:border-slate-900 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex flex-col gap-3 pt-6">
            {/* Кнопка входа — для всех */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-slate-800 active:scale-95 transition-all"
            >
              {loading ? 'Жүктөлүүдө...' : 'Кирүү'}
            </button>

            {/* Кнопка регистрации — только для новых людей */}
            <button 
              type="button" 
              onClick={handleSignUp}
              disabled={loading}
              className="w-full border border-slate-900 text-slate-900 py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-slate-50 active:scale-95 transition-all"
            >
              Жаңы аккаунт ачуу
            </button>
          </div>
        </form>

        <p className="mt-8 text-[8px] text-slate-400 uppercase tracking-widest">
          Админ өзүнүн почтасы менен кирет. Кардарлар жаңы аккаунт ачат.
        </p>
      </div>
    </div>
  );
};

export default Auth;