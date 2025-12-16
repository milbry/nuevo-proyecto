import React from 'react';
import { PRODUCTS } from './data.js';
import Card from './Card.jsx';

export default function Featured(){
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Destacadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRODUCTS.slice(0,6).map(p => <Card key={p.id} plant={p} />)}
      </div>
    </div>
  );
}
