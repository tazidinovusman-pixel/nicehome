import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';

const salesData = [
  { name: 'Янв', sales: 12000 },
  { name: 'Фев', sales: 19000 },
  { name: 'Мар', sales: 15000 },
  { name: 'Апр', sales: 27000 },
  { name: 'Май', sales: 34000 },
  { name: 'Июн', sales: 45000 },
];

const categoryData = [
  { name: 'Дивандар', value: 40, color: '#4f46e5' },
  { name: 'Ашкана', value: 25, color: '#10b981' },
  { name: 'Уктоо', value: 20, color: '#f59e0b' },
  { name: 'Башкалар', value: 15, color: '#64748b' },
];

export default function SiteStatistics({ darkMode }) {
  return (
    <div className="w-full space-y-6 md:space-y-10">
      
      {/* 1. САНДЫК СТАТИСТИКА КАРТАЛАРЫ (Мобилдикте 2 катар, чоң экранда 4 катар) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        
        <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-100'}`}>
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Киреше</p>
            <DollarSign className="text-indigo-600 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight">152K 💰</p>
          <p className="text-[8px] md:text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} /> +14.2%
          </p>
        </div>

        <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-100'}`}>
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Заказдар</p>
            <ShoppingBag className="text-emerald-600 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight">878 +</p>
          <p className="text-[8px] md:text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} /> +8.4%
          </p>
        </div>

        <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-100'}`}>
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Кардарлар</p>
            <Users className="text-amber-500 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight">1,420</p>
          <p className="text-[8px] md:text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} /> +22%
          </p>
        </div>

        <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-100'}`}>
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Конверсия</p>
            <TrendingUp className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight">4.82%</p>
          <p className="text-[8px] md:text-[10px] text-slate-400 font-bold mt-1">Туруктуу</p>
        </div>

      </div>

      {/* 2. ГРАФИКТЕР (Мобилдикте бир катардан астын-үстүн, чоң экранда жанаша жайгашат) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* АЙЛЫК КИРЕШЕ ГРАФИГИ */}
        <div className={`p-4 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] border lg:col-span-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
          <div className="mb-4 md:mb-6">
            <span className="text-[8px] md:text-[9px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">Динамика</span>
            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mt-2">Сатуулардын аналитикасы</h3>
          </div>
          
          {/* h-52 телефондор үчүн, h-72 чоң экрандар үчүн */}
          <div className="w-full h-52 md:h-72 text-[10px] md:text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderRadius: '12px', 
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="sales" name="Сатуу" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ТЕГЕРЕК ГРАФИК (PIE CHART) */}
        <div className={`p-4 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
          <div className="mb-2">
            <span className="text-[8px] md:text-[9px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">Категориялар</span>
            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mt-2">Популярдуу бөлүмдөр</h3>
          </div>

          <div className="w-full h-48 md:h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Телефонго ылайыкталып бир аз кичирейтилди
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-xl font-black text-indigo-600">Топ</p>
              <p className="text-[8px] uppercase font-bold text-slate-400">Эмерек</p>
            </div>
          </div>

          {/* Категориялар тизмеси (Телефондо баары бата тургандай компакттуу) */}
          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] md:text-[11px] font-bold">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500 dark:text-slate-400 truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}