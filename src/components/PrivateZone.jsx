import React, { useState } from "react";

export default function PrivateZone() {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState("");

  const [humidity, setHumidity] = useState(40);
  const [humidityMsg, setHumidityMsg] = useState("");

  const [growth, setGrowth] = useState(10);
  const [dailyTaskDone, setDailyTaskDone] = useState(false);

  const [potSize, setPotSize] = useState("");
  const [wateringResult, setWateringResult] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState("");

  const [wateringDate, setWateringDate] = useState("");
  const [savedDate, setSavedDate] = useState("");

  /* HUMEDAD */
  const handleHumidity = (value) => {
    setHumidity(value);
    if (value < 30) setHumidityMsg("⚠️ Ambiente seco, pulveriza agua");
    else if (value <= 60) setHumidityMsg("✅ Humedad ideal");
    else setHumidityMsg("⚠️ Demasiada humedad, ventila");
  };

  /* CALCULADORA */
  const calculateWater = () => {
    if (!potSize) {
      setWateringResult("Ingresa un tamaño válido 🌱");
      return;
    }
    setWateringResult(`💧 ${potSize * 10} ml de agua recomendados`);
  };

  /* DIAGNÓSTICO */
  const diagnosePlant = () => {
    const solutions = {
      "Manchas marrones": "Puede ser exceso de sol",
      "Hojas amarillas": "Exceso de riego",
      "Falta de luz": "Muévela a un lugar iluminado",
      "Exceso de riego": "Deja secar el sustrato"
    };
    setDiagnosisResult(solutions[diagnosis]);
  };

  /* TEST */
  const answerQuiz = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    setQuizStep(quizStep + 1);

    if (newAnswers.length === 2) {
      if (newAnswers.includes("sol") && newAnswers.includes("rapido")) {
        setQuizResult("🌿 Eres una Monstera");
      } else if (newAnswers.includes("sombra")) {
        setQuizResult("🌵 Eres una Sansevieria");
      } else {
        setQuizResult("🌱 Eres un Pothos");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8">

      {/* BOTÓN WHATSAPP */}
      <a
        href="https://wa.me/51999999999"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-xl text-2xl"
      >
        💬
      </a>

      {/* ENCABEZADO */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-green-900">🌱 Zona VIP Premium</h1>
        <p className="mt-4 text-xl text-green-700">
          Todo lo que un amante de plantas podría soñar
        </p>
      </div>

      {/* FRASE */}
      <div className="mt-10 bg-white p-6 rounded-2xl text-center">
        ✨ “Las plantas no crecen comparándose, crecen a su ritmo.” ✨
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* PLAYLISTS */}
        {/* (IGUAL QUE ANTES, NO TOCADO) */}

        {/* CALENDARIO */}
        <div className="bg-white p-5 rounded-2xl">
          <h3>📅 Calendario de riego</h3>
          <input type="date" onChange={(e) => setWateringDate(e.target.value)} />
          <button onClick={() => setSavedDate(wateringDate)}>Guardar</button>
          {savedDate && <p>Próximo riego: {savedDate}</p>}
        </div>

        {/* DIAGNÓSTICO */}
        <div className="bg-white p-5 rounded-2xl">
          <h3>🧪 Diagnóstico</h3>
          <select onChange={(e) => setDiagnosis(e.target.value)}>
            <option>Manchas marrones</option>
            <option>Hojas amarillas</option>
            <option>Falta de luz</option>
            <option>Exceso de riego</option>
          </select>
          <button onClick={diagnosePlant}>Diagnosticar</button>
          {diagnosisResult && <p>{diagnosisResult}</p>}
        </div>

        {/* HUMEDAD */}
        <div className="bg-white p-5 rounded-2xl">
          <h3>💧 Humedad</h3>
          <input type="range" min="10" max="100" onChange={(e) => handleHumidity(e.target.value)} />
          <p>{humidity}%</p>
          <p>{humidityMsg}</p>
        </div>

        {/* CALCULADORA */}
        <div className="bg-white p-5 rounded-2xl">
          <h3>🧮 Calculadora de riego</h3>
          <input onChange={(e) => setPotSize(e.target.value)} />
          <button onClick={calculateWater}>Calcular</button>
          <p>{wateringResult}</p>
        </div>

        {/* TEST */}
        <div className="bg-white p-5 rounded-2xl col-span-2">
          <h3>🧠 Mini Test</h3>
          {quizStep === 0 && (
            <>
              <button onClick={() => answerQuiz("sol")}>Sol</button>
              <button onClick={() => answerQuiz("sombra")}>Sombra</button>
            </>
          )}
          {quizStep === 1 && (
            <>
              <button onClick={() => answerQuiz("rapido")}>Rápido</button>
              <button onClick={() => answerQuiz("lento")}>Lento</button>
            </>
          )}
          {quizResult && <h2>{quizResult}</h2>}
        </div>

      </div>
    </div>
  );
}
