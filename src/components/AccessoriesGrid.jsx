// --- src/components/AccessoriesGrid.jsx ---

import React, { useState } from 'react';
import { ACCESSORIES } from './data.js'; // Importamos solo los accesorios
import AccessoryCard from './AccessoryCard.jsx'; // Nuevo Card para accesorios

export default function AccessoriesGrid(){
  const [q, setQ] = useState(''); // Estado para búsqueda
  const [cat, setCat] = useState('All'); // Estado para filtro de categoría
  
  // Extraer categorías únicas de accesorios
  const cats = ['All', ...Array.from(new Set(ACCESSORIES.map(a => a.category)))];
  
  // Filtrar accesorios por búsqueda y categoría
  const filtered = ACCESSORIES.filter(a => 
    (cat === 'All' || a.category === cat) && 
    (q === '' || a.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        🛍️ Explora Nuestros Accesorios Esenciales
      </h2>

      {/* Barra de búsqueda y filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-green-50 rounded-lg shadow-sm">
        <input 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          placeholder="Buscar accesorios..." 
          className="flex-1 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" 
        />
        <select 
          value={cat} 
          onChange={e => setCat(e.target.value)} 
          className="p-3 border border-green-200 rounded-lg bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid de Accesorios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(accessory => <AccessoryCard key={accessory.id} accessory={accessory} />)}
      </div>
    </div>
  );
}