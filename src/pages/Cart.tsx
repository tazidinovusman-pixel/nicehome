import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
const navigate = useNavigate();
  // Жалпы сумма (Баасы * Саны)
  const totalPrice = cartItems?.reduce((acc: number, item: any) =>
    acc + (Number(item.price) * (item.quantity || 1)), 0) || 0;

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
    <div className="max-w-6xl mx-auto px-6 py-16 bg-white">
      <h1 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-16 text-center font-medium">Сиздин тандооңуз</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-10">
          {cartItems.map((item: any) => (
            <div key={item.id} className="flex items-center group border-b border-slate-50 pb-10">
              <div className="w-24 h-32 md:w-32 md:h-40 bg-[#F6F6F6] flex-shrink-0 flex items-center justify-center p-4">
                <img src={item.image_url} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
              </div>

              <div className="ml-6 md:ml-8 flex-grow">
                <h3 className="text-xs md:text-sm font-medium text-slate-800 uppercase tracking-wide">{item.name}</h3>
                <p className="text-sm font-bold text-slate-900 mb-4">{item.price} сом</p>

                {/* ПЛЮС-МИНУС БЛОГУ */}
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100 rounded border"><Minus size={14} /></button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity || 1}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100 rounded border"><Plus size={14} /></button>
                </div>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="p-4 text-slate-300 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#F6F6F6] p-8 md:p-10 sticky top-24">
            <h2 className="text-xs uppercase tracking-widest font-bold mb-8 text-slate-800">Жыйынтык</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Жалпы саны:</span>
                <span className="font-medium text-slate-900">{cartItems.reduce((a: any, b: any) => a + (b.quantity || 1), 0)} шт</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-6">
                <span className="text-sm font-bold text-slate-900">Жалпы сумма:</span>
                <p className="text-xl font-black text-slate-900">{totalPrice} сом</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase"
            >
              Заказды каттоо
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;