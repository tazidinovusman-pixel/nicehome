import React, { useState, useEffect } from 'react';
import { supabase } from "../../api/supabaseClient";
import { Camera, User, Mail, LogOut, Loader2, Edit3, Check } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [bio, setBio] = useState(''); // Био үчүн статус
  const [isEditing, setIsEditing] = useState(false); // Түзөтүү режими

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Колдонуучунун мурунку биосун жүктөө
        setBio(session.user.user_metadata?.bio || '');
      }
      setLoading(false);
    };
    getUser();
  }, []);

  // БИОНУ САКТОО ФУНКЦИЯСЫ
  const updateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { bio: bio }
      });
      if (error) throw error;
      setIsEditing(false);
      alert("Маалымат сакталды!");
    } catch (error) {
      alert("Ката: " + error.message);
    }
  };

  // СҮРӨТ ЖҮКТӨӨ (мурунку функция)
  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      window.location.reload();
    } catch (error) {
      alert('Ката: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20 text-[10px] uppercase tracking-widest">Жүктөлүүдө...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col items-center">
        
        {/* АВАТАР */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-white ring-1 ring-slate-100 flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-200" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-all">
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
            <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
          </label>
        </div>

        {/* EMAIL */}
        <p className="text-sm font-bold text-slate-900 mb-1">{user?.email}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">Кардар</p>

        {/* БИО / ОПИСАНИЕ (Instagram стилинде) */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Описание</span>
            <button onClick={() => isEditing ? updateProfile() : setIsEditing(true)}>
              {isEditing ? <Check className="w-4 h-4 text-green-500" /> : <Edit3 className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
          
          {isEditing ? (
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Өзүңүз жөнүндө жазыңыз..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-700 resize-none p-0"
              rows="3"
              autoFocus
            />
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {bio || "Бул жерге статус же маалымат жазсаңыз болот..."}
            </p>
          )}
        </div>

        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.href = "/auth")}
          className="text-[10px] font-bold text-slate-300 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          Чыгуу
        </button>
      </div>
    </div>
  );
};

export default Profile;