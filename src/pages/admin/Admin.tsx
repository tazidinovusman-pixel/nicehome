import React, { useState, useEffect, useContext } from 'react';
import { supabase } from "../../api/supabaseClient";
import { LanguageContext } from '../../context/LanguageContext';
import {
  Trash2, PackagePlus, Tag, Banknote, Image as ImageIcon,
  PlusCircle, Users, LayoutDashboard, Menu, X, Package, LogOut,
  FileText, Calendar, Sparkles, Mail, UserCircle
} from 'lucide-react';

// ... (башка импорттор ошол бойдон калат)

const Admin = () => {
  const { lang, translations, userRole, user } = useContext(LanguageContext);
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState('add');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Форма үчүн State'тер
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Living Room');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2026');
  const [isNew, setIsNew] = useState(false);

  const fetchData = async () => {
    try {
      let productQuery = supabase.from('items').select('*').order('id', { ascending: false });
      if (userRole === 'seller' && user?.id) {
        productQuery = productQuery.eq('author_id', user.id);
      }
      const { data: items } = await productQuery;
      setProducts(items || []);

      const { data: profiles } = await supabase.from('profiles').select('*');
      setUsers(profiles || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userRole, user?.id]);

  // ТОВАР КОШУУ (author_id кошулду)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    //   if (window.confirm("Бул колдонуучуну өчүрүүнү каалайсызбы?")) {
    //   const { error } = await supabase
    //     .from('profiles') // Таблицаңыздын аты 'profiles' экенин текшериңиз
    //     .delete()
    //     .eq('id', userId);

    //   if (error) {
    //     alert("Ката: " + error.message);
    //   } else {
    //     // Экрандан дароо өчүрүү
    //     setUsers(prev => prev.filter(u => u.id !== userId));
    //     alert("Колдонуучу ийгиликтүү өчүрүлдү!");
    //   }
    // }
    const { error } = await supabase.from('items').insert([{
      name,
      price: Number(price),
      category,
      image_url: imageUrl,
      description,
      year: Number(year),
      is_new: isNew,
      author_id: user?.id // Бул жер маанилүү!
    }]);

    if (error) {
      alert('Ката: ' + error.message);
    } else {
      alert("Товар ийгиликтүү кошулду!");
      setName(''); setPrice(''); setImageUrl('');
      setDescription(''); setYear('2026'); setIsNew(false);
      fetchData();
    }
    setIsSubmitting(false);
  };

  // ТОВАР ӨЧҮРҮҮ (Экранды дароо тазалоо кошулду)
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Бул товарды өчүрүүнү каалайсызбы?")) {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Ката кетти: " + error.message);
      } else {
        // Базадан өчкөндөн кийин экрандан дароо алып салуу
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Товар өчүрүлдү!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* SIDEBAR ОШОЛ БОЙДОН */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 flex flex-col h-full">
          <h2 className="text-xl font-black italic text-indigo-400 mb-12 flex items-center gap-2 uppercase tracking-tighter">
            <LayoutDashboard /> Salmon Admin
          </h2>
          <nav className="flex-grow space-y-3">
            <button onClick={() => setActiveTab('add')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
              <PlusCircle size={20} /> {t.add_product}
            </button>
            <button onClick={() => setActiveTab('manage')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Package size={20} /> {t.manage}
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Users size={20} /> {t.customers}
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white border-b p-5 lg:hidden flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg"><Menu /></button>
          <span className="font-black italic uppercase text-xs tracking-widest">{t.admin_panel}</span>
          <div className="w-10"></div>
        </header>

        <main className="p-6 md:p-12 max-w-5xl mx-auto w-full">
          {/* ADD TAB */}
          {activeTab === 'add' && (
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><PackagePlus /></div>
                <h3 className="text-2xl font-black italic">Жаңы товар кошуу</h3>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Tag className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Аталышы" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" type="number" placeholder="Баасы (сом)" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </div>
                </div>
                {/* Калган форма талаалары ошол бойдон... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <PlusCircle className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Living Room">🛋️ Living Room</option>
                      <option value="Kitchen">🍳 Kitchen</option>
                      <option value="Bedroom">🛏️ Bedroom</option>
                      <option value="Bathroom">🚿 Bathroom</option>
                      <option value="Kids Room">🧸 Kids Room</option>
                      <option value="Hallway">🧥 Hallway</option>
                      <option value="Office">💻 Office</option>
                      <option value="Garden">🌿 Garden</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" type="number" placeholder="Жылы" value={year} onChange={(e) => setYear(e.target.value)} required />
                  </div>
                </div>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="Толук сүрөттөмө..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Сүрөт URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>
                {imageUrl && (
                  <div className="mt-4 flex flex-col items-center gap-2 ...">
                    {/* ... сүрөт блогу ... */}
                  </div>
                )}
                <button disabled={isSubmitting} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                  {isSubmitting ? 'Жүктөлүүдө...' : 'Товарды кошуу'}
                </button>
              </form>
            </div>
          )}

          {/* MANAGE TAB */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black italic uppercase">Товарлар ({products.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                        <img src={item.image_url} className="max-w-full max-h-full object-contain" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-indigo-600 font-black text-xs">{item.price} сом</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="p-4 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black italic uppercase">Клиенттер ({users.length})</h3>
              <div className="grid grid-cols-1 gap-4">
                {users.map((u) => (
                  <div key={u.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} className="w-full h-full object-cover" alt="User" />
                        ) : (
                          <UserCircle size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <p className="font-bold text-sm text-slate-700">{u.email}</p>
                        </div>
                        <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">Ролу: {u.role || 'user'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u.id)} // u.id колдонулат
                      className="p-4 text-slate-300 hover:text-red-500 transition-all active:scale-90"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;

