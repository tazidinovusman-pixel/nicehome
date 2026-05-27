import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient'; // ⚠️ Эгер ката берсе, бул жердеги жолду тууралаңыз (мисалы: ../../api/supabaseClient)
import { Trash2, Image, Loader2, RefreshCw, Megaphone } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // СУПАБЕЙСТЕН БАРДЫК ЖАРНАМАЛАРДЫ АЛЫП КЕЛҮҮ
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      alert('Жарнамаларды жүктөөдө ката кетти: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 🔥 СУПАБЕЙСТЕН ЖАНА ЭКРАНДАН ДАРОО ӨЧҮРҮҮ ФУНКЦИЯСЫ
  const handleDeleteBanner = async (id, title) => {
    const confirmDelete = window.confirm(`Чын эле "${title}" жарнамасын өчүрүүнү каалайсызбы? Бул аракет Супабейстен да өчүрөт!`);
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      // 1. Супабейс базасынан өчүрүү
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 2. Базадан өчкөндөн кийин экрандан дароо алып салуу
      setBanners(banners.filter(banner => banner.id !== id));
      alert('Жарнама ийгиликтүү өчүрүлдү!');
    } catch (error) {
      alert('Өчүрүүдө ката кетти: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs uppercase tracking-widest font-bold">Жарнамалар жүктөлүүдө...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#111827] text-white rounded-[2rem] p-6 sm:p-8 border border-slate-800 shadow-xl">
      {/* ЖОГОРКУ БӨЛҮК */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider">Жарнамаларды Башкаруу</h2>
            <p className="text-xs text-slate-400 mt-0.5">Супабейстеги бардык активдүү баннерлердин тизмеси</p>
          </div>
        </div>
        <button 
          onClick={fetchBanners}
          className="p-2.5 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all border border-slate-700 text-white"
          title="Жаңылоо"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ЖАРНАМАЛАРДЫН ТИЗМЕСИ */}
      {banners.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium">Азырынча эч кандай жарнама кошула элек.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => {
            // Баннердеги биринчи бар болгон сүрөттү таап алуу
            const bannerImg = banner.image_url1 || banner.image_url2 || banner.image_url3 || banner.image_url4;

            return (
              <div 
                key={banner.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Сүрөтү */}
                  <div className="w-20 h-14 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 relative">
                    {bannerImg ? (
                      <img src={bannerImg} alt={banner.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Image size={18} />
                      </div>
                    )}
                  </div>

                  {/* Текст маалыматтары */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {banner.description || 'Описание жазылган эмес.'}
                    </p>
                    {banner.price && (
                      <span className="inline-block text-[11px] font-bold text-amber-400 mt-1 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {banner.price} сом
                      </span>
                    )}
                  </div>
                </div>

                {/* 🔥 ӨЧҮРҮҮ БАСКЫЧЫ */}
                <button
                  onClick={() => handleDeleteBanner(banner.id, banner.title)}
                  disabled={deletingId === banner.id}
                  className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0"
                  title="Супабейстен өчүрүү"
                >
                  {deletingId === banner.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}