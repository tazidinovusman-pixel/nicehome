import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

// Добавляем описание типа товара, чтобы TypeScript не ругался
interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const Cart = () => {
  // Извлекаем данные из контекста. Убедись, что в CartContext есть clearCart
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Считаем итоговую сумму (acc: number, item: CartItem — указываем типы здесь)
  const totalPrice = cartItems?.reduce((acc: number, item: CartItem) => acc + (Number(item.price) || 0), 0) || 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeIn bg-white">
        <div className="bg-[#F6F6F6] p-12 rounded-full mb-8">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400 font-medium">Корзинаңыз бош</h2>
        <Link to="/" className="mt-8 text-slate-900 text-sm font-bold border-b border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Дүкөнгө кайтуу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 animate-fadeIn bg-white">
      <h1 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-16 text-center font-medium">
        Сиздин тандооңуз
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Список товаров (Занимает 8 колонок из 12) */}
        <div className="lg:col-span-8 space-y-10">
          {cartItems.map((item: CartItem, index: number) => (
            <div key={`${item.id}-${index}`} className="flex items-center group border-b border-slate-50 pb-10">
              {/* Фото на сером фоне в стиле minim */}
              <div className="w-32 h-40 bg-[#F6F6F6] overflow-hidden flex-shrink-0 flex items-center justify-center p-4 transition-colors group-hover:bg-[#F0F0F0]">
                <img 
                  src={item.image_url} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                  alt={item.name} 
                />
              </div>
              
              <div className="ml-8 flex-grow space-y-1">
                <h3 className="text-sm font-medium text-slate-800 uppercase tracking-wide">{item.name}</h3>
                <p className="text-sm font-bold text-slate-900">{item.price} <span className="text-[10px] font-normal text-slate-400">сом</span></p>
              </div>

              <button 
                onClick={() => removeFromCart(index)}
                className="p-4 text-slate-300 hover:text-red-400 transition-colors"
                title="Өчүрүү"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Итоговый чек (Занимает 4 колонки из 12) */}
        <div className="lg:col-span-4">
          <div className="bg-[#F6F6F6] p-10 sticky top-24">
            <h2 className="text-xs uppercase tracking-widest font-bold mb-8 text-slate-800">Жыйынтык</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Товарлар саны:</span>
                <span className="font-medium text-slate-900">{cartItems.length}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-6">
                <span className="text-sm font-bold text-slate-900">Жалпы сумма:</span>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">{totalPrice} сом</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                  alert("Заказ кабыл алынды! NiceHome тандаганыңыз үчүн рахмат.");
                  clearCart?.(); // Вызываем, если функция существует
              }}
              className="w-full bg-slate-900 text-white py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Заказды каттоо
            </button>
            
            <p className="text-[10px] text-slate-400 text-center mt-6 uppercase tracking-tight">
              Төлөм кабыл алынгандан кийин жеткирүү башталат
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


