import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Survey() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const qs = [
    { q: "¿Cuánto riegas tus plantas?", opts: ["Diario", "2-3 veces/sem", "Semanal", "Nunca"] },
    { q: "¿Qué te interesa más?", opts: ["Decoración", "Medicinal", "Hobby", "Colección"] },
    { q: "¿Tienes mascotas?", opts: ["Sí", "No"] },
  ];

  function choose(i, opt) {
    setAnswers((a) => ({ ...a, [i]: opt }));
    setStep((s) => s + 1);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-2xl font-bold mb-4 text-green-600">Encuesta rápida</h3>

        {/* Indicador de progreso */}
        {step < qs.length && (
          <div className="w-full bg-green-100 rounded-full h-2 mb-4">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / qs.length) * 100}%` }}
            />
          </div>
        )}

        <AnimatePresence exitBeforeEnter>
          {step < qs.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-4 text-gray-700 font-medium">{qs[step].q}</p>
              <div className="grid grid-cols-2 gap-3">
                {qs[step].opts.map((o) => (
                  <motion.button
                    key={o}
                    onClick={() => choose(step, o)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 border border-green-300 rounded-xl bg-green-50 text-green-700 font-medium hover:bg-green-100 transition"
                  >
                    {o}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-green-700 font-medium mb-2">¡Gracias por participar!</p>
              <pre className="bg-green-50 p-3 rounded text-sm">{JSON.stringify(answers, null, 2)}</pre>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

