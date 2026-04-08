// src/context/LanguageContext.jsx
import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('KG');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); // Эгер user керек болсо

  const translations = {
    KG: { 
      back: "Артка", 
      add_to_cart: "Себетке кошуу", 
      new_model: "Жаңы модель",
      model: "Модель",
      date: "Дата",
      similar_products: "Окшош товарлар",
      price_tag: "сом"
    },
    RU: { 
      back: "Назад", 
      add_to_cart: "Добавить в корзину", 
      new_model: "Новая модель",
      model: "Модель",
      date: "Дата",
      similar_products: "Похожие товары",
      price_tag: "сом"
    },
    // EN вариантын да ушул жерге кошсоңуз болот
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, darkMode, setDarkMode, user, setUser, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};