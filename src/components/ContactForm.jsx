import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase.js";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiUpload, FiMail, FiUser, FiPhone } from "react-icons/fi";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [file, setFile] = useState(null);
  const [chars, setChars] = useState(0);

  const SAMPLE_FILE_URL = "sandbox:/mnt/data/mi-proyecto.zip";

  function setField(k, v) {
    setForm(s => ({ ...s, [k]: v }));
    if (k === "message") setChars(v.length);
  }

  function validate() {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    if (!form.email.trim()) return "El correo es obligatorio.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(form.email)) return "Introduce un correo válido.";
    if (!form.subject.trim()) return "El asunto es obligatorio.";
    if (!form.message.trim() || form.message.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
    return null;
  }

  async function uploadFileToStorage(f) {
    if (!f || !storage) return null;
    try {
      const path = `contacts/${Date.now()}_${f.name}`;
      const r = storageRef(storage, path);
      const snap = await uploadBytesResumable(r, f);
      const url = await getDownloadURL(snap.ref);
      return { url, path: snap.ref.fullPath };
    } catch (e) {
      console.error("Upload error:", e);
      return null;
    }
  }

  async function sendEmailJS(payload) { /* opcional */ }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setToast({ type: "error", text: err });
      setTimeout(() => setToast(null), 3500);
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      let attachment = null;
      if (file) {
        const res = await uploadFileToStorage(file);
        if (res) attachment = res.url;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim(),
        message: form.message.trim(),
        attachment: attachment || SAMPLE_FILE_URL,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "contacts"), payload);

      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setFile(null);
      setChars(0);
      setToast({ type: "success", text: "Mensaje enviado correctamente. ¡Gracias!" });
      setTimeout(() => setToast(null), 4500);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Error al enviar. Intenta de nuevo más tarde." });
      setTimeout(() => setToast(null), 4500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative max-w-xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
            <span className="font-medium">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 space-y-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Contáctanos</h3>

        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Nombre *</label>
          <div className="flex items-center gap-2 border rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <FiUser className="text-gray-400" />
            <input
              value={form.name}
              onChange={e => setField("name", e.target.value)}
              className="flex-1 outline-none"
              placeholder="Tu nombre"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Correo *</label>
          <div className="flex items-center gap-2 border rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={e => setField("email", e.target.value)}
              className="flex-1 outline-none"
              placeholder="tu@correo.com"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Teléfono</label>
          <div className="flex items-center gap-2 border rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <FiPhone className="text-gray-400" />
            <input
              value={form.phone}
              onChange={e => setField("phone", e.target.value)}
              className="flex-1 outline-none"
              placeholder="+51..."
            />
          </div>
        </div>

        {/* Asunto */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Asunto *</label>
          <input
            value={form.subject}
            onChange={e => setField("subject", e.target.value)}
            className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 outline-none transition"
            placeholder="¿Sobre qué quieres hablar?"
          />
        </div>

        {/* Mensaje */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Mensaje *</label>
          <textarea
            value={form.message}
            onChange={e => setField("message", e.target.value)}
            rows="6"
            maxLength={1000}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none transition"
            placeholder="Escribe tu mensaje..."
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <div>{chars}/1000</div>
            <div>Respuesta en menos de 48h</div>
          </div>
        </div>

        {/* File input */}
        <div>
          <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-green-50 transition">
            <FiUpload className="text-gray-500" />
            <span className="text-gray-700">{file ? file.name : "Adjuntar archivo (opcional)"}</span>
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <div className="mt-1 text-xs text-gray-500">
            Si no subes archivo se guardará un ejemplo (ZIP) para la demo:{" "}
            <a href={SAMPLE_FILE_URL} className="text-green-600 underline">
              descargar ZIP
            </a>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-center">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-white font-semibold ${loading ? "bg-green-400" : "bg-green-700 hover:bg-green-800"} transition`}
          >
            {loading ? "Enviando..." : "Enviar mensaje"}
          </motion.button>

          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", phone: "", subject: "", message: "" });
              setFile(null);
              setChars(0);
            }}
            className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
