// --- src/components/Card.jsx ---

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Card({ plant }){
  const nav = useNavigate();
  const [liked, setLiked] = useState(false);
  
  // Estilos de Marketing
  const petFriendlyClass = plant.petFriendly 
    ? "bg-emerald-600 text-white" 
    : "bg-red-600 text-white";
    
  return (
    <motion.article whileHover={{ scale:1.02 }} className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-100">
      <div className="relative h-44 cursor-pointer" onClick={() => nav(`/plant/${plant.id}`)}>
        {/* Imagen Única de la planta */}
        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover transition duration-300 hover:opacity-90" />
        
        {/* Botón de Favoritos */}
        <button onClick={(e) => { e.stopPropagation(); setLiked(s => !s); }} 
                className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full ${liked ? 'text-red-600' : 'text-gray-700'} shadow-md transition`}>
          {liked ? '♥' : '♡'}
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-green-800">{plant.name}</h3>
            {/* Precio */}
            <span className="text-lg font-extrabold text-green-700">${plant.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-slate-600">
            {plant.category} • {plant.difficulty}
        </p>
        <div className="mt-3 flex justify-between items-center text-xs">
          
          {/* Indicador de Marketing */}
          <span className={`px-2 py-1 rounded-full text-white font-semibold ${petFriendlyClass}`}>
            {plant.petFriendly ? '🐶 Pet-Friendly' : '⚠️ No Pets'}
          </span>
          
          <button onClick={() => nav(`/plant/${plant.id}`)} className="text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition">
            Ver Ficha y Comprar
          </button>
        </div>
      </div>
    </motion.article>
  );
}