import React from 'react'; // Добавь эту строку обязательно!
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

// Описание типа товара
interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const Cart = () => {
  // Извлекаем данные из контекста
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Считаем итоговую сумму
  const totalPrice = cartItems?.reduce((acc: number, item: CartItem) => acc + (Number(item.price) || 0), 0) || 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 bg-white">
        <div className="bg-[#F6F6F6] p-12 rounded-full mb-8">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400 font-medium text-center">
          Корзинаңыз бош
        </h2>
        <Link to="/" className="mt-8 text-slate-900 text-sm font-bold border-b border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Дүкөнгө кайтуу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 bg-white">
      <h1 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-16 text-center font-medium">
        Сиздин тандооңуз
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Список товаров */}
        <div className="lg:col-span-8 space-y-10">
          {cartItems.map((item: CartItem, index: number) => (
            <div key={`${item.id}-${index}`} className="flex items-center group border-b border-slate-50 pb-10">
              <div className="w-24 h-32 md:w-32 md:h-40 bg-[#F6F6F6] overflow-hidden flex-shrink-0 flex items-center justify-center p-4">
                <img 
                  src={item.image_url || 'https://via.placeholder.com/150'} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                  alt={item.name} 
                />
              </div>
              
              <div className="ml-6 md:ml-8 flex-grow space-y-1">
                <h3 className="text-xs md:text-sm font-medium text-slate-800 uppercase tracking-wide">{item.name}</h3>
                <p className="text-sm font-bold text-slate-900">{item.price} <span className="text-[10px] font-normal text-slate-400">сом</span></p>
              </div>

              <button 
                onClick={() => removeFromCart(index)}
                className="p-4 text-slate-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Итоговый чек */}
        <div className="lg:col-span-4">
          <div className="bg-[#F6F6F6] p-8 md:p-10 sticky top-24">
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
                  clearCart?.(); 
              }}
              className="w-full bg-slate-900 text-white py-5 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
            >
              <CreditCard className="w-4 h-4" />
              Заказды каттоо
            </button>
            
            <p className="text-[9px] text-slate-400 text-center mt-6 uppercase tracking-tight leading-relaxed">
              Төлөм кабыл алынгандан кийин жеткирүү башталат
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; // Только имя компонента, БЕЗ .tsx


// const Cart = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Твоя корзина 🛒</h1>
//       <p>Тут будут товары, которые ты выбрал для дома.</p>
//       {/* Сюда позже добавим список из LocalStorage или Context */}
//     </div>
//   );
// };

// export default Cart;