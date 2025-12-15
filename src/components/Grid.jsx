// --- src/components/Grid.jsx ---

import React, { useState } from 'react';
import { PRODUCTS } from './data.js'; // CORREGIDO: Usar PRODUCTS
import Card from './Card.jsx';

export default function Grid(){
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  // Usar PRODUCTS en lugar de PLANTS
  const cats = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))]; 
  const filtered = PRODUCTS.filter(p => (cat === 'All' || p.category === cat) && (q === '' || p.name.toLowerCase().includes(q.toLowerCase()))); 
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar plantas..." className="flex-1 p-2 border rounded" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="p-2 border rounded">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => <Card key={p.id} plant={p} />)}
      </div>
    </div>
  );
}