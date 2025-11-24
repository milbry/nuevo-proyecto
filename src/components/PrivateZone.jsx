import React, { useState } from "react";

export default function PrivateZone() {
  const [quizStep, setQuizStep] = useState(0);
  const [humidity, setHumidity] = useState(40);
  const [growth, setGrowth] = useState(10);
  const [dailyTaskDone, setDailyTaskDone] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8 relative">

      {/* WHATSAPP BOTÓN FLOTANTE */}
      <a
        href="https://wa.me/51999999999"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-xl hover:bg-green-700 transition text-2xl"
      >
        💬
      </a>

      {/* ENCABEZADO */}
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-green-900">
          🌱 Zona VIP Premium
        </h1>
        <p className="mt-4 text-xl text-green-700">
          Todo lo que un amante de plantas podría soñar… en un solo lugar.
        </p>
      </div>

      {/* FRASE MOTIVACIONAL */}
      <div className="mt-10 mx-auto bg-white shadow-lg rounded-2xl p-6 max-w-3xl text-center text-green-800 text-xl font-semibold">
        ✨ “Las plantas no crecen comparándose, crecen a su ritmo. Tú también.” ✨
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* PLAYLISTS */}
        <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            🎶 Playlist: Música para plantas
          </h2>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo"
            width="100%" height="352" allow="encrypted-media"
          ></iframe>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            🌙 Playlist: Sonidos nocturnos
          </h2>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4y8h9WqDPAE?utm_source=generator"
            width="100%" height="352" allow="encrypted-media"
          ></iframe>
        </div>

        {/* VIDEOS */}
        <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            🎥 Webinar Premium: Riego eficiente
          </h2>
          <iframe
            width="100%" height="350" className="rounded-xl"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          ></iframe>
        </div>

        {/* PDFs */}
        <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            📄 Guía PDF: Propagación Avanzada
          </h2>
          <a
            href="https://acuriego.es/wp-content/uploads/2024/05/11.-Guia-de-buenas-practicas-y-estrategias-de-riego-1.pdf"
            target="_blank"
            className="block text-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Descargar Guía
          </a>
        </div>

        {/* MINI-APLICACIONES */}
        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-bold text-green-700 mb-2">📅 Calendario de Riego</h3>
          <input
            type="date"
            className="w-full p-2 border rounded"
          />
          <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg">
            Guardar Riego
          </button>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-bold text-green-700 mb-2">🧪 Diagnóstico de la Planta</h3>
          <p className="text-slate-700 mb-3">Selecciona un problema:</p>
          <select className="w-full p-2 border rounded">
            <option>Manchas marrones</option>
            <option>Hojas amarillas</option>
            <option>Falta de luz</option>
            <option>Exceso de riego</option>
          </select>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-bold text-green-700 mb-2">💧 Control de humedad</h3>
          <p>Humedad actual: {humidity}%</p>
          <input
            type="range"
            min="10" max="100"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            className="w-full mt-3"
          />
        </div>

        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-bold text-green-700 mb-2">📏 Tracking de crecimiento</h3>
          <p>Altura: {growth} cm</p>
          <button
            onClick={() => setGrowth(growth + 1)}
            className="bg-green-600 w-full mt-3 text-white py-2 rounded-lg"
          >
            Añadir +1 cm
          </button>
        </div>

        {/* CALCULADORA DE RIEGO */}
        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-2 text-xl">🧮 Calculadora de riego</h3>
          <p>Ingresa tamaño de maceta (en cm)</p>
          <input className="w-full p-2 border rounded" placeholder="Ej: 12" />
          <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg">
            Calcular
          </button>
        </div>

        {/* TEST INTERACTIVO */}
        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-4 text-xl">🧠 Mini Test: ¿Qué planta eres?</h3>

          {quizStep === 0 && (
            <>
              <p>¿Te gusta el sol?</p>
              <button onClick={() => setQuizStep(1)} className="bg-green-600 text-white px-4 py-2 rounded-lg mt-3">Sí</button>
              <button onClick={() => setQuizStep(1)} className="bg-green-300 text-green-900 px-4 py-2 rounded-lg ml-3">No</button>
            </>
          )}

          {quizStep === 1 && (
            <>
              <p>¿Eres de crecimiento rápido?</p>
              <button onClick={() => setQuizStep(2)} className="bg-green-600 text-white px-4 py-2 rounded-lg mt-3">Sí</button>
              <button onClick={() => setQuizStep(2)} className="bg-green-300 text-green-900 px-4 py-2 rounded-lg ml-3">No</button>
            </>
          )}

          {quizStep === 2 && (
            <p className="text-xl font-bold text-green-800 mt-4">🌿 ¡Eres una Monstera!</p>
          )}
        </div>

        {/* RETOS DIARIOS */}
        <div className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-2 text-xl">🔥 Reto del día</h3>
          <p>Agrega 1 foto de tu planta favorita.</p>
          <button
            onClick={() => setDailyTaskDone(true)}
            className="bg-green-600 w-full text-white py-2 rounded-lg mt-3"
          >
            Marcar como hecho
          </button>
          {dailyTaskDone && (
            <p className="text-green-800 font-semibold mt-3">¡Perfecto! 🌱</p>
          )}
        </div>

      </div>
    </div>
  );
}
