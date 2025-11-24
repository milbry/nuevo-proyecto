import React from 'react';
import { PLANTS } from './data.js';
import Card from './Card.jsx';

export default function Featured(){
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Destacadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANTS.slice(0,6).map(p => <Card key={p.id} plant={p} />)}
      </div>
    </div>
  );
}
