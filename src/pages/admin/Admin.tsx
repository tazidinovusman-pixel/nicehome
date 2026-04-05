import React, { useState, useEffect } from 'react';
import { supabase } from "../../api/supabaseClient";
import { 
  Trash2, PackagePlus, Tag, Banknote, Image as ImageIcon, 
  PlusCircle, Users, LayoutDashboard, Menu, X, Package, LogOut 
} from 'lucide-react';

const Admin = () => {
  // --- БАШКАРУУ ШТАТТАРЫ ---
  const [activeTab, setActiveTab] = useState('add'); // 'add', 'manage', 'users'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- ТОВАР ФОРМАСЫ ҮЧҮН ШТАТТАР ---
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Living Room');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- МААЛЫМАТТАР ТИЗМЕСИ ---
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Маалыматтарды жүктөө
  const fetchData = async () => {
    // Товарларды жүктөө
    const { data: items } = await supabase.from('items').select('*').order('id', { ascending: false });
    setProducts(items || []);

    // Клиенттерди жүктөө (Эскертүү: 'profiles' таблицасы болушу керек)
    const { data: profiles } = await supabase.from('profiles').select('*');
    setCustomers(profiles || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Товар кошуу
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('items').insert([{ name, price: Number(price), category, image_url: imageUrl }]);
    if (error) alert('Ката: ' + error.message);
    else {
      alert('Товар ийгиликтүү кошулду!');
      setName(''); setPrice(''); setImageUrl('');
      fetchData();
    }
    setIsSubmitting(false);
  };

  // Товар өчүрүү
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Бул товарды өчүрүүнү каалайсызбы?")) {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  // Клиентти өчүрүү
  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm("Бул клиентти өчүрөсүзбү?")) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const menuItems = [
    { id: 'add', label: 'Жаңы товар', icon: <PlusCircle size={20} /> },
    { id: 'manage', label: 'Башкаруу', icon: <Package size={20} /> },
    { id: 'users', label: 'Клиенттер', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. SIDEBAR (Каптал меню) - Бургер Кинг стилинде */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-black tracking-tighter flex items-center gap-2 italic text-indigo-400">
              <LayoutDashboard /> NICE ADMIN
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-grow space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <button className="flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all mt-auto font-bold text-xs uppercase tracking-widest">
            <LogOut size={20} /> Чыгуу
          </button>
        </div>
      </div>

      {/* 2. НЕГИЗГИ МАЙДАН */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* HEADER (Телефондо гана) */}
        <header className="bg-white border-b p-5 flex items-center justify-between lg:hidden sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-slate-100 rounded-xl active:scale-90 transition-transform">
            <Menu size={22} />
          </button>
          <span className="font-black text-xs tracking-widest uppercase italic">Админ Панель</span>
          <div className="w-10"></div>
        </header>

        <main className="p-6 md:p-12 max-w-5xl mx-auto w-full">
          
          {/* TAB 1: ЖАҢЫ ТОВАР КОШУУ */}
          {activeTab === 'add' && (
            <div className="max-w-xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white"><PackagePlus /></div>
                <h3 className="text-2xl font-black italic">Жаңы товар</h3>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="relative">
                  <Tag className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Аталышы" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="relative">
                  <Banknote className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" 
                    type="number" placeholder="Баасы (сом)" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <div className="relative">

  <PlusCircle className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />

  <select

    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none text-slate-600"

    value={category}

    onChange={(e) => setCategory(e.target.value)}

  >

    {/* МААНИЛҮҮ: value бөлүгү CategoryBar'дагы name менен бирдей болушу керек! */}

    <option value="Living Room">🛋️ Гостиная (Конок бөлмө)</option>

    <option value="Kitchen">🍳 Кухня (Ашкана)</option>

    <option value="Bedroom">🛏️ Спальня (Уктоочу бөлмө)</option>

    <option value="Bathroom">🚿 Ванная и туалет (Жуунуучу бөлмө)</option>

    <option value="Kids Room">🧸 Детская (Балдар бөлмөсү)</option>

    <option value="Hallway">🧥 Прихожая (Кире бериш)</option>

    <option value="Office">💻 Кабинет / Офис (Иш бөлмөсү)</option>

    <option value="Garden">🌿 Сад / Терраса (Бакча)</option>

  </select>

</div>

                <div className="relative">
                  <ImageIcon className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Сүрөт URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
                </div>

                {imageUrl && (
                  <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center">
                    <img src={imageUrl} alt="Preview" className="h-32 object-contain mix-blend-multiply" 
                         onError={(e) => e.currentTarget.src="https://placehold.co/200x200?text=Error"} />
                  </div>
                )}

                <button disabled={isSubmitting} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                  {isSubmitting ? 'Кошулууда...' : 'Кошуу'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ТОВАРЛАРДЫ БАШКАРУУ */}
          {activeTab === 'manage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black italic mb-8">Башкаруу ({products.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <img src={item.image_url} className="w-16 h-16 rounded-2xl object-cover bg-slate-50" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-indigo-600 font-black text-xs">{item.price} сом</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(item.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: КЛИЕНТТЕР */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-2xl font-black italic mb-8">Клиенттер тизмеси</h3>
              <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                    <tr>
                      <th className="p-6">Gmail / Email</th>
                      <th className="p-6 text-right">Аракет</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {customers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">{user.email}</span>
                            <span className="text-[10px] text-slate-400">ID: {user.id.slice(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button onClick={() => handleDeleteCustomer(user.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                            <X size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customers.length === 0 && <div className="p-10 text-center text-slate-400 italic">Клиенттер табылган жок.</div>}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Admin;