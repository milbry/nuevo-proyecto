// src/components/Profile.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
// Solo importamos auth y db, ya que Storage está deshabilitado
import { auth, db } from "../firebase.js"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Importaciones Individuales de Iconos (soluciona el error de Vite/SyntaxError)
import { FiUploadCloud } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { FiSave } from "react-icons/fi";
import { FiEdit3 } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";
import { FiInstagram } from "react-icons/fi";
import { FiWhatsapp } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi"; 

// --- URLs de Marcador de Posición ---
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const DEFAULT_COVER = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=60";
const FIXED_GALLERY_IMAGE = "https://images.unsplash.com/photo-1501854140801-50d01698b53e?auto=format&fit=crop&w=600&q=60";

const initialProfileState = {
  displayName: "",
  bio: "",
  photoURL: DEFAULT_AVATAR,
  coverURL: DEFAULT_COVER,
  theme: "light",
  public: true,
  instagramUrl: "",
  whatsappNumber: "",
};

export default function Profile() {
  const nav = useNavigate();
  // Inicializamos user con el usuario actual o null
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState(initialProfileState);
  const [originalProfileData, setOriginalProfileData] = useState(initialProfileState);
  
  // Estados de carga de archivos (Deshabilitados para no usar Storage)
  const [isUploadingAvatar] = useState(false);
  const [isUploadingCover] = useState(false);
  const [isUploadingGallery] = useState(false);
  
  // gallery & stats
  const [gallery, setGallery] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const fileInputRef = useRef();
  const coverInputRef = useRef();
  const galleryInputRef = useRef();

  // Detección de cambios
  const hasChanges = Object.keys(profileData).some(key => 
    profileData[key] !== originalProfileData[key]
  );

  // 1. Manejo de Autenticación y Redirección
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      // Solo establecemos loading a false si ya tenemos el estado de auth
      setLoading(false); 
      if (!u) {
        nav("/auth");
      }
    });
    return () => unsubAuth();
  }, [nav]);

  // 2. Carga Inicial del Perfil desde Firestore
  useEffect(() => {
    // Si el usuario no existe o loading sigue siendo true, salimos
    if (!user || loading) return; 
    
    const refDoc = doc(db, "profiles", user.uid);
    
    const unsubProfile = onSnapshot(refDoc, (d) => {
      const baseData = {
        ...initialProfileState,
        displayName: user.displayName || "Usuario Nuevo",
      };

      if (d.exists()) {
        const data = d.data();
        const loadedData = {
          displayName: data.displayName || baseData.displayName,
          bio: data.bio || baseData.bio,
          photoURL: data.photoURL || DEFAULT_AVATAR, 
          coverURL: data.coverURL || DEFAULT_COVER,
          theme: data.theme || baseData.theme,
          public: data.public ?? baseData.public,
          instagramUrl: data.instagramUrl || baseData.instagramUrl,
          whatsappNumber: data.whatsappNumber || baseData.whatsappNumber,
        };
        setProfileData(loadedData);
        setOriginalProfileData(loadedData);
      } else {
        // Si no existe el documento, inicializamos con datos base
        setProfileData(baseData);
        setOriginalProfileData(baseData);
        // Opcional: Podrías crear el documento base aquí si quieres forzar su existencia.
      }
    });

    return () => unsubProfile();
  }, [user, loading]); // Depende de user y loading

  // 3. Carga de Galería y Contadores
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "profiles", user.uid, "gallery"),
      orderBy("createdAt", "desc")
    );
    const unsubGallery = onSnapshot(q, (snap) => setGallery(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubFollowers = onSnapshot(collection(db, "followers", user.uid, "list"), (snap) => setFollowers(snap.size));
    const unsubFollowing = onSnapshot(collection(db, "following", user.uid, "list"), (snap) => setFollowing(snap.size));
    
    return () => { unsubGallery(); unsubFollowers(); unsubFollowing(); };
  }, [user]);

  
  // --- FUNCIÓNES DE ARCHIVOS SIMULADAS (NO USAN FIREBASE STORAGE) ---
  
  // Simulación: Alerta y actualiza a una URL temporal (opcional)
  async function handleAvatarChange(file) {
    alert("¡AVISO! La subida de archivos está desactivada (Firebase Storage no está activo).");
    const tempUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"; 
    await setDoc(doc(db, "profiles", user.uid), { photoURL: tempUrl }, { merge: true });
  }

  async function handleCoverChange(file) {
    alert("¡AVISO! La subida de archivos está desactivada (Firebase Storage no está activo).");
    const tempUrl = "https://images.unsplash.com/photo-1557683315-328639014f3b?q=80&w=1600&auto=format&fit=crop"; 
    await setDoc(doc(db, "profiles", user.uid), { coverURL: tempUrl }, { merge: true });
  }

  // Añade un item de Galería usando una URL fija y lo guarda en Firestore
  async function handleGalleryUpload() {
    // Usamos esta función directamente en el botón, sin esperar un archivo
    setIsUploadingGallery(true);
    try {
      await addDoc(collection(db, "profiles", user.uid, "gallery"), {
        url: FIXED_GALLERY_IMAGE, 
        path: null, 
        createdAt: serverTimestamp(),
      });
      alert("Elemento de galería añadido (URL fija).");
    } catch (e) {
      console.error(e);
      alert(`Error al añadir elemento: ${e.message}`);
    } finally {
      // Aunque no hay subida real, simulamos la finalización
      setIsUploadingGallery(false); 
    }
  }

  // Solo borra el documento de Firestore
  async function removeGalleryItem(item) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return;
    try {
      await deleteDoc(doc(db, "profiles", user.uid, "gallery", item.id));
      alert("Elemento de galería eliminado (solo Firestore).");
    } catch (e) {
      console.error(e);
      alert("Error al eliminar el elemento.");
    }
  }


  // Guardar datos del perfil
  async function saveProfile() {
    if (!hasChanges) {
        alert("No hay cambios que guardar.");
        return;
    }
    try {
        await setDoc(
            doc(db, "profiles", user.uid),
            {
                displayName: profileData.displayName,
                bio: profileData.bio,
                theme: profileData.theme,
                public: profileData.public,
                instagramUrl: profileData.instagramUrl,
                whatsappNumber: profileData.whatsappNumber,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );
        
        setOriginalProfileData(profileData);
        alert("✅ Perfil guardado con éxito.");
    } catch (e) {
        console.error(e);
        alert("❌ Error al guardar el perfil.");
    }
  }

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getWhatsappLink = () => {
    const num = profileData.whatsappNumber.replace(/[^0-9]/g, '');
    if (num) {
      return `https://wa.me/${num}?text=Hola%20soy%20${encodeURIComponent(profileData.displayName)}`;
    }
    return "#";
  };
  
  const getInstagramLink = () => {
    if (profileData.instagramUrl && !profileData.instagramUrl.startsWith('http')) {
        return `https://${profileData.instagramUrl}`;
    }
    return profileData.instagramUrl || "#";
  };

  // --- Renderizado Condicional ---

  // 1. Mostrar Cargando
  if (loading) return <div className="p-6 text-center text-xl min-h-screen flex items-center justify-center bg-gray-50">Cargando perfil...</div>;
  
  // 2. Si no hay usuario (debería redirigir, pero es una protección)
  if (!user) return null; 

  // --- Clases de Tema ---
  const isDark = profileData.theme === "dark";
  const isJungle = profileData.theme === "jungle";
  const themeClass = isDark ? "bg-gray-900 text-white" : isJungle ? "bg-gradient-to-b from-green-50 to-green-100" : "bg-white";
  const cardClass = isDark ? "bg-gray-800 shadow-lg text-white" : "bg-white shadow-lg";
  const inputClass = isDark ? "p-3 border rounded border-gray-700 bg-gray-700 text-white" : "p-3 border rounded";
  const primaryButtonClass = "bg-green-700 hover:bg-green-600 text-white transition duration-150";

  return (
    <div className={`min-h-screen pb-12 ${themeClass}`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        {/* COVER */}
        <div className="relative">
          <div style={{ backgroundImage: `url(${profileData.coverURL})` }}
            className="h-56 bg-cover bg-center rounded-b-2xl shadow-md" />
          <label className={`absolute right-6 top-4 ${cardClass.split(' ')[0]} ${cardClass.split(' ')[2]} text-sm px-3 py-1 rounded-full cursor-pointer flex items-center gap-2 hover:bg-opacity-90 transition`}>
            <span className="text-red-500">❌ Desactivado</span>
            {/* El input se mantiene solo para simular, pero está deshabilitado */}
            <input ref={coverInputRef} type="file" className="hidden" 
                   accept="image/*"
                   disabled={true} 
                   onChange={e => handleCoverChange(e.target.files?.[0])} />
          </label>
        </div>

        <div className="max-w-5xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8">
          <div className={`${cardClass} rounded-2xl p-6 flex flex-col md:flex-row gap-6 mb-8`}>
            
            {/* AVATAR + BIO */}
            <div className="w-full md:w-48 flex-shrink-0 text-center">
              <div className="relative inline-block">
                <img 
                  src={profileData.photoURL} 
                  alt="avatar" 
                  className={`w-40 h-40 rounded-full border-4 ${isDark ? "border-gray-900" : "border-white"} shadow-lg object-cover mx-auto`} 
                />
                <label className={`absolute right-0 bottom-0 ${primaryButtonClass} text-white text-xs px-2 py-1 rounded-full cursor-pointer flex items-center gap-1`}>
                  <span className="text-red-500">❌</span>
                  {/* El input se mantiene solo para simular, pero está deshabilitado */}
                  <input ref={fileInputRef} type="file" className="hidden" 
                         accept="image/*"
                         disabled={true} 
                         onChange={e => handleAvatarChange(e.target.files?.[0])} />
                </label>
              </div>

              <div className="mt-4">
                <div className="text-xl font-bold">{profileData.displayName}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{profileData.bio || "Comparte algo sobre ti..."}</div>
              </div>
            </div>

            {/* INFO PRINCIPAL + ESTADÍSTICAS */}
            <div className="flex-1 pt-4 md:pt-0">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                
                {/* Estadísticas */}
                <div className="flex gap-6 mb-4 md:mb-0">
                  <div className="text-center">
                    <div className="font-bold text-xl">{gallery.length}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Publicaciones</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{followers}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{following}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Siguiendo</div>
                  </div>
                </div>

                {/* Controles de Guardado y Privacidad */}
                <div className="flex gap-3">
                  <button onClick={() => handleChange('public', !profileData.public)} 
                          className={`px-3 py-1 rounded flex items-center gap-1 transition duration-150 ${profileData.public ? "border border-green-600 text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-300" : "border border-red-600 text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300"}`}>
                    {profileData.public ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                    {profileData.public ? "Público" : "Privado"}
                  </button>
                  
                  <button onClick={saveProfile} 
                          disabled={!hasChanges}
                          className={`${primaryButtonClass} px-4 py-1 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
                    <FiSave className="w-4 h-4" />
                    {hasChanges ? "Guardar Cambios" : "Guardado"}
                  </button>
                </div>
              </div>

              {/* Links Sociales Dinámicos */}
              <div className="mt-4 flex flex-wrap gap-3 items-center border-t pt-4 border-gray-100 dark:border-gray-700">
                
                {profileData.whatsappNumber && (
                    <a className="text-sm px-3 py-1 border rounded flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition" 
                       href={getWhatsappLink()} target="_blank" rel="noreferrer">
                        <FiWhatsapp className="w-4 h-4" /> WhatsApp
                    </a>
                )}
                
                {profileData.instagramUrl && (
                    <a className="text-sm px-3 py-1 border rounded flex items-center gap-1 text-pink-600 border-pink-600 hover:bg-pink-50 dark:hover:bg-gray-700 transition" 
                       href={getInstagramLink()} target="_blank" rel="noreferrer">
                        <FiInstagram className="w-4 h-4" /> Instagram
                    </a>
                )}
                
                <span className="text-sm px-3 py-1 bg-amber-100 rounded text-amber-700">Badge: Nuevo</span>
                <span className="text-sm px-3 py-1 bg-green-100 rounded text-green-700">Nivel: 1</span>
              </div>

              {/* editable fields */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  value={profileData.displayName} 
                  onChange={e => handleChange('displayName', e.target.value)} 
                  className={inputClass} 
                  placeholder="Nombre" 
                />
                <select 
                  value={profileData.theme} 
                  onChange={e => handleChange('theme', e.target.value)} 
                  className={inputClass}
                >
                  <option value="light">Tema: Claro</option>
                  <option value="dark">Tema: Oscuro</option>
                  <option value="jungle">Tema: Selva</option>
                </select>
                
                <input 
                  value={profileData.whatsappNumber} 
                  onChange={e => handleChange('whatsappNumber', e.target.value)} 
                  className={inputClass} 
                  placeholder="Número de WhatsApp (ej: 51999888777)" 
                />
                <input 
                  value={profileData.instagramUrl} 
                  onChange={e => handleChange('instagramUrl', e.target.value)} 
                  className={inputClass} 
                  placeholder="Link de Instagram (ej: instagram.com/mi_perfil)" 
                />
                
                <textarea 
                  value={profileData.bio} 
                  onChange={e => handleChange('bio', e.target.value)} 
                  className={`${inputClass} md:col-span-2`} 
                  placeholder="Biografía" 
                />
              </div>
            </div>
          </div>

          {/* GALLERY */}
          <div className={`${cardClass} rounded-2xl p-6`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold">Galería ({gallery.length})</h3>
              <button onClick={handleGalleryUpload} className={`${primaryButtonClass} px-4 py-2 rounded-full cursor-pointer flex items-center gap-2`}>
                <FiUploadCloud className="w-4 h-4" /> Añadir Foto Fija
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.length === 0 ? (
                <div className="text-slate-500 dark:text-slate-400 col-span-full py-8 text-center">
                  Aún no hay fotos en tu galería. Añade un elemento fijo para simular.
                </div>
              ) : (
                gallery.map(item => (
                  <motion.div key={item.id} className="relative group overflow-hidden rounded-lg shadow-md" 
                              initial={{ scale: 0.9, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }} 
                              transition={{ duration: 0.3 }}>
                    {/* Usamos item.url que viene de Firestore (URL Fija) */}
                    <img src={item.url} alt="Galería" className="w-full h-40 object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <button onClick={() => removeGalleryItem(item)} 
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-sm flex items-center gap-1 transition transform hover:scale-110">
                        <FiTrash2 className="w-4 h-4" /> Eliminar (Firestore)
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVIDAD & LOGROS (manteniendo estructura) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Actividad */}
            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Actividad reciente</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-500">●</span> Has guardado el perfil.</li>
                <li className="flex items-center gap-2"><span className="text-green-500">●</span> Recibiste 12 likes en tu último post.</li>
                <li className="flex items-center gap-2"><span className="text-green-500">●</span> Completaste 2 retos.</li>
              </ul>
            </div>

            {/* Logros */}
            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Logros</h4>
              <div className="mt-3 flex flex-col gap-2">
                <div className="p-2 border rounded flex items-center justify-between dark:border-gray-700">
                  <div><div className="font-semibold">Iniciado</div><div className="text-xs text-slate-500 dark:text-slate-400">Bienvenido a GreenMag</div></div>
                  <div className="text-lg text-green-700">✔</div>
                </div>
                <div className="p-2 border rounded flex items-center justify-between dark:border-gray-700">
                  <div><div className="font-semibold">Primera foto</div><div className="text-xs text-slate-500 dark:text-slate-400">Subiste tu primera imagen</div></div>
                  <div className="text-lg text-green-700">🏆</div>
                </div>
              </div>
            </div>

            {/* Preferencias (Resumen) */}
            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Preferencias</h4>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <div>Perfil público: <span className="font-semibold">{profileData.public ? "Sí" : "No"}</span></div>
                <div>Tema activo: <span className="font-semibold">{profileData.theme.charAt(0).toUpperCase() + profileData.theme.slice(1)}</span></div>
                <div>Número WA: <span className="font-semibold">{profileData.whatsappNumber || "No especificado"}</span></div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}