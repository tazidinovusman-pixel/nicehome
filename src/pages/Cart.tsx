import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Форманы көрсөтүү жана маалыматтарды сактоо үчүн state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isOrdering, setIsOrdering] = useState(false);

  // ✅ ТЕЛЕГРАМ БОТТУН ТОКЕНИ КИРГИЗИЛДИ
  const TELEGRAM_BOT_TOKEN = "8755814613:AAGVeQEddJH5So2B0a_gWl-XVmJZ3assyR8"; 
  
  // ⚠️ СЕЙФТИК КАДАМ: Бул жерге @userinfobot берген ID номериңди гана жаз (мисалы: 512345678)
  const TELEGRAM_CHAT_ID = "1759939164"; 

  // Жалпы сумманы эсептөө
  const totalPrice = cartItems?.reduce((acc: number, item: any) =>
    acc + (Number(item.price) * (item.quantity || 1)), 0) || 0;

  // Телеграмга билдирүү жөнөтүү функциясы
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);

    let message = `🚀 *ЖАҢЫ ЗАКАЗ (Nice Home)*\n\n`;
    message += `👤 *Аты:* ${formData.name}\n`;
    message += `📞 *Тел:* ${formData.phone}\n`;
    message += `📍 *Шаары/Дареги:* ${formData.address}\n\n`;
    message += `---\n📦 *Товарлар:*\n`;

    cartItems.forEach((item: any) => {
      message += `• ${item.name} (${item.quantity || 1} шт)\n`;
    });

    message += `\n---\n💰 *Жалпы сумма:* ${totalPrice} сом`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (response.ok) {
        alert("Заказ ийгиликтүү катталды! Телеграм ботко билдирүү жөнөтүлдү.");
        clearCart(); // Себетти тазалоо
        navigate('/'); // Башкы бетке кайтуу
      } else {
        alert("Телеграмга билдирүү жөнөтүүдө ката кетти. CHAT_ID же Токенди кайра текшериңиз.");
      }
    } catch (error) {
      console.error(error);
      alert("Байланыш катасы кетти.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 bg-white">
        <div className="bg-[#F6F6F6] p-12 rounded-full mb-8"><ShoppingBag className="w-12 h-12 text-slate-300" /></div>
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400 font-medium text-center">Корзинаңыз бош</h2>
        <Link to="/" className="mt-8 text-slate-900 text-sm font-bold border-b border-slate-900 pb-1 flex items-center gap-2 transition-all hover:text-indigo-600"><ArrowLeft className="w-4 h-4" /> Дүкөнгө кайтуу</Link>
      </div>
    );
  }

  return (
   <div className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-b from-[#f8fbff] to-white rounded-[40px]">
  <h1 className="text-sm uppercase tracking-[0.4em] text-blue-400 mb-16 text-center font-semibold">
    Сиздин тандооңуз
  </h1>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

    {/* СОЛ ТАРАП */}
    <div className="lg:col-span-8 space-y-10">
      {!showForm ? (
        cartItems.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center group bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="w-24 h-32 md:w-32 md:h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex-shrink-0 flex items-center justify-center p-4">
              <img
                src={item.image_url}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                alt={item.name}
              />
            </div>

            <div className="ml-6 md:ml-8 flex-grow">
              <h3 className="text-xs md:text-sm font-semibold text-slate-800 uppercase tracking-wide mb-2">
                {item.name}
              </h3>

              <p className="text-lg font-black text-blue-700 mb-5">
                {item.price} сом
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-2 hover:bg-blue-100 rounded-xl border border-blue-200 text-blue-700 transition"
                >
                  <Minus size={14} />
                </button>

                <span className="text-sm font-bold w-6 text-center text-slate-800">
                  {item.quantity || 1}
                </span>

                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-2 hover:bg-blue-100 rounded-xl border border-blue-200 text-blue-700 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="p-4 text-slate-300 hover:text-red-500 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))
      ) : (
        /* ФОРМА */
        <form
          onSubmit={handleOrderSubmit}
          className="bg-white p-8 rounded-[32px] space-y-5 border border-blue-100 shadow-xl animate-in fade-in duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase tracking-wider font-black text-slate-800">
              Байланыш маалыматтары
            </h3>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-blue-600 font-bold hover:text-blue-800"
            >
              ← Себетке кайтуу
            </button>
          </div>

          <input
            type="text"
            placeholder="Атыңыз"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50/40 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-slate-900 transition"
          />

          <input
            type="text"
            placeholder="Телефон номериңиз"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50/40 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-slate-900 transition"
          />

          <input
            type="text"
            placeholder="Дарегиңиз (шаар, көчө, үй)"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50/40 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-slate-900 transition"
          />

          <button
            type="submit"
            disabled={isOrdering}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl uppercase tracking-wider hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            {isOrdering
              ? "Жөнөтүлүүдө..."
              : "Заказды каттоо"}
          </button>
        </form>
      )}
    </div>

    {/* ОҢ ТАРАП */}
    <div className="lg:col-span-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10 sticky top-24 rounded-[32px] shadow-2xl shadow-blue-500/20 text-white">
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-blue-100">
          Жыйынтык
        </h2>

        <div className="space-y-6 mb-10">
          <div className="flex justify-between text-sm text-blue-100">
            <span>Жалпы саны:</span>

            <span className="font-bold text-white">
              {cartItems.reduce(
                (a: any, b: any) => a + (b.quantity || 1),
                0
              )}{" "}
              шт
            </span>
          </div>

          <div className="flex justify-between border-t border-blue-400/30 pt-6">
            <span className="text-sm font-bold text-white">
              Жалпы сумма:
            </span>

            <p className="text-3xl font-black text-white">
              {totalPrice} сом
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 bg-white text-blue-700 font-black rounded-2xl uppercase tracking-wider hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300 shadow-xl"
          >
            Заказды каттоо
          </button>
        )}
      </div>
    </div>

  </div>
</div>
  );
};

export default Cart;