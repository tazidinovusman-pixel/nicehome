import React, { useState } from 'react';
import { useCart } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';

const TELEGRAM_BOT_TOKEN = '8755814613:AAGVeQEddJH5So2B0a_gWl-XVmJZ3assyR8';
const TELEGRAM_CHAT_ID = '1759939164';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', city: '', phone: '' });
  const navigate = useNavigate();

  const sendToTelegram = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Корзина бош!");
      return;
    }

    // Заказдын текстин түзүү
    const itemsList = cartItems.map((item: any) => `• ${item.name} (${item.quantity || 1} шт)`).join('\n');
    
    const message = `🚀 *ЖАҢЫ ЗАКАЗ!*\n\n` +
                    `👤 *Аты:* ${formData.name}\n` +
                    `📍 *Шаары:* ${formData.city}\n` +
                    `📞 *Тел:* ${formData.phone}\n` +
                    `\n---\n` +
                    `📦 *Товарлар:*\n${itemsList}\n` +
                    `\n---\n` +
                    `💰 *Жалпы сумма:* ${totalPrice} сом`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        alert("Заказ кабыл алынды! Телеграм аркылуу билдирүү кетти.");
        clearCart();
        navigate('/'); 
      } else {
        const errorData = await response.json();
        alert("Ката кетти: " + errorData.description);
      }
    } catch (err) {
      console.error(err);
      alert("Интернетти текшериңиз же VPN өчүрүп көрүңүз.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-900">
        <h2 className="text-2xl font-black italic uppercase">Корзинаңыз бош!</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold uppercase underline tracking-widest">
          Дүкөнгө кайтуу
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-10 bg-white rounded-[2rem] shadow-2xl mt-10 mb-10 border border-slate-100">
      <h2 className="text-3xl font-black uppercase italic mb-8 text-slate-900 text-center tracking-tighter">
        Форманы толтуруңуз
      </h2>
      <form onSubmit={sendToTelegram} className="space-y-5">
        <div>
          <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest text-slate-900">Сиздин атыңыз</label>
          <input 
            type="text" placeholder="Атыңыз..." required 
            className="w-full p-5 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-inner"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest text-slate-900">Шаарыңыз / Дарегиңиз</label>
          <input 
            type="text" placeholder="Мисалы: Бишкек..." required 
            className="w-full p-5 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-inner"
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest text-slate-900">Телефон номериңиз</label>
          <input 
            type="tel" placeholder="0700 123 456" required 
            className="w-full p-5 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-inner"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200">
          Заказды ырастоо ({totalPrice} сом)
        </button>
      </form>
    </div>
  );
};

export default Checkout;