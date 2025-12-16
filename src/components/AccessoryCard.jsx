// --- src/components/AccessoryCard.jsx ---

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AccessoryCard({ accessory }){
  const nav = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false); // Estado para simular "añadido al carrito"

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que se dispare la navegación
    setAddedToCart(true);
    alert(`🛒 ¡${accessory.name} añadido al carrito por $${accessory.price.toFixed(2)}!`);
    // Aquí podrías integrar un contexto de carrito real si lo tuvieras
  };

  return (
    <motion.article 
      whileHover={{ scale:1.02, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }} 
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-100 cursor-pointer"
      onClick={() => nav(`/accessory/${accessory.id}`)} // Navega a la página de detalle del accesorio
    >
      <div className="relative h-44">
        {/* Imagen del accesorio */}
        <img src={accessory.image} alt={accessory.name} className="w-full h-full object-cover transition duration-300 hover:opacity-90" />
      </div>
      
      <div className="p-4 flex flex-col justify-between h-auto"> {/* Ajusta altura para contenido */}
        <div>
          <h3 className="font-bold text-xl text-green-800 mb-1">{accessory.name}</h3>
          <p className="text-sm text-slate-600">{accessory.category}</p>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{accessory.desc}</p> {/* Limita descripción a 2 líneas */}
        </div>
        
        <div className="mt-4 flex flex-col items-center">
          <span className="text-2xl font-extrabold text-green-700 mb-3">${accessory.price.toFixed(2)}</span>
          
          {addedToCart ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white font-bold py-2 rounded-lg cursor-not-allowed text-sm"
            >
              ✅ Añadido
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition duration-300 text-sm"
            >
              🛒 Añadir al Carrito
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}