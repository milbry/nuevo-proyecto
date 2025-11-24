// src/components/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
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
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  // profile data
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [cover, setCover] = useState("");
  const [theme, setTheme] = useState("light"); // light | dark | jungle
  const [publicProfile, setPublicProfile] = useState(true);

  // gallery & stats
  const [gallery, setGallery] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  const fileInputRef = useRef();
  const coverInputRef = useRef();
  const galleryInputRef = useRef();

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) nav("/auth");
      setLoading(false);
    });
    return () => unsubAuth();
  }, [nav]);

  // load profile doc (profiles/{uid})
  useEffect(() => {
    if (!user) return;
    const refDoc = doc(db, "profiles", user.uid);
    (async () => {
      const d = await getDoc(refDoc);
      if (d.exists()) {
        const data = d.data();
        setName(data.displayName || user.displayName || "");
        setBio(data.bio || "");
        setPhoto(data.photoURL || "");
        setCover(data.coverURL || "");
        setTheme(data.theme || "light");
        setPublicProfile(data.public ?? true);
      } else {
        setName(user.displayName || "");
      }
    })();
  }, [user]);

  // load gallery (collection profiles/{uid}/gallery)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "profiles", user.uid, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGallery(arr);
      setPostsCount(arr.length);
    });
    return () => unsub();
  }, [user]);

  // load followers/following counts (simple approach: collections followers/{uid}/docs)
  useEffect(() => {
    if (!user) return;
    const unsubF = onSnapshot(collection(db, "followers", user.uid, "list"), (snap) => setFollowers(snap.size));
    const unsubG = onSnapshot(collection(db, "following", user.uid, "list"), (snap) => setFollowing(snap.size));
    return () => { unsubF(); unsubG(); };
  }, [user]);

  // utilities to upload images (avatar / cover / gallery). Stores in: profiles/{uid}/...
  async function uploadFile(file, pathPrefix = "avatar") {
    if (!file || !user) return null;
    const path = `profiles/${user.uid}/${pathPrefix}/${Date.now()}_${file.name}`;
    const r = storageRef(storage, path);
    const snap = await uploadBytesResumable(r, file);
    const url = await getDownloadURL(snap.ref);
    return { url, path: snap.ref.fullPath };
  }

  async function handleAvatarChange(file) {
    try {
      const res = await uploadFile(file, "avatar");
      if (!res) return;
      setPhoto(res.url);
      await setDoc(doc(db, "profiles", user.uid), { photoURL: res.url }, { merge: true });
    } catch (e) {
      console.error(e);
      alert("Error al subir avatar");
    }
  }

  async function handleCoverChange(file) {
    try {
      const res = await uploadFile(file, "cover");
      if (!res) return;
      setCover(res.url);
      await setDoc(doc(db, "profiles", user.uid), { coverURL: res.url }, { merge: true });
    } catch (e) {
      console.error(e);
      alert("Error al subir cover");
    }
  }

  async function handleGalleryUpload(file) {
    try {
      const res = await uploadFile(file, "gallery");
      if (!res) return;
      await addDoc(collection(db, "profiles", user.uid, "gallery"), { url: res.url, path: res.path, createdAt: new Date() });
      // gallery will update via onSnapshot
    } catch (e) {
      console.error(e);
      alert("Error al subir imagen");
    }
  }

  async function removeGalleryItem(item) {
    try {
      // delete Firestore doc and try to delete storage object (best-effort)
      await deleteDoc(doc(db, "profiles", user.uid, "gallery", item.id));
      try { await deleteObject(storageRef(storage, item.path)); } catch(e){/* ignore */ }
    } catch (e) {
      console.error(e);
      alert("Error al eliminar");
    }
  }

  async function saveProfile() {
    await setDoc(doc(db, "profiles", user.uid), {
      displayName: name,
      bio,
      theme,
      public: publicProfile,
      updatedAt: new Date(),
    }, { merge: true });
    alert("Perfil guardado");
  }

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!user) return null;

  return (
    <div className={`min-h-screen pb-12 ${theme === "dark" ? "bg-gray-900 text-white" : theme === "jungle" ? "bg-gradient-to-b from-green-50 to-green-100" : "bg-white"}`}>
      {/* COVER */}
      <div className="relative">
        <div style={{ backgroundImage: `url(${cover || "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=60"})` }}
             className="h-56 bg-cover bg-center rounded-b-2xl shadow-md" />
        <label className="absolute right-6 top-4 bg-white/80 text-sm px-3 py-1 rounded cursor-pointer">
          Cambiar portada
          <input ref={coverInputRef} type="file" className="hidden" onChange={e => handleCoverChange(e.target.files?.[0])} />
        </label>
      </div>

      <div className="max-w-5xl mx-auto -mt-16 px-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex gap-6">
          {/* AVATAR + STATS */}
          <div className="w-48 flex-shrink-0">
            <div className="relative">
              <img src={photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt="avatar" className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover" />
              <label className="absolute right-0 bottom-0 bg-green-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
                Cambiar
                <input ref={fileInputRef} type="file" className="hidden" onChange={e => handleAvatarChange(e.target.files?.[0])} />
              </label>
            </div>

            <div className="mt-4 text-center">
              <div className="text-lg font-semibold">{name}</div>
              <div className="text-sm text-slate-500">{bio || "Comparte algo sobre ti..."}</div>
            </div>
          </div>

          {/* INFO PRINCIPAL */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="font-bold text-lg">{postsCount}</div>
                  <div className="text-xs text-slate-500">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{followers}</div>
                  <div className="text-xs text-slate-500">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{following}</div>
                  <div className="text-xs text-slate-500">Siguiendo</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setPublicProfile(p => !p)} className="px-3 py-1 border rounded">
                  {publicProfile ? "Público" : "Privado"}
                </button>
                <button onClick={saveProfile} className="bg-green-700 text-white px-4 py-1 rounded">Guardar</button>
              </div>
            </div>

            {/* Social links + badges */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <a className="text-sm px-3 py-1 border rounded" href={`https://wa.me/?text=Hola%20soy%20${encodeURIComponent(name)}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a className="text-sm px-3 py-1 border rounded" href="#" target="_blank" rel="noreferrer">Instagram</a>
              <span className="text-sm px-3 py-1 bg-amber-100 rounded text-amber-700">Badge: Nuevo</span>
              <span className="text-sm px-3 py-1 bg-green-100 rounded text-green-700">Nivel: 1</span>
            </div>

            {/* editable fields */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={name} onChange={e => setName(e.target.value)} className="p-3 border rounded" placeholder="Nombre" />
              <select value={theme} onChange={e => setTheme(e.target.value)} className="p-3 border rounded">
                <option value="light">Tema: Claro</option>
                <option value="dark">Tema: Oscuro</option>
                <option value="jungle">Tema: Selva</option>
              </select>
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="p-3 border rounded md:col-span-2" placeholder="Biografía" />
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Galería</h3>
            <div className="flex items-center gap-3">
              <label className="px-3 py-2 bg-green-700 text-white rounded cursor-pointer">
                Subir foto
                <input ref={galleryInputRef} type="file" className="hidden" onChange={e => handleGalleryUpload(e.target.files?.[0])} />
              </label>
              <button onClick={async () => {
                // quick refresh: re-list gallery (no-op: snapshot handles it)
                alert("Galería actualizada");
              }} className="px-3 py-2 border rounded">Refrescar</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.length === 0 && (
              <div className="text-slate-500">Aún no hay fotos en tu galería. Súbelas para mostrar tu progreso.</div>
            )}
            {gallery.map(item => (
              <div key={item.id} className="relative group">
                <img src={item.url} alt="" className="w-full h-40 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => removeGalleryItem(item)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVIDAD & LOGROS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h4 className="font-semibold">Actividad reciente</h4>
            <ul className="text-sm text-slate-600 mt-3">
              <li>Has subido 3 fotos esta semana.</li>
              <li>Recibiste 12 likes en tu último post.</li>
              <li>Completaste 2 retos.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h4 className="font-semibold">Logros</h4>
            <div className="mt-3 flex flex-col gap-2">
              <div className="p-2 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">Iniciado</div>
                  <div className="text-xs text-slate-500">Bienvenido a GreenMag</div>
                </div>
                <div className="text-sm text-green-700">✔</div>
              </div>
              <div className="p-2 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">Primera foto</div>
                  <div className="text-xs text-slate-500">Subiste tu primera imagen</div>
                </div>
                <div className="text-sm text-green-700">🏆</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h4 className="font-semibold">Preferencias</h4>
            <div className="mt-3 text-sm text-slate-600">
              <div>Perfil público: {publicProfile ? "Sí" : "No"}</div>
              <div>Tema activo: {theme}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

