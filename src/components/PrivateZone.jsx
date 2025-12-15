import React, { useState } from "react";
import { motion } from "framer-motion"; // Importamos motion para las animaciones

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
  
  // NUEVOS ESTADOS
  const [fertilizerType, setFertilizerType] = useState("");
  const [area, setArea] = useState("");
  const [fertilizerDose, setFertilizerDose] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [time, setTime] = useState(0); // Tiempo en segundos

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState("");

  /* ================= FUNCIONES ================= */

  // Función de temporizador (simulación)
  const startTimer = () => {
    if (!timerRunning) {
        setTimerRunning(true);
        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime >= 60) {
                    clearInterval(interval);
                    setTimerRunning(false);
                    return 60;
                }
                return prevTime + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    } else {
        setTimerRunning(false);
    }
  };

  const calculateFertilizer = () => {
    const areaValue = parseFloat(area);
    const multiplier = {
        "Universal": 2,
        "Orquídeas": 1.5,
        "Cactus": 0.5,
    };
    
    if (!areaValue || isNaN(areaValue) || !fertilizerType) {
        setFertilizerDose("Ingresa área y selecciona tipo.");
        return;
    }

    const dose = areaValue * multiplier[fertilizerType];
    setFertilizerDose(`🧪 Dosis recomendada: ${dose.toFixed(1)} gramos.`);
  };


  const handleHumidity = (value) => {
    setHumidity(value);
    const val = parseInt(value);
    if (val < 30) setHumidityMsg("⚠️ Ambiente seco. ¡Pulverizar!");
    else if (val <= 60) setHumidityMsg("✅ Humedad ideal");
    else setHumidityMsg("⚠️ Exceso de humedad. ¡Ventilar!");
  };

  const saveWateringDate = () => {
    if (!wateringDate) return;
    setSavedDate(new Date(wateringDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const diagnosePlant = () => {
    const solutions = {
      "Manchas marrones": "☀️ Exceso de sol directo. Mueve la planta.",
      "Hojas amarillas": "💧 Exceso de riego. Deja secar el sustrato.",
      "Falta de luz": "🔆 Necesita más luz. Acércala a una ventana.",
      "Exceso de riego": "🌱 Deja secar el sustrato. Revisa el drenaje."
    };
    setDiagnosisResult(solutions[diagnosis] || "Necesita más información.");
  };

  const calculateWater = () => {
    const potSizeValue = parseFloat(potSize);
    if (!potSizeValue || isNaN(potSizeValue) || potSizeValue <= 0) {
      setWateringResult("Ingresa un número válido para el tamaño (cm) 🌱");
      return;
    }
    // Fórmula: 10 ml por cm de diámetro de maceta (Ej: 10cm = 100ml)
    setWateringResult(`💧 ${potSizeValue * 10} ml de agua recomendados (por semana, aprox.)`);
  };

  const answerQuiz = (answer) => {
    const updated = [...quizAnswers, answer];
    setQuizAnswers(updated);
    setQuizStep(quizStep + 1);

    if (updated.length === 2) {
        let result;
      if (updated.includes("sol") && updated.includes("rapido"))
        result = "🌿 Eres una Monstera (rápida, mucha luz)";
      else if (updated.includes("sombra") && updated.includes("rapido"))
        result = "🌱 Eres un Pothos (tolerante, crecimiento rápido)";
      else if (updated.includes("sombra") && updated.includes("lento"))
        result = "🌵 Eres una Sansevieria (fuerte, baja luz)";
      else
        result = "🌳 Eres un Ficus Benjamina (necesitas equilibrio)";

      setQuizResult(result);
    }
  };

  // Estilos de botones para consistencia
  const buttonClass = "w-full mt-3 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition";
  const cardClass = "bg-white p-5 rounded-2xl shadow-lg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        {/* BOTÓN WHATSAPP */}
        <a
          href="https://wa.me/51999999999"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-xl hover:bg-green-700 transition text-2xl z-10"
        >
          💬
        </a>

        {/* ENCABEZADO */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-green-900">
            👑 Zona VIP Premium
          </h1>
          <p className="mt-4 text-xl text-green-700">
            Todo lo que un amante de plantas podría soñar… en un solo lugar.
          </p>
        </div>

        {/* FRASE */}
        <div className="mt-10 mx-auto bg-green-800 shadow-xl rounded-2xl p-6 max-w-3xl text-center text-white text-xl font-semibold">
          ✨ “Las plantas no crecen comparándose, crecen a su ritmo.” ✨
        </div>

        {/* CONTENIDO (GRID PRINCIPAL) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* PLAYLIST 1 */}
          <div className={`${cardClass} lg:col-span-1`}>
            <h2 className="text-xl font-bold text-green-800 mb-3">
              🎶 Música para Plantas
            </h2>
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo"
              width="100%"
              height="250" // Altura ajustada para el layout de 3 columnas
              allow="encrypted-media"
              title="Spotify Playlist 1"
            />
          </div>

          {/* PLAYLIST 2 */}
          <div className={`${cardClass} lg:col-span-1`}>
            <h2 className="text-xl font-bold text-green-800 mb-3">
              🌙 Sonidos Nocturnos
            </h2>
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4y8h9WqDPAE"
              width="100%"
              height="250" // Altura ajustada
              allow="encrypted-media"
              title="Spotify Playlist 2"
            />
          </div>
          
          {/* MAPA Y CLIMA SIMULADO */}
          <div className={`${cardClass} lg:col-span-1`}>
            <h2 className="text-xl font-bold text-green-800 mb-3">
              📍 Clima de mi Huerto
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Tu ubicación: Ciudad de México.
            </p>
            {/* SIMULACIÓN DE MAPA/WIDGET */}
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 text-center">
                
                <span className="font-bold text-sm">
                    Temperatura: 25°C. Humedad: 55%.
                    <br/>
                    Próximo Riego: Mañana.
                </span>
            </div>
          </div>


          {/* VIDEO YOUTUBE (Webinar) */}
          <div className={`${cardClass} md:col-span-2 lg:col-span-3`}>
            <h2 className="text-xl font-bold text-green-800 mb-3">
              🎥 Webinar Premium: Riego eficiente y Propagación
            </h2>
            <iframe
              className="rounded-xl w-full"
              height="400"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allowFullScreen
              title="Webinar Premium Riego"
            />
          </div>

          {/* CALCULADORA DE RIEGO */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">
              🧮 Calculadora de Riego
            </h3>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Tamaño de maceta (cm de diámetro)"
              value={potSize}
              onChange={(e) => setPotSize(e.target.value)}
            />
            <button
              onClick={calculateWater}
              className={buttonClass}
            >
              Calcular
            </button>
            {wateringResult && (
              <p className="mt-2 font-semibold text-green-800">{wateringResult}</p>
            )}
          </div>

          {/* CALCULADORA DE FERTILIZANTE (NUEVO) */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">
              🧪 Calculadora de Nutrientes
            </h3>
            <select
              className="w-full border p-2 rounded mb-2"
              value={fertilizerType}
              onChange={(e) => setFertilizerType(e.target.value)}
            >
                <option value="">Selecciona tipo de fertilizante</option>
                <option value="Universal">Universal (NPK 10-10-10)</option>
                <option value="Orquídeas">Especial Orquídeas</option>
                <option value="Cactus">Especial Suculentas/Cactus</option>
            </select>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Área de cultivo (m²)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <button
              onClick={calculateFertilizer}
              className={buttonClass}
            >
              Calcular Dosis
            </button>
            {fertilizerDose && (
              <p className="mt-2 font-semibold text-green-800">{fertilizerDose}</p>
            )}
          </div>

          {/* DIAGNÓSTICO */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">🔬 Diagnóstico Rápido</h3>
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => setDiagnosis(e.target.value)}
            >
              <option value="">Selecciona un síntoma</option>
              <option>Manchas marrones</option>
              <option>Hojas amarillas</option>
              <option>Falta de luz</option>
              <option>Exceso de riego</option>
            </select>
            <button
              onClick={diagnosePlant}
              className={buttonClass}
            >
              Diagnosticar
            </button>
            {diagnosisResult && (
              <p className="mt-2 text-green-800 font-semibold">
                {diagnosisResult}
              </p>
            )}
          </div>


          {/* CONTROL DE HUMEDAD */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">💧 Sensor de Humedad</h3>
            <input
              type="range"
              min="10"
              max="100"
              value={humidity}
              onChange={(e) => handleHumidity(e.target.value)}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer range-lg"
            />
            <p className="mt-4 text-center text-lg font-semibold text-green-900">{humidity}% — {humidityMsg}</p>
          </div>
          
          {/* TEMPORIZADOR DE TAREAS (NUEVO) */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">⏱️ Temporizador de Tareas</h3>
            <div className="text-4xl font-bold text-center text-green-800 mb-3">
                {time < 10 ? `00:0${time}` : `00:${time}`}
            </div>
            <button
              onClick={startTimer}
              className={buttonClass}
            >
              {timerRunning ? `Pausar (${time}s)` : "Iniciar 1 Minuto"}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">Útil para inspecciones rápidas o pulverizado.</p>
          </div>

          {/* CALENDARIO DE RIEGO */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">📅 Agenda de Riego</h3>
            <input
              type="date"
              className="w-full border p-2 rounded"
              onChange={(e) => setWateringDate(e.target.value)}
            />
            <button
              onClick={saveWateringDate}
              className={buttonClass}
            >
              Guardar Próximo Riego
            </button>
            {savedDate && (
              <p className="mt-2 text-green-800 font-semibold text-center">
                Próximo riego: {savedDate}
              </p>
            )}
          </div>

          {/* MINI TEST (QUÉ PLANTA ERES) */}
          <div className={`${cardClass} md:col-span-2 lg:col-span-3`}>
            <h3 className="font-bold text-green-700 mb-3 text-xl">
              🧠 Mini Test: ¿Qué planta eres?
            </h3>

            {quizStep === 0 && (
              <>
                <p className="mb-2">Pregunta 1/2: ¿Prefieres la luz solar directa o la sombra?</p>
                <button
                  onClick={() => answerQuiz("sol")}
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2 mt-2 hover:bg-green-700"
                >
                  ☀️ Mucho sol
                </button>
                <button
                  onClick={() => answerQuiz("sombra")}
                  className="bg-green-300 text-green-900 px-4 py-2 rounded mt-2 hover:bg-green-400"
                >
                  ☁️ Sombra / Baja luz
                </button>
              </>
            )}

            {quizStep === 1 && (
              <>
                <p className="mb-2">Pregunta 2/2: ¿Tu crecimiento es notablemente rápido o prefieres ir lento?</p>
                <button
                  onClick={() => answerQuiz("rapido")}
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2 mt-2 hover:bg-green-700"
                >
                  🚀 Rápido
                </button>
                <button
                  onClick={() => answerQuiz("lento")}
                  className="bg-green-300 text-green-900 px-4 py-2 rounded mt-2 hover:bg-green-400"
                >
                  🐢 Lento
                </button>
              </>
            )}

            {quizResult && (
              <p className="mt-4 text-xl font-bold text-green-800 p-3 bg-green-100 rounded-lg">
                🎉 Tu planta es: {quizResult}
              </p>
            )}
          </div>

          {/* OFERTAS PREMIUM (NUEVO) */}
          <div className={`${cardClass} md:col-span-2 lg:col-span-3`}>
            <h3 className="font-bold text-green-700 mb-4 text-xl">
              💰 Ofertas Exclusivas (Tienda Premium)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-green-300 p-4 rounded-lg text-center bg-green-50 hover:shadow-md transition cursor-pointer">
                    <p className="text-4xl">🎁</p>
                    <p className="font-bold mt-2">Kit de Sustrato VIP</p>
                    <p className="text-sm text-red-600">30% OFF</p>
                </div>
                <div className="border border-green-300 p-4 rounded-lg text-center bg-green-50 hover:shadow-md transition cursor-pointer">
                    <p className="text-4xl">💡</p>
                    <p className="font-bold mt-2">Lámpara LED Full Spectrum</p>
                    <p className="text-sm text-red-600">Envío Gratis</p>
                </div>
                <div className="border border-green-300 p-4 rounded-lg text-center bg-green-50 hover:shadow-md transition cursor-pointer">
                    <p className="text-4xl">📚</p>
                    <p className="font-bold mt-2">E-book: Bonsái para Expertos</p>
                    <p className="text-sm text-red-600">Precio especial</p>
                </div>
            </div>
          </div>
          
          {/* GUÍA PDF */}
          <div className={`${cardClass}`}>
            <h2 className="text-xl font-bold text-green-800 mb-3">
              📄 Guía PDF: Propagación Avanzada
            </h2>
            <a
              href="https://acuriego.es/wp-content/uploads/2024/05/11.-Guia-de-buenas-practicas-y-estrategias-de-riego-1.pdf"
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Descargar Guía Avanzada
            </a>
          </div>


          {/* RETO */}
          <div className={`${cardClass}`}>
            <h3 className="font-bold text-green-700 mb-2 text-xl">
              🔥 Reto del día (Crecimiento)
            </h3>
            <p>Altura actual: {growth} cm</p>
            <button
              onClick={() => setGrowth(growth + 1)}
              className="bg-yellow-600 w-full text-white py-2 rounded-lg mt-3 font-semibold hover:bg-yellow-700 transition"
            >
              Añadir +1 cm
            </button>
            <p className="mt-3">Reto: Agrega una foto de tu planta favorita.</p>
            <button
              onClick={() => setDailyTaskDone(true)}
              className={buttonClass}
            >
              Marcar Reto como hecho
            </button>
            {dailyTaskDone && (
              <p className="text-green-800 font-semibold mt-3 text-center">
                ¡Perfecto! Reto completado. 🌱
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}