import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // 1. Состояниелерди LocalStorage-ден жүктөө менен баштайбыз
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const savedCart = localStorage.getItem('nicehome_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favorites, setFavorites] = useState<any[]>(() => {
    const savedFavs = localStorage.getItem('nicehome_favs');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // 2. Маалымат өзгөргөн сайын LocalStorage-ке автоматтык түрдө сактоо
  useEffect(() => {
    localStorage.setItem('nicehome_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('nicehome_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product: any) => {
    setFavorites((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // 3. Добавить в корзину (Санды эсептөө менен)
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 4. Санды көбөйтүү/азайтуу функциясы (+ / -)
  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  // 5. Өчүрүүнү ID боюнча кылабыз (индекс эмес, коопсуз болуш үчүн)
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      favorites, toggleFavorite 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);