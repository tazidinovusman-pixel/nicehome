import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', city: '', phone: '' });

  const sendToTelegram = async (e: React.FormEvent) => {
    e.preventDefault();

    // Заказдын текстин даярдоо
    const itemsList = cartItems.map((item: any) => `${item.name} (${item.quantity} шт)`).join('\n');
    const message = `
🚀 **ЖАҢЫ ЗАКАЗ!**
👤 Аты: ${formData.name}
📍 Шаары: ${formData.city}
📞 Тел: ${formData.phone}
---
📦 Товарлар:
${itemsList}
---
💰 Жалпы сумма: ${totalPrice} сом
    `;

    // Телеграмга жөнөтүү логикасы (төмөндө караңыз)
    await fetch(`https://api.telegram.org/bot[СЕНИН_БОТ_ТОКЕНИҢ]/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '[СЕНИН_ID]',
        text: message,
        parse_mode: 'Markdown'
      })
    });

    alert("Заказ кабыл алынды! Телеграм аркылуу билдирүү кетти.");
    clearCart();
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white rounded-[2rem] shadow-xl mt-10">
      <h2 className="text-2xl font-black uppercase italic mb-6">Заказды каттоо</h2>
      <form onSubmit={sendToTelegram} className="space-y-4">
        <input 
          type="text" placeholder="Сиздин атыңыз" required 
          className="w-full p-4 bg-slate-50 rounded-2xl border"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="text" placeholder="Шаар / Дарек" required 
          className="w-full p-4 bg-slate-50 rounded-2xl border"
          onChange={(e) => setFormData({...formData, city: e.target.value})}
        />
        <input 
          type="tel" placeholder="Телефон номериңиз" required 
          className="w-full p-4 bg-slate-50 rounded-2xl border"
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest">
          Ырастоо ({totalPrice} сом)
        </button>
      </form>
    </div>
  );
};