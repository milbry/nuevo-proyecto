// src/components/Profile.jsx (Versión Final y Diseño Ajustado)

import React, { useEffect, useState } from "react";
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

// --- URLs de Marcador de Posición ---
const FORCED_AVATAR = "https://images.unsplash.com/photo-1594784917637-2911b338e948?q=80&w=300&auto=format&fit=crop"; 
const DEFAULT_COVER = "https://images.unsplash.com/photo-1546252917-a169b50e334a?q=80&w=1600&auto=format&fit=crop";   
const SEED_IMAGE = "https://images.unsplash.com/photo-1502095906208-16e6d1c4481f?q=80&w=300&auto=format&fit=crop"; 

const SEED_TYPES = [
    { name: "Semilla de Girasol", icon: "🌻" },
    { name: "Semilla de Cactus", icon: "🌵" },
    { name: "Semilla de Lavanda", icon: "💜" },
    { name: "Semilla de Bonsái", icon: "🌳" },
];

const initialProfileState = {
  displayName: "",
  bio: "Amante de la jardinería y el cultivo en casa.",
  photoURL: FORCED_AVATAR,
  coverURL: DEFAULT_COVER,
  theme: "jungle",
  public: true,
  instagramUrl: "",
  whatsappNumber: "",
};

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState(initialProfileState);
  const [originalProfileData, setOriginalProfileData] = useState(initialProfileState); 
  
  const [gallery, setGallery] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  // --- Funciones de utilidad ---
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
  // --- Fin de Funciones de utilidad ---

  // Detección de cambios
  const hasChanges = Object.keys(profileData).some(key => 
    profileData[key] !== originalProfileData[key]
  );

  // 1. Manejo de Autenticación y Redirección
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false); 
      if (!u) {
        nav("/auth");
      }
    });
    return () => unsubAuth();
  }, [nav]);

  // 2. Carga Inicial del Perfil desde Firestore
  useEffect(() => {
    if (!user || loading) return; 
    
    const refDoc = doc(db, "profiles", user.uid);
    
    const unsubProfile = onSnapshot(refDoc, (d) => {
      const baseData = {
        ...initialProfileState,
        displayName: user.displayName || "Jardinero Digital",
        photoURL: user.photoURL || FORCED_AVATAR,
      };

      if (d.exists()) {
        const data = d.data();
        const loadedData = {
          displayName: data.displayName || baseData.displayName,
          bio: data.bio || baseData.bio,
          photoURL: data.photoURL || baseData.photoURL, 
          coverURL: data.coverURL || DEFAULT_COVER,
          theme: data.theme || baseData.theme,
          public: data.public === false ? false : true, 
          instagramUrl: data.instagramUrl || baseData.instagramUrl,
          whatsappNumber: data.whatsappNumber || baseData.whatsappNumber,
        };
        setProfileData(loadedData);
        setOriginalProfileData(loadedData);
      } else {
        setProfileData(baseData);
        setOriginalProfileData(baseData);
      }
    }, (error) => {
        console.error("Error al escuchar el perfil (Problema de Reglas):", error);
    });

    return () => unsubProfile();
  }, [user, loading]); 

  // 3. Carga de Colección de Semillas y Contadores
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "profiles", user.uid, "gallery"),
      orderBy("createdAt", "desc")
    );
    const unsubGallery = onSnapshot(q, (snap) => setGallery(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (error) => {
        console.error("Error al escuchar la galería (Problema de Reglas):", error);
    });
    
    const unsubFollowers = onSnapshot(collection(db, "followers", user.uid, "list"), (snap) => setFollowers(snap.size));
    const unsubFollowing = onSnapshot(collection(db, "following", user.uid, "list"), (snap) => setFollowing(snap.size));
    
    return () => { unsubGallery(); unsubFollowers(); unsubFollowing(); };
  }, [user]);

  
  // --- SUBIDA SIMULADA DE ARCHIVOS (Solo muestra la imagen local) ---
  function handleImageChange(file, field) {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setProfileData(prev => ({ ...prev, [field]: localUrl }));
  }

  // --- FUNCIÓNES FUNCIONALES DE FIRESTORE ---

  async function handleAddSeed() {
    if (!user) return alert("Debes iniciar sesión para añadir semillas.");
    const randomSeed = SEED_TYPES[Math.floor(Math.random() * SEED_TYPES.length)];
    
    try {
      await addDoc(collection(db, "profiles", user.uid, "gallery"), {
        type: randomSeed.name, 
        icon: randomSeed.icon,
        url: SEED_IMAGE,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error al añadir semilla:", e);
      alert("❌ Falló al añadir semilla. ¡REVISE SUS REGLAS DE SEGURIDAD!");
    }
  }

  async function removeGalleryItem(item) {
    if (!window.confirm(`¿Seguro que quieres eliminar la semilla ${item.type}?`)) return;
    try {
      await deleteDoc(doc(db, "profiles", user.uid, "gallery", item.id));
    } catch (e) {
      console.error("Error al eliminar semilla:", e);
      alert("❌ Falló al eliminar semilla. ¡REVISE SUS REGLAS DE SEGURIDAD!");
    }
  }

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
        console.error("Error al guardar perfil:", e);
        alert("❌ Error al guardar el perfil. ¡REVISE SUS REGLAS DE SEGURIDAD!");
    }
  }

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };


  // --- Renderizado y Estilos ---
  if (loading) return <div className="p-6 text-center text-xl min-h-screen flex items-center justify-center bg-gray-50">Cargando...</div>;
  if (!user) return null; 

  const isDark = profileData.theme === "dark";
  const themeClass = isDark ? "bg-gray-900 text-white" : "bg-gradient-to-b from-green-50 to-green-200";
  const cardClass = isDark ? "bg-gray-800 shadow-xl text-white" : "bg-white shadow-xl";
  const inputClass = isDark ? "p-3 border rounded border-gray-700 bg-gray-700 text-white" : "p-3 border rounded";
  const primaryButtonClass = "bg-green-600 hover:bg-green-700 text-white transition duration-150";
  
  // Emojis
  const IconoCandado = profileData.public ? "🔓" : "🔒";
  const IconoGuardar = "💾";
  const IconoSemilla = "🌱";
  const IconoEliminar = "🗑️";
  const IconoSubir = "📤";
  const IconoEditar = "✍️";

  return (
    <div className={`min-h-screen pb-12 ${themeClass}`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        {/* COVER */}
        <div className="relative">
          <div style={{ backgroundImage: `url(${profileData.coverURL})` }}
            className="h-56 bg-cover bg-center rounded-b-2xl shadow-md" />
          <label className={`absolute right-6 top-4 ${cardClass.split(' ')[0]} ${cardClass.split(' ')[2]} text-sm px-3 py-1 rounded-full cursor-pointer flex items-center gap-2 hover:bg-opacity-90 transition`}>
            {IconoSubir} Cambiar Portada
            <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={e => handleImageChange(e.target.files?.[0], 'coverURL')} 
            />
          </label>
        </div>

        {/* CONTENIDO PRINCIPAL - AUMENTADO MARGEN -mt-24 */}
        <div className="max-w-5xl mx-auto -mt-24 px-4 sm:px-6 lg:px-8">
          <div className={`${cardClass} rounded-2xl p-8 flex flex-col md:flex-row gap-8 mb-8`}>
            
            {/* AVATAR + BIO */}
            <div className="w-full md:w-48 flex-shrink-0 text-center">
              <div className="relative inline-block">
                <img 
                  src={profileData.photoURL} 
                  alt="avatar" 
                  className={`w-40 h-40 rounded-full border-4 ${isDark ? "border-gray-900" : "border-white"} shadow-lg object-cover mx-auto`} 
                />
                <label className={`absolute right-0 bottom-0 ${primaryButtonClass} text-white text-xs px-2 py-1 rounded-full cursor-pointer flex items-center gap-1`}>
                  {IconoEditar}
                  <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={e => handleImageChange(e.target.files?.[0], 'photoURL')} 
                  />
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
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tipos de Semillas</div>
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
                    {IconoCandado}
                    {profileData.public ? "Público" : "Privado"}
                  </button>
                  
                  <button onClick={saveProfile} 
                          disabled={!hasChanges}
                          className={`${primaryButtonClass} px-4 py-1 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {IconoGuardar}
                    {hasChanges ? "Guardar Cambios" : "Guardado"}
                  </button>
                </div>
              </div>

              {/* Links Sociales Dinámicos */}
              <div className="mt-4 flex flex-wrap gap-3 items-center border-t pt-4 border-gray-100 dark:border-gray-700">
                
                {profileData.whatsappNumber && (
                    <a className="text-sm px-3 py-1 border rounded flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition" 
                       href={getWhatsappLink()} target="_blank" rel="noreferrer">
                        💬 WhatsApp
                    </a>
                )}
                
                {profileData.instagramUrl && (
                    <a className="text-sm px-3 py-1 border rounded flex items-center gap-1 text-pink-600 border-pink-600 hover:bg-pink-50 dark:hover:bg-gray-700 transition" 
                       href={getInstagramLink()} target="_blank" rel="noreferrer">
                        📸 Instagram
                    </a>
                )}
                
                <span className="text-sm px-3 py-1 bg-amber-100 rounded text-amber-700">🪴 Nuevo Jardinero</span>
                <span className="text-sm px-3 py-1 bg-green-100 rounded text-green-700">Nivel de Crecimiento: 1</span>
              </div>

              {/* editable fields */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  value={profileData.displayName} 
                  onChange={e => handleChange('displayName', e.target.value)} 
                  className={inputClass} 
                  placeholder="Nombre de Jardinero" 
                />
                <select 
                  value={profileData.theme} 
                  onChange={e => handleChange('theme', e.target.value)} 
                  className={inputClass}
                >
                  <option value="light">Tema: Claro</option>
                  <option value="dark">Tema: Oscuro (Noche)</option>
                  <option value="jungle">Tema: Selva (Verde)</option>
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
                  placeholder="Link de Instagram" 
                />
                
                <textarea 
                  value={profileData.bio} 
                  onChange={e => handleChange('bio', e.target.value)} 
                  className={`${inputClass} md:col-span-2`} 
                  placeholder="Escribe tu filosofía de jardinería..." 
                />
              </div>
            </div>
          </div>

          {/* COLECCIÓN DE SEMILLAS */}
          <div className={`${cardClass} rounded-2xl p-6`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold">Mi Colección de Semillas ({gallery.length})</h3>
              <button onClick={handleAddSeed} className={`${primaryButtonClass} px-4 py-2 rounded-full cursor-pointer flex items-center gap-2`}>
                {IconoSemilla} Añadir Semilla
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.length === 0 ? (
                <div className="text-slate-500 dark:text-slate-400 col-span-full py-8 text-center">
                  Tu colección está vacía. ¡Añade tu primera semilla!
                </div>
              ) : (
                gallery.map(item => (
                  <motion.div key={item.id} className="relative group overflow-hidden rounded-lg shadow-md border border-green-200 dark:border-green-800" 
                              initial={{ scale: 0.9, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }} 
                              transition={{ duration: 0.3 }}>
                    
                    <div className="p-4 flex flex-col items-center">
                        <div className="text-4xl mb-2">{item.icon || '🌱'}</div>
                        <div className="font-semibold text-center text-sm">{item.type || 'Semilla Desconocida'}</div>
                        <div className="text-xs text-slate-500">Agregada: {(item.createdAt?.toDate() || new Date()).toLocaleDateString()}</div>
                    </div>
                    
                    {/* Botón de eliminar superpuesto */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <button onClick={() => removeGalleryItem(item)} 
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-sm flex items-center gap-1 transition transform hover:scale-110">
                        {IconoEliminar} Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Logros y Preferencias */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Último Riego 💧</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2">🟢 Has salvado una planta de la sequía.</li>
                <li className="flex items-center gap-2">🟢 Publicación con 50 likes.</li>
                <li className="flex items-center gap-2">🟢 Regaste 10 veces esta semana.</li>
              </ul>
            </div>

            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Logros de Crecimiento</h4>
              <div className="mt-3 flex flex-col gap-2">
                <div className="p-2 border rounded flex items-center justify-between dark:border-gray-700 bg-green-50 dark:bg-green-900/50">
                  <div><div className="font-semibold">Brote Inicial</div><div className="text-xs text-slate-500 dark:text-slate-400">Primer día en la comunidad</div></div>
                  <div className="text-lg text-green-700">✅</div>
                </div>
                <div className="p-2 border rounded flex items-center justify-between dark:border-gray-700">
                  <div><div className="font-semibold">Primer Fruto</div><div className="text-xs text-slate-500 dark:text-slate-400">Completaste 5 entradas de colección</div></div>
                  <div className="text-lg text-yellow-500">🏆</div>
                </div>
              </div>
            </div>

            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Preferencias del Huerto</h4>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <div>Huerto Público: <span className="font-semibold">{profileData.public ? "Sí" : "No"}</span></div>
                <div>Tema Visual: <span className="font-semibold">{profileData.theme.charAt(0).toUpperCase() + profileData.theme.slice(1)}</span></div>
                <div>Contacto WA: <span className="font-semibold">{profileData.whatsappNumber ? "Activo" : "Inactivo"}</span></div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}