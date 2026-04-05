import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]); // Состояние для избранного

  // Переключение избранного (добавить/удалить)
  const toggleFavorite = (product: any) => {
    setFavorites((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const addToCart = (product: any) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, 
      favorites, toggleFavorite // Передаем новые данные
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);