import React, { useState } from "react";

export default function PrivateZone() {
  const [humidity, setHumidity] = useState(40);
  const [humidityMsg, setHumidityMsg] = useState("");

  const [potSize, setPotSize] = useState("");
  const [wateringResult, setWateringResult] = useState("");

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState("");

  const [wateringDate, setWateringDate] = useState("");
  const [savedDate, setSavedDate] = useState("");

  const [growth, setGrowth] = useState(10);
  const [dailyTaskDone, setDailyTaskDone] = useState(false);

  /* ---------------- HUMEDAD ---------------- */
  const handleHumidity = (value) => {
    setHumidity(value);

    if (value < 30) setHumidityMsg("⚠️ Ambiente muy seco. Pulveriza agua.");
    else if (value < 60) setHumidityMsg("✅ Humedad ideal.");
    else setHumidityMsg("⚠️ Demasiada humedad. Ventila el ambiente.");
  };

  /* ---------------- CALCULADORA ---------------- */
  const calculateWater = () => {
    if (!potSize) return setWateringResult("Ingresa un tamaño válido 🌱");
    const ml = potSize * 10;
    setWateringResult(`💧 Riego recomendado: ${ml} ml de agua`);
  };

  /* ---------------- TEST ---------------- */
  const answerQuiz = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    setQuizStep(quizStep + 1);

    if (newAnswers.length === 2) {
      if (newAnswers[0] === "sol" && newAnswers[1] === "rapido") {
        setQuizResult("🌿 Eres una Monstera: fuerte y expansiva.");
      } else if (newAnswers[0] === "sombra") {
        setQuizResult("🌵 Eres un Sansevieria: resistente y tranquila.");
      } else {
        setQuizResult("🌱 Eres un Pothos: adaptable y noble.");
      }
    }
  };

  /* ---------------- DIAGNÓSTICO ---------------- */
  const diagnosePlant = () => {
    const map = {
      "Manchas marrones": "Puede ser exceso de sol o riego.",
      "Hojas amarillas": "Probablemente exceso de agua.",
      "Falta de luz": "Muévela a un lugar más iluminado.",
      "Exceso de riego": "Deja secar el sustrato varios días."
    };
    setDiagnosisResult(map[diagnosis]);
  };

  /* ---------------- CALENDARIO ---------------- */
  const saveWateringDate = () => {
    if (!wateringDate) return;
    setSavedDate(wateringDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8">

      {/* ENCABEZADO */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-green-900">🌱 Zona VIP Premium</h1>
        <p className="mt-4 text-xl text-green-700">
          Herramientas reales para cuidar tus plantas como experto
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* CALENDARIO */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">📅 Calendario de riego</h3>
          <input
            type="date"
            value={wateringDate}
            onChange={(e) => setWateringDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={saveWateringDate}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
          >
            Guardar fecha
          </button>
          {savedDate && <p className="mt-2">✅ Próximo riego: {savedDate}</p>}
        </div>

        {/* DIAGNÓSTICO */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">🧪 Diagnóstico</h3>
          <select
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full p-2 border rounded"
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
          {diagnosisResult && <p className="mt-3">{diagnosisResult}</p>}
        </div>

        {/* HUMEDAD */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">💧 Humedad</h3>
          <p>{humidity}%</p>
          <input
            type="range"
            min="10"
            max="100"
            value={humidity}
            onChange={(e) => handleHumidity(e.target.value)}
            className="w-full"
          />
          {humidityMsg && <p className="mt-2">{humidityMsg}</p>}
        </div>

        {/* CALCULADORA */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-green-700 mb-2">🧮 Calculadora de riego</h3>
          <input
            value={potSize}
            onChange={(e) => setPotSize(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Tamaño de maceta (cm)"
          />
          <button
            onClick={calculateWater}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
          >
            Calcular
          </button>
          {wateringResult && <p className="mt-2">{wateringResult}</p>}
        </div>

        {/* TEST */}
        <div className="bg-white p-5 rounded-2xl shadow-lg col-span-1 md:col-span-2">
          <h3 className="font-bold text-green-700 mb-4 text-xl">🧠 Mini Test</h3>

          {quizStep === 0 && (
            <>
              <p>¿Prefieres sol o sombra?</p>
              <button onClick={() => answerQuiz("sol")} className="btn">Sol</button>
              <button onClick={() => answerQuiz("sombra")} className="btn ml-3">Sombra</button>
            </>
          )}

          {quizStep === 1 && (
            <>
              <p>¿Crecimiento rápido?</p>
              <button onClick={() => answerQuiz("rapido")} className="btn">Sí</button>
              <button onClick={() => answerQuiz("lento")} className="btn ml-3">No</button>
            </>
          )}

          {quizResult && <p className="mt-4 text-xl">{quizResult}</p>}
        </div>

      </div>
    </div>
  );
}
