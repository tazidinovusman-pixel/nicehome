import React, { useState, useEffect } from 'react';
import { supabase } from "../../api/supabaseClient";
import { 
  Trash2, PackagePlus, Tag, Banknote, Image as ImageIcon, 
  PlusCircle, Users, LayoutDashboard, Menu, X, Package, LogOut,
  FileText, Calendar, Sparkles
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  year: number;
  is_new: boolean;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Форма үчүн State'тер
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Living Room');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2026');
  const [isNew, setIsNew] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState([]);

  const fetchData = async () => {
    const { data: items } = await supabase.from('items').select('*').order('id', { ascending: false });
    setProducts(items || []);
    const { data: profiles } = await supabase.from('profiles').select('*');
    setCustomers(profiles || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('items').insert([{ 
      name, 
      price: Number(price), 
      category, 
      image_url: imageUrl,
      description,
      year: Number(year),
      is_new: isNew
    }]);

    if (error) {
      alert('Ката: ' + error.message);
    } else {
      alert('Товар ийгиликтүү кошулду!');
      // Форманы тазалоо
      setName(''); setPrice(''); setImageUrl(''); 
      setDescription(''); setYear('2026'); setIsNew(false);
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Бул товарды өчүрүүнү каалайсызбы?")) {
      const { error } = await supabase.from('items').delete().eq('id', id);
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
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-black tracking-tighter flex items-center gap-2 italic text-indigo-400">
              <LayoutDashboard /> SALMON ADMIN
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"><X size={20} /></button>
          </div>
          <nav className="flex-grow space-y-3">
            {menuItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400'}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
          <button className="flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all mt-auto font-bold text-xs uppercase tracking-widest">
            <LogOut size={20} /> Чыгуу
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white border-b p-5 flex items-center justify-between lg:hidden sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-slate-100 rounded-xl active:scale-90 transition-transform"><Menu size={22} /></button>
          <span className="font-black text-xs tracking-widest uppercase italic">Админ Панель</span>
          <div className="w-10"></div>
        </header>

        <main className="p-6 md:p-12 max-w-5xl mx-auto w-full">
          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white"><PackagePlus /></div>
                <h3 className="text-2xl font-black italic">Жаңы товар кошуу</h3>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-6">
                {/* Аталышы жана Баасы */}
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

                {/* Категория жана Жыл */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <PlusCircle className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none" value={category} onChange={(e) => setCategory(e.target.value)}>
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
                    <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" type="number" placeholder="Жылы" value={year} onChange={(e) => setYear(e.target.value)} required />
                  </div>
                </div>

                {/* Сүрөттөмө (Description) */}
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Товардын толук сүрөттөмөсү..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                </div>

                {/* Сүрөт URL */}
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Сүрөт URL (https://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
                </div>

                {/* Жаңы товар же эски (Switch) */}
                <div onClick={() => setIsNew(!isNew)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${isNew ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-transparent'}`}>
                  <div className="flex items-center gap-3">
                    <Sparkles className={isNew ? "text-indigo-600" : "text-slate-400"} />
                    <span className={`font-bold text-xs uppercase tracking-widest ${isNew ? 'text-indigo-600' : 'text-slate-500'}`}>Бул жаңы товар (New Collection)</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-all ${isNew ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isNew ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>

                {/* Preview */}
                {imageUrl && (
                  <div className="p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center">
                    <img src={imageUrl} alt="Preview" className="h-32 object-contain mix-blend-multiply" onError={(e) => e.currentTarget.src="https://placehold.co/200x200?text=Error"} />
                    <p className="text-[10px] text-slate-400 mt-2 italic uppercase">Сүрөттү алдын ала көрүү</p>
                  </div>
                )}

                <button disabled={isSubmitting} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                  {isSubmitting ? 'Жүктөлүүдө...' : 'Товарды кошуу'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Товарларды башкаруу ({products.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl p-2 flex items-center justify-center">
                        <img src={item.image_url} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-indigo-600 font-black text-xs">{item.price} сом</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded-full font-bold uppercase">{item.category}</span>
                          {item.is_new && <span className="text-[8px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase italic">New</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(item.id)} className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ... Клиенттер тизмеси (Users Tab) кала берет */}
        </main>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default Admin;