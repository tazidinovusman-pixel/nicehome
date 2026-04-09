// src/context/LanguageContext.jsx
import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('KG'); // Демейки тил - Кыргызча
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  const translations = {
    KG: {
      // Sidebar & Tabs
      admin_panel: "Админ Панель",
      add_product: "Жаңы товар",
      manage: "Башкаруу",
      customers: "Клиенттер",
      logout: "Чыгуу",
      // Form fields
      product_name: "Аталышы",
      price: "Баасы (сом)",
      category: "Категория",
      year: "Жылы",
      description: "Сүрөттөмөсү",
      image_url: "Сүрөт URL",
      is_new: "Бул жаңы товар",
      add_btn: "Товарды кошуу",
      loading: "Жүктөлүүдө...",
      // Manage section
      total_products: "Товарлар",
      delete_confirm: "Бул товарды өчүрүүнү каалайсызбы?",
      // Customers section
      registered_customers: "Катталган кардарлар",
      activity: "Жалпы активдүүлүк",
      no_customers: "Азырынча эч ким каттала элек",
    },
    RU: {
      admin_panel: "Админ Панель",
      add_product: "Новый товар",
      manage: "Управление",
      customers: "Клиенты",
      logout: "Выйти",
      product_name: "Название",
      price: "Цена (сом)",
      category: "Категория",
      year: "Год",
      description: "Описание",
      image_url: "Ссылка на фото",
      is_new: "Это новый товар",
      add_btn: "Добавить товар",
      loading: "Загрузка...",
      total_products: "Все товары",
      delete_confirm: "Вы точно хотите удалить этот товар?",
      registered_customers: "Зарегистрированные клиенты",
      activity: "Общая активность",
      no_customers: "Клиенты еще не зарегистрированы",
    },
    EN: {
      admin_panel: "Admin Panel",
      add_product: "Add Product",
      manage: "Manage",
      customers: "Customers",
      logout: "Logout",
      product_name: "Product Name",
      price: "Price (kgs)",
      category: "Category",
      year: "Year",
      description: "Description",
      image_url: "Image URL",
      is_new: "New Arrival",
      add_btn: "Add Product",
      loading: "Loading...",
      total_products: "Total products",
      delete_confirm: "Do you want to delete this product?",
      registered_customers: "Registered Customers",
      activity: "General Activity",
      no_customers: "No customers yet",
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, darkMode, setDarkMode, user, setUser, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};