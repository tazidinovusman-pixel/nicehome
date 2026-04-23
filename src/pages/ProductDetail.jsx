import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { LanguageContext } from '../App';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, ShoppingBag, Calendar, Heart, Clock, AlignLeft } from 'lucide-react';
// Импорттордун арасына буларды кошуп кой:
// import {    ChevronLeft,  ChevronRight,  Heart,  ShoppingBag,  AlignLeft,   } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(0);

    const { darkMode, user, lang, translations } = useContext(LanguageContext);
    const { addToCart, toggleFavorite, favorites } = useCart();


    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    // ПИКИРЛЕР ҮЧҮН STATE
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");

    const t = translations[lang] || translations['KG'];
    const isFavorite = favorites?.some(f => f.id === Number(id));

    // 1. ПИКИРЛЕРДИ БАЗАДАН АЛЫП КЕЛҮҮ ФУНКЦИЯСЫ
    // 1. ПИКИРЛЕРДИ АЛЫП КЕЛҮҮ (ОҢДОЛДУ)
    // 1. ПИКИРЛЕРДИ АЛЫП КЕЛҮҮ (ОҢДОЛДУ)
    // 1. АЛЫП КЕЛҮҮ ФУНКЦИЯСЫ
    // 1. Пикирлерди алуу (Сан же Текст экенин тактайбыз)
    const fetchReviews = async () => {
        if (!id) return;
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', id) // Бул жерде базадагы ID менен дал келиши керек
            .order('created_at', { ascending: false });

        if (!error) {
            setReviews(data || []);
        }
    };

    // 2. Жаңы пикир кошуу
    const handleReview = async () => {
        if (!newReview.trim()) return;

        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                product_id: id,
                user_name: user?.email || "Клиент", // Эгер кирбесе "Клиент" деп жазылат
                text: newReview
            }])
            .select();

        if (error) {
            alert("Ката: " + error.message);
        } else if (data) {
            setReviews((prev) => [data[0], ...prev]);
            setNewReview("");
        }
    };



    // 3. ӨЧҮРҮҮ ФУНКЦИЯСЫ (handleReview'ден БӨЛӨК ТУРУШУ КЕРЕК)
    const deleteReview = async (reviewId) => {
        if (!window.confirm("Бул пикирди өчүрүүнү каалайсызбы?")) return;

        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId);

            if (error) {
                alert("Өчүрүү мүмкүн болгон жок: " + error.message);
            } else {
                setReviews((prevReviews) => prevReviews.filter(rev => rev.id !== reviewId));
            }
        } catch (err) {
            console.error("Күтүлбөгөн ката:", err);
        }
    };
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
        fetchReviews(); // Баракча ачылганда пикирлерди жүктөө
    }, [id]);

    // 2. ПИКИР ЖӨНӨТҮҮ ФУНКЦИЯСЫ (ОҢДОЛГОН ВАРИАНТ)

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
                {/* HEADER */}
                <div className="flex justify-between items-center mb-8 md:mb-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] opacity-50 hover:opacity-100 transition-all">
                        <ChevronLeft size={20} /> {t.back}
                    </button>
                    <button onClick={() => !user ? navigate('/auth') : toggleFavorite(product)} className={`p-4 rounded-full transition-all active:scale-90 shadow-2xl ${isFavorite ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                        <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* PRODUCT INFO */}
                {/* PRODUCT IMAGE & GALLERY SECTION */}
                {/* PRODUCT INFO - СҮРӨТ ЖАНА МААЛЫМАТТАР */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* СОЛ ЖАК: СҮРӨТ ГАЛЕРЕЯСЫ */}
                    <div className="flex flex-col gap-6">
                        {/* НЕГИЗГИ ЧОҢ СҮРӨТ */}
                        <div className={`rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 flex items-center justify-center relative overflow-hidden group min-h-[400px] ${darkMode ? 'bg-slate-900' : 'bg-slate-50 shadow-2xl shadow-slate-200'}`}>
                            <img
                                src={product.image_urls && product.image_urls[activeImage] ? product.image_urls[activeImage] : product.image_url}
                                className="w-full h-auto max-h-[500px] object-contain z-10 transform group-hover:scale-105 transition-all duration-700"
                                alt={product.name}
                            />

                            {/* СТРЕЛКАЛАР */}
                            {product.image_urls?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImage(prev => prev === 0 ? product.image_urls.length - 1 : prev - 1)}
                                        className="absolute left-6 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage(prev => prev === product.image_urls.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-6 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* КИЧИНЕКЕЙ СҮРӨТТӨР (THUMBNAILS) */}
                        {product.image_urls?.length > 1 && (
                            <div className="flex justify-center gap-4 px-4">
                                {product.image_urls.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] overflow-hidden transition-all duration-300 border-2 ${activeImage === index
                                            ? 'border-indigo-600 scale-110 shadow-lg shadow-indigo-500/20'
                                            : 'border-transparent opacity-50 hover:opacity-100'
                                            } ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain p-2" alt={`${product.name} ${index}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ОҢ ЖАК: МААЛЫМАТТАР, БААСЫ ЖАНА КОРЗИНА */}
                    <div className="flex flex-col pt-4">
                        <div className="flex flex-wrap gap-3 mb-6">
                            {product.is_new && <span className="bg-emerald-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">{t.new_model}</span>}
                            <span className="bg-indigo-600/10 text-indigo-600 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-600/20">{product.category}</span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black italic uppercase mb-6 tracking-tighter leading-[0.95]">{product.name}</h1>

                        <span className="text-5xl md:text-6xl font-black text-indigo-600 mb-8">
                            {formatPrice(product.price)} <span className="text-xl md:text-2xl">{t.price_tag}</span>
                        </span>

                        {/* DESCRIPTION БӨЛҮГҮ */}
                        <div className="mb-8 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-3 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                                <AlignLeft size={16} /> {t.description || "Description"}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base italic">
                                {product.description || "Сүрөттөмө жок."}
                            </p>
                        </div>

                        {/* КОРЗИНАГА КОШУУ БАСКЫЧЫ */}
                        <button
                            onClick={() => !user ? navigate('/auth') : addToCart(product)}
                            className="py-6 bg-slate-900 dark:bg-white dark:text-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all shadow-2xl shadow-indigo-500/20"
                        >
                            <ShoppingBag /> {t.add_to_cart}
                        </button>
                    </div>
                </div>

               

                {/* OKSHOSH TOVARLAR SECTION */}
                {similarProducts.length > 0 && (
                    <div className="mt-20 border-t dark:border-slate-800 pt-16">
                        <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tighter">
                            {t.similar_products || "Окшош товарлар"}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {similarProducts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    className="group cursor-pointer flex flex-col gap-4"
                                >
                                    {/* СҮРӨТ КОНТЕЙНЕРИ */}
                                    <div className={`aspect-square rounded-[2rem] p-6 flex items-center justify-center relative transition-all duration-500 overflow-hidden ${darkMode ? 'bg-slate-900 group-hover:bg-slate-800' : 'bg-slate-50 group-hover:bg-slate-100 shadow-xl shadow-slate-100'}`}>

                                        {/* ЖҮРӨКЧӨ (FAVORITES) БАСКЫЧЫ */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Бул маанилүү! Басканда продуктка кирип кетпейт
                                                toggleFavorite(item);
                                            }}
                                            className="absolute top-4 right-4 z-20 p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
                                        >
                                            <Heart
                                                size={18}
                                                fill={favorites.some(fav => fav.id === item.id) ? "currentColor" : "none"}
                                                className={favorites.some(fav => fav.id === item.id) ? "text-red-500" : "text-white"}
                                            />
                                        </button>

                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* ТЕКСТ БӨЛҮГҮ */}
                                    <div>
                                        <h3 className="font-black uppercase text-xs tracking-tighter mb-1 truncate">{item.name}</h3>
                                        <p className="text-indigo-600 font-black text-sm">{formatPrice(item.price)} {t.price_tag}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
 {/* ПИКИРЛЕР (REVIEWS) SECTION */}
                <div className="mt-20 border-t dark:border-slate-800 pt-16">
                    <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tighter">
                        Пикирлер ({reviews.length})
                    </h2>

                    {/* ПИКИР ЖАЗУУ БӨЛҮГҮ (Эми баарына көрүнөт) */}
                    <div className="mb-12 flex flex-col gap-4">
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Оюңузду калтырыңыз..."
                            className="w-full p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all italic text-slate-900 dark:text-white"
                            rows={3}
                        />
                        <button
                            onClick={handleReview}
                            disabled={!newReview.trim()}
                            className="self-end px-10 py-4 bg-indigo-600 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            Жөнөтүү
                        </button>
                    </div>

                    {/* ПИКИРЛЕРДИН ТИЗМЕСИ */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((rev, index) => (
                                <div key={index} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                                                    {rev.user_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {rev.user_name?.split('@')[0]}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                {rev.text}
                                            </p>
                                        </div>

                                        {/* ӨЧҮРҮҮ БАСКЫЧЫ */}
                                        {(user?.email === rev.user_name || user?.email === 'admin@gmail.com') && (
                                            <button
                                                onClick={() => deleteReview(rev.id)}
                                                className="text-[10px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all flex-shrink-0"
                                            >
                                                Өчүрүү
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 italic text-sm">Азырынча пикирлер жок.</p>
                        )}
                    </div>

                </div>

        </div>
    );
};

export default ProductDetail;