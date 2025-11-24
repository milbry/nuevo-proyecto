import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Card({ plant }){
  const nav = useNavigate();
  const [liked, setLiked] = useState(false);
  return (
    <motion.article whileHover={{ scale:1.02 }} className="bg-white rounded-xl overflow-hidden shadow">
      <div className="relative h-44">
        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
        <button onClick={() => setLiked(s => !s)} className={`absolute top-3 right-3 p-2 bg-white/80 rounded-full ${liked ? 'text-red-600' : 'text-gray-700'}`}>{liked ? '♥' : '♡'}</button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-green-800">{plant.name}</h3>
        <p className="text-sm text-slate-600">{plant.category} • {plant.difficulty}</p>
        <div className="mt-3 flex justify-between items-center">
          <button onClick={() => nav(`/plant/${plant.id}`)} className="text-sm text-emerald-600">Ver ficha</button>
          <div className="text-xs text-slate-500">{plant.light}</div>
        </div>
      </div>
    </motion.article>
  );
}

