import React, { useState } from "react";

export default function PrivateZone() {
  const [humidity, setHumidity] = useState(40);
  const [humidityMsg, setHumidityMsg] = useState("Humedad correcta 🌱");

  const [growth, setGrowth] = useState(10);
  const [dailyTaskDone, setDailyTaskDone] = useState(false);

  const [wateringDate, setWateringDate] = useState("");
  const [savedDate, setSavedDate] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState("");

  const [potSize, setPotSize] = useState("");
  const [wateringResult, setWateringResult] = useState("");

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState("");

  /* ================= FUNCIONES ================= */

  const handleHumidity = (value) => {
    setHumidity(value);
    if (value < 30) setHumidityMsg("⚠️ Ambiente seco");
    else if (value <= 60) setHumidityMsg("✅ Humedad ideal");
    else setHumidityMsg("⚠️ Exceso de humedad");
  };

  const saveWateringDate = () => {
    if (!wateringDate) return;
    setSavedDate(wateringDate);
  };

  const diagnosePlant = () => {
    const solutions = {
      "Manchas marrones": "☀️ Exceso de sol directo",
      "Hojas amarillas": "💧 Exceso de riego",
      "Falta de luz": "🔆 Necesita más luz",
      "Exceso de riego": "🌱 Deja secar el sustrato"
    };
    setDiagnosisResult(solutions[diagnosis]);
  };

  const calculateWater = () => {
    if (!potSize || isNaN(potSize)) {
      setWateringResult("Ingresa un número válido 🌱");
      return;
    }
    setWateringResult(`💧 ${potSize * 10} ml de agua recomendados`);
  };

  const answerQuiz = (answer) => {
    const updated = [...quizAnswers, answer];
    setQuizAnswers(updated);
    setQuizStep(quizStep + 1);

    if (updated.length === 2) {
      if (updated.includes("sol") && updated.includes("rapido"))
        setQuizResult("🌿 Eres una Monstera");
      else if (updated.includes("sombra"))
        setQuizResult("🌵 Eres una Sansevieria");
      else
        setQuizResult("🌱 Eres un Pothos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8 relative">

      {/* BOTÓN WHATSAPP */}
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

      {/* FRASE */}
      <div className="mt-10 mx-auto bg-white shadow-lg rounded-2xl p-6 max-w-3xl text-center text-green-800 text-xl font-semibold">
        ✨ “Las plantas no crecen comparándose, crecen a su ritmo.” ✨
      </div>

      {/* CONTENIDO */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* PLAYLIST 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            🎶 Música para plantas
          </h2>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo"
            width="100%"
            height="352"
            allow="encrypted-media"
          />
        </div>

        {/* PLAYLIST 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            🌙 Sonidos nocturnos
          </h2>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4y8h9WqDPAE"
            width="100%"
            height="352"
            allow="encrypted-media"
          />
        </div>

        {/* VIDEO YOUTUBE */}
        <div className="bg-white p-5 rounded-2xl shadow-lg col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            🎥 Webinar Premium: Riego eficiente
          </h2>
          <iframe
            className="rounded-xl"
            width="100%"
            height="350"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            allowFullScreen
          />
        </div>

        {/* GUÍA PDF */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-green-800 mb-3">
            📄 Guía PDF: Propagación Avanzada
          </h2>
          <a
            href="https://acuriego.es/wp-content/uploads/2024/05/11.-Guia-de-buenas-practicas-y-estrategias-de-riego-1.pdf"
            target="_blank"
            className="block text-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Descargar Guía
          </a>
        </div>

        {/* CALENDARIO */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">📅 Calendario de Riego</h3>
          <input
            type="date"
            className="w-full border p-2 rounded"
            onChange={(e) => setWateringDate(e.target.value)}
          />
          <button
            onClick={saveWateringDate}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
          >
            Guardar Riego
          </button>
          {savedDate && (
            <p className="mt-2 text-green-800">
              Próximo riego: {savedDate}
            </p>
          )}
        </div>

        {/* DIAGNÓSTICO */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">🧪 Diagnóstico</h3>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setDiagnosis(e.target.value)}
          >
            <option value="">Selecciona un problema</option>
            <option>Manchas marrones</option>
            <option>Hojas amarillas</option>
            <option>Falta de luz</option>
            <option>Exceso de riego</option>
          </select>
          <button
            onClick={diagnosePlant}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
          >
            Diagnosticar
          </button>
          {diagnosisResult && (
            <p className="mt-2 text-green-800 font-semibold">
              {diagnosisResult}
            </p>
          )}
        </div>

        {/* HUMEDAD */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">💧 Control de humedad</h3>
          <input
            type="range"
            min="10"
            max="100"
            value={humidity}
            onChange={(e) => handleHumidity(e.target.value)}
            className="w-full"
          />
          <p className="mt-2">{humidity}% — {humidityMsg}</p>
        </div>

        {/* CRECIMIENTO */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">📏 Crecimiento</h3>
          <p>Altura: {growth} cm</p>
          <button
            onClick={() => setGrowth(growth + 1)}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
          >
            Añadir +1 cm
          </button>
        </div>

        {/* CALCULADORA */}
        <div className="bg-white p-5 rounded-2xl shadow-lg col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-2 text-xl">
            🧮 Calculadora de riego
          </h3>
          <input
            className="w-full border p-2 rounded"
            placeholder="Tamaño de maceta (cm)"
            onChange={(e) => setPotSize(e.target.value)}
          />
          <button
            onClick={calculateWater}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
          >
            Calcular
          </button>
          {wateringResult && (
            <p className="mt-2 font-semibold">{wateringResult}</p>
          )}
        </div>

        {/* MINI TEST */}
        <div className="bg-white p-5 rounded-2xl shadow-lg col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-3">
            🧠 ¿Qué planta eres?
          </h3>

          {quizStep === 0 && (
            <>
              <p>¿Te gusta el sol?</p>
              <button
                onClick={() => answerQuiz("sol")}
                className="bg-green-600 text-white px-4 py-2 rounded mr-2 mt-2"
              >
                Sí
              </button>
              <button
                onClick={() => answerQuiz("sombra")}
                className="bg-green-300 text-green-900 px-4 py-2 rounded mt-2"
              >
                No
              </button>
            </>
          )}

          {quizStep === 1 && (
            <>
              <p>¿Crecimiento rápido?</p>
              <button
                onClick={() => answerQuiz("rapido")}
                className="bg-green-600 text-white px-4 py-2 rounded mr-2 mt-2"
              >
                Sí
              </button>
              <button
                onClick={() => answerQuiz("lento")}
                className="bg-green-300 text-green-900 px-4 py-2 rounded mt-2"
              >
                No
              </button>
            </>
          )}

          {quizResult && (
            <p className="mt-4 text-xl font-bold text-green-800">
              {quizResult}
            </p>
          )}
        </div>

        {/* RETO */}
        <div className="bg-white p-5 rounded-2xl shadow-lg col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-2 text-xl">
            🔥 Reto del día
          </h3>
          <p>Agrega una foto de tu planta favorita.</p>
          <button
            onClick={() => setDailyTaskDone(true)}
            className="bg-green-600 w-full text-white py-2 rounded-lg mt-3"
          >
            Marcar como hecho
          </button>
          {dailyTaskDone && (
            <p className="text-green-800 font-semibold mt-3">
              ¡Perfecto! 🌱
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
