import React, { useState, useEffect } from 'react';
import { supabase } from "../../api/supabaseClient";
import { Trash2, PackagePlus, Tag, Banknote, Image as ImageIcon, PlusCircle } from 'lucide-react';

const Admin = () => {
  // Состояния для формы добавления
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('livingroom');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояние для списка товаров
  const [products, setProducts] = useState<any[]>([]);

  // Функция для загрузки списка товаров
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: false }); // Новые товары будут сверху
    if (!error) setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Функция добавления товара
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('items')
      .insert([{ 
        name, 
        price: Number(price), 
        category, 
        image_url: imageUrl 
      }]);

    if (error) {
      alert('Ката: ' + error.message);
    } else {
      alert('Товар ийгиликтүү кошулду!');
      setName(''); 
      setPrice(''); 
      setImageUrl('');
      fetchProducts(); // Обновляем список сразу после добавления
    }
    setIsSubmitting(false);
  };

  // Функция удаления товара
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Бул товарды өчүрүүнү каалайсызбы?");
    if (confirmDelete) {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) alert("Өчүрүүдө ката кетти: " + error.message);
      else {
        alert("Товар өчүрүлдү!");
        fetchProducts(); // Обновляем список после удаления
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 space-y-12">
      
      {/* ВЕРХНИЙ БЛОК: ФОРМА ДОБАВЛЕНИЯ */}
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg mb-4">
            <PackagePlus className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Жаңы товар кошуу</h2>
        </div>

        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="relative">
            <Tag className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
              placeholder="Товардын аталышы" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="relative">
            <Banknote className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
              type="number" 
              placeholder="Баасы (сом)" 
              value={price}
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
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

          <div className="space-y-4"> {/* Контейнерге аралык кошуу үчүн */}
  <div className="relative">
    <ImageIcon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
    <input 
      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900" 
      placeholder="Сүрөттүн шилтемеси (URL)" 
      value={imageUrl}
      onChange={(e) => setImageUrl(e.target.value)} 
    />
  </div>

  {/* --- СҮРӨТТҮ АЛДЫН АЛА КӨРҮҮ (PREVIEW) --- */}
  {imageUrl && (
    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 animate-in fade-in zoom-in duration-300">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        Сүрөттүн көрүнүшү:
      </p>
      
      <div className="w-40 h-40 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center p-2">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="max-w-full max-h-full object-contain"
          // Эгер шилтеме туура эмес болсо, катаны иштетүү:
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x400?text=Сүрөт+табылган+жок";
          }}
        />
      </div>
      
      <button 
        type="button"
        onClick={() => setImageUrl('')}
        className="mt-3 text-[10px] text-red-500 hover:underline font-medium"
      >
        Шилтемени тазалоо
      </button>
    </div>
  )}
</div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${
              isSubmitting ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Кошулууда...' : 'Товарды кошуу'}
          </button>
        </form>
      </div>

      {/* НИЖНИЙ БЛОК: СПИСОК И УДАЛЕНИЕ */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-slate-200 flex-grow"></div>
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Товарларды башкаруу</h3>
          <div className="h-px bg-slate-200 flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50">
                  <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                  <p className="text-indigo-600 font-black text-sm">{item.price} сом</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.category}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                title="Өчүрүү"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-slate-400 italic">Тизме бош, товар кошуңуз...</p>
        )}
      </div>
    </div>
  );
};

export default Admin;