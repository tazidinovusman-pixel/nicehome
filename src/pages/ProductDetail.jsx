import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { LanguageContext } from '../App';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShoppingBag, Calendar, Heart, Clock, AlignLeft } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { darkMode, user, lang, translations } = useContext(LanguageContext);
    const { addToCart, toggleFavorite, favorites } = useCart();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    const t = translations[lang] || translations['KG'];
    const isFavorite = favorites?.some(f => f.id === Number(id));

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProductAndSimilar = async () => {
            const { data: mainProduct, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error loading product:", error);
                return;
            }

            if (mainProduct) {
                setProduct(mainProduct);
                if (mainProduct.category) {
                    const { data: similar, error: similarError } = await supabase
                        .from('items')
                        .select('*')
                        .eq('category', mainProduct.category)
                        .not('id', 'eq', id)
                        .limit(4);

                    if (!similarError) setSimilarProducts(similar || []);
                }
            }
        };

        fetchProductAndSimilar();
    }, [id]);

    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const formatDate = (dateString) => {
        if (!dateString) return t.loading;
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === 'RU' ? 'ru-RU' : 'ky-KG');
    };

    if (!product) return (
        <div className={`h-screen flex flex-col justify-center items-center gap-4 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black uppercase tracking-widest text-xs animate-pulse">{t.loading}</p>
        </div>
    );

    return (
        <div className={`min-h-screen p-4 md:p-12 transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className="max-w-6xl mx-auto">

                {/* HEADER NAVIGATION */}
                <div className="flex justify-between items-center mb-8 md:mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] opacity-50 hover:opacity-100 transition-all"
                    >
                        <ChevronLeft size={20} /> {t.back}
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            !user ? navigate('/auth') : addToCart(item);
                        }}
                        // БУЛ ЖЕРДЕ opacity-0 ЖАНА group-hover АЛЫП САЛЫНДЫ
                        className="absolute bottom-4 right-4 bg-slate-900 text-white p-3 shadow-lg rounded-2xl active:scale-90 transition-all transform"
                    >
                        <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* IMAGE SECTION */}
                    <div className={`rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 flex items-center justify-center relative overflow-hidden group min-h-[400px] ${darkMode ? 'bg-slate-900' : 'bg-slate-50 shadow-2xl shadow-slate-200'}`}>
                        <img
                            src={product.image_url}
                            className="w-full h-auto max-h-[500px] object-contain z-10 transform group-hover:scale-110 transition-transform duration-1000"
                            alt={product.name}
                        />
                    </div>

                    {/* INFO SECTION */}
                    <div className="flex flex-col pt-4">
                        <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
                            {product.is_new && (
                                <span className="bg-emerald-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    {t.new_model}
                                </span>
                            )}
                            <span className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-600/20">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black italic uppercase mb-6 tracking-tighter leading-[0.95]">
                            {product.name}
                        </h1>

                        <div className="flex flex-col gap-4 mb-6">
                            <span className="text-5xl md:text-6xl font-black text-indigo-600">
                                {formatPrice(product.price)} <span className="text-xl md:text-2xl">{t.price_tag}</span>
                            </span>
                        </div>

                        {/* DESCRIPTION SECTION (Сүрөттөмө) */}
                        <div className="mb-8 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-3 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                                <AlignLeft size={16} /> {t.description || "Description / Сүрөттөмө"}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base italic">
                                {product.description || (lang === 'RU' ? "Описание товара временно отсутствует." : "Товар жөнүндө маалымат убактылуу жок.")}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 md:gap-6 mb-10">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Calendar size={16} className="text-indigo-500" />
                                {t.model}: {product.year || 2026}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={16} className="text-emerald-500" />
                                {t.date}: {formatDate(product.created_at)}
                            </div>
                        </div>

                        <button
                            onClick={() => !user ? navigate('/auth') : addToCart(product)}
                            className="py-6 md:py-7 bg-slate-900 dark:bg-white dark:text-black text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-lg md:text-xl flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-indigo-500/20"
                        >
                            <ShoppingBag /> {t.add_to_cart}
                        </button>
                    </div>
                </div>

                {/* SIMILAR PRODUCTS */}
                {similarProducts.length > 0 && (
                    <div className="mt-24 border-t dark:border-slate-800 pt-16">
                        <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tighter">
                            {t.similar_products}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {similarProducts.map((item) => (
                                <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="group cursor-pointer">
                                    <div className={`aspect-square rounded-[2rem] p-6 mb-4 flex items-center justify-center transition-all group-hover:scale-95 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain transform group-hover:rotate-6 transition-transform" />
                                    </div>
                                    <h3 className="font-bold text-sm mb-1 truncate uppercase">{item.name}</h3>
                                    <p className="text-indigo-600 font-black text-lg">{formatPrice(item.price)} {t.price_tag}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;