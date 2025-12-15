// src/components/Profile.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { auth, db, storage } from "../firebase.js"; // ajusta la ruta si la tienes en otro lugar
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp, // Uso de serverTimestamp para mayor precisión
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { FiUploadCloud, FiTrash2, FiSave, FiEdit3, FiLock, FiUnlock, FiRefreshCw } from "react-icons/fi"; // Iconos para mejor UX

// Estado inicial para la información del perfil (para comparación)
const initialProfileState = {
  displayName: "",
  bio: "",
  photoURL: "",
  coverURL: "",
  theme: "light",
  public: true,
};

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  
  // profile data (Estado para los campos editables y originales)
  const [profileData, setProfileData] = useState(initialProfileState);
  const [originalProfileData, setOriginalProfileData] = useState(initialProfileState);
  
  // Estados de carga de archivos (para UX)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // gallery & stats
  const [gallery, setGallery] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const fileInputRef = useRef();
  const coverInputRef = useRef();
  const galleryInputRef = useRef();

  // Determinar si hay cambios para habilitar el botón de guardar
  const hasChanges = 
    profileData.displayName !== originalProfileData.displayName ||
    profileData.bio !== originalProfileData.bio ||
    profileData.theme !== originalProfileData.theme ||
    profileData.public !== originalProfileData.public;


  // 1. Manejo de Autenticación
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) nav("/auth");
      setLoading(false);
    });
    return () => unsubAuth();
  }, [nav]);

  // 2. Carga Inicial del Perfil (profiles/{uid})
  useEffect(() => {
    if (!user) return;
    const refDoc = doc(db, "profiles", user.uid);
    
    // Usamos onSnapshot para mantener el perfil en tiempo real si alguien más lo cambia (o si el usuario lo hace en otra pestaña)
    const unsubProfile = onSnapshot(refDoc, (d) => {
      if (d.exists()) {
        const data = d.data();
        const loadedData = {
          displayName: data.displayName || user.displayName || "",
          bio: data.bio || "",
          photoURL: data.photoURL || user.photoURL || "",
          coverURL: data.coverURL || "",
          theme: data.theme || "light",
          public: data.public ?? true,
        };
        setProfileData(loadedData);
        setOriginalProfileData(loadedData); // Establecer el estado original
      } else {
        // Si el documento no existe, inicializar con datos base del usuario autenticado
        const baseData = {
          ...initialProfileState,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
        };
        setProfileData(baseData);
        setOriginalProfileData(baseData);
        // Opcional: Crear el documento base inmediatamente
        setDoc(refDoc, baseData, { merge: true }).catch(console.error);
      }
    });

    return () => unsubProfile();
  }, [user]);

  // 3. Carga de Galería (profiles/{uid}/gallery)
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "profiles", user.uid, "gallery"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGallery(arr);
    });
    return () => unsub();
  }, [user]);

  // 4. Carga de Seguidores/Siguiendo
  useEffect(() => {
    if (!user) return;
    const unsubF = onSnapshot(collection(db, "followers", user.uid, "list"), (snap) =>
      setFollowers(snap.size)
    );
    const unsubG = onSnapshot(collection(db, "following", user.uid, "list"), (snap) =>
      setFollowing(snap.size)
    );
    return () => {
      unsubF();
      unsubG();
    };
  }, [user]);
  
  // Función de utilidad para subir archivos (usando useCallback)
  const uploadFile = useCallback(async (file, pathPrefix = "temp") => {
    if (!file || !user) return null;
    const path = `profiles/${user.uid}/${pathPrefix}/${Date.now()}_${file.name}`;
    const r = storageRef(storage, path);
    const uploadTask = uploadBytesResumable(r, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Puedes usar esto para mostrar una barra de progreso si es necesario
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path: uploadTask.snapshot.ref.fullPath });
        }
      );
    });
  }, [user]);

  // Manejadores de cambios de archivos
  async function handleAvatarChange(file) {
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const res = await uploadFile(file, "avatar");
      if (!res) return;
      
      // Actualizar Firestore
      await setDoc(doc(db, "profiles", user.uid), { photoURL: res.url }, { merge: true });
      
      // Actualizar estado local (se actualizará también por el snapshot del perfil, pero lo hacemos para feedback inmediato)
      setProfileData(prev => ({ ...prev, photoURL: res.url }));

      // Eliminar foto anterior si existe y no es la predeterminada (MEJORA: falta implementar el guardado del path anterior para eliminarlo)
      
      alert("Avatar subido con éxito.");
    } catch (e) {
      console.error(e);
      alert("Error al subir avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleCoverChange(file) {
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const res = await uploadFile(file, "cover");
      if (!res) return;
      
      // Actualizar Firestore
      await setDoc(doc(db, "profiles", user.uid), { coverURL: res.url }, { merge: true });
      
      // Actualizar estado local
      setProfileData(prev => ({ ...prev, coverURL: res.url }));
      
      alert("Portada subida con éxito.");
    } catch (e) {
      console.error(e);
      alert("Error al subir portada.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleGalleryUpload(file) {
    if (!file) return;
    setIsUploadingGallery(true);
    try {
      const res = await uploadFile(file, "gallery");
      if (!res) return;
      
      // Añadir documento a la subcolección de galería
      await addDoc(collection(db, "profiles", user.uid, "gallery"), {
        url: res.url,
        path: res.path, // Almacenar el path para su posterior eliminación en Storage
        createdAt: serverTimestamp(),
      });
      alert("Imagen de galería subida.");
      // La galería se actualizará automáticamente a través del onSnapshot
    } catch (e) {
      console.error(e);
      alert("Error al subir imagen.");
    } finally {
      setIsUploadingGallery(false);
    }
  }

  async function removeGalleryItem(item) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return;
    try {
      // 1. Eliminar el documento de Firestore
      await deleteDoc(doc(db, "profiles", user.uid, "gallery", item.id));
      
      // 2. Intentar eliminar el objeto de Storage (best-effort)
      if (item.path) {
          try { 
              await deleteObject(storageRef(storage, item.path)); 
          } catch(e){
              console.warn("No se pudo eliminar el archivo de Storage, pero el documento de Firestore ha sido eliminado.", e);
          }
      }
      alert("Imagen eliminada.");
    } catch (e) {
      console.error(e);
      alert("Error al eliminar la imagen.");
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
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );
        
        // Actualizar el estado original para reflejar los datos guardados
        setOriginalProfileData(profileData);
        alert("✅ Perfil guardado con éxito.");
    } catch (e) {
        console.error(e);
        alert("❌ Error al guardar el perfil.");
    }
  }

  // Helper para manejar cambios en los campos de entrada
  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };


  if (loading) return <div className="p-6 text-center text-xl">Cargando perfil...</div>;
  if (!user) return null; // Redirección ya manejada en useEffect

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
          <div style={{ backgroundImage: `url(${profileData.coverURL || "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=60"})` }}
            className="h-56 bg-cover bg-center rounded-b-2xl shadow-md" />
          <label className={`absolute right-6 top-4 ${cardClass.split(' ')[0]} ${cardClass.split(' ')[2]} text-sm px-3 py-1 rounded-full cursor-pointer flex items-center gap-2 hover:bg-opacity-90 transition`}>
            {isUploadingCover ? "Subiendo..." : <><FiEdit3 className="w-4 h-4" /> Cambiar portada</>}
            <input ref={coverInputRef} type="file" className="hidden" 
                   accept="image/*"
                   disabled={isUploadingCover}
                   onChange={e => handleCoverChange(e.target.files?.[0])} />
          </label>
        </div>

        <div className="max-w-5xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8">
          <div className={`${cardClass} rounded-2xl p-6 flex flex-col md:flex-row gap-6 mb-8`}>
            
            {/* AVATAR + BIO */}
            <div className="w-full md:w-48 flex-shrink-0 text-center">
              <div className="relative inline-block">
                <img 
                  src={profileData.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
                  alt="avatar" 
                  className={`w-40 h-40 rounded-full border-4 ${isDark ? "border-gray-900" : "border-white"} shadow-lg object-cover mx-auto`} 
                />
                <label className={`absolute right-0 bottom-0 ${primaryButtonClass} text-white text-xs px-2 py-1 rounded-full cursor-pointer flex items-center gap-1`}>
                  {isUploadingAvatar ? <FiRefreshCw className="w-3 h-3 animate-spin" /> : <FiUploadCloud className="w-3 h-3" />}
                  <input ref={fileInputRef} type="file" className="hidden" 
                         accept="image/*"
                         disabled={isUploadingAvatar}
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
                          className={`px-3 py-1 rounded flex items-center gap-1 transition duration-150 ${profileData.public ? "border-green-600 text-green-700 bg-green-100" : "border-red-600 text-red-700 bg-red-100"}`}>
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

              {/* Social links + badges */}
              <div className="mt-4 flex flex-wrap gap-3 items-center border-t pt-4 border-gray-100 dark:border-gray-700">
                <a className="text-sm px-3 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition" 
                   href={`https://wa.me/?text=Hola%20soy%20${encodeURIComponent(profileData.displayName)}`} target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="text-sm px-3 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition" 
                   href="#" target="_blank" rel="noreferrer">Instagram</a>
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
              <label className={`${primaryButtonClass} px-4 py-2 rounded-full cursor-pointer flex items-center gap-2 disabled:opacity-50`}>
                {isUploadingGallery ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiUploadCloud className="w-4 h-4" />}
                {isUploadingGallery ? "Subiendo..." : "Subir foto"}
                <input ref={galleryInputRef} type="file" className="hidden" 
                       accept="image/*"
                       disabled={isUploadingGallery}
                       onChange={e => handleGalleryUpload(e.target.files?.[0])} />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.length === 0 ? (
                <div className="text-slate-500 dark:text-slate-400 col-span-full py-8 text-center">
                  Aún no hay fotos en tu galería. Súbelas para mostrar tu progreso.
                </div>
              ) : (
                gallery.map(item => (
                  <motion.div key={item.id} className="relative group overflow-hidden rounded-lg shadow-md" 
                              initial={{ scale: 0.9, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }} 
                              transition={{ duration: 0.3 }}>
                    <img src={item.url} alt="Galería" className="w-full h-40 object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <button onClick={() => removeGalleryItem(item)} 
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-sm flex items-center gap-1 transition transform hover:scale-110">
                        <FiTrash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVIDAD & LOGROS */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Actividad */}
            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Actividad reciente</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-500">●</span> Has subido {gallery.length} fotos.</li>
                <li className="flex items-center gap-2"><span className="text-green-500">●</span> Recibiste 12 likes en tu último post.</li>
                <li className="flex items-center gap-2"><span className="text-green-500">●</span> Completaste 2 retos.</li>
              </ul>
            </div>

            {/* Logros */}
            <div className={`${cardClass} p-4`}>
              <h4 className="font-bold text-lg mb-3">Logros</h4>
              <div className="mt-3 flex flex-col gap-2">
                <div className="p-2 border rounded flex items-center justify-between dark:border-gray-700">
                  <div>
                    <div className="font-semibold">Iniciado</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Bienvenido a GreenMag</div>
                  </div>
                  <div className="text-lg text-green-700">✔</div>
                </div>
                <div className="p-2 border rounded flex items-center justify-between dark:border-gray-700">
                  <div>
                    <div className="font-semibold">Primera foto</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Subiste tu primera imagen</div>
                  </div>
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
                <div>Último guardado: <span className="font-semibold">Justo ahora</span></div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}