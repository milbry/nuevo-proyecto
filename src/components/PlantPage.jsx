import React from 'react';
import { useParams } from 'react-router-dom';
import { PLANTS } from './data.js';
import CommentsFull from './ComentsFull.jsx';

export default function PlantPage(){
  const { id } = useParams();
  const plant = PLANTS.find(p => p.id === id) || PLANTS[0];
  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={plant.image} alt="" className="w-full h-72 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4 text-green-800">{plant.name}</h1>
      <p className="mt-2 text-slate-700">{plant.desc}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h3 className="font-semibold">Guía rápida</h3>
          <ul className="list-disc ml-6 mt-2 text-slate-600">
            <li>Luz: {plant.light}</li>
            <li>Riego: {plant.water}</li>
            <li>Dificultad: {plant.difficulty}</li>
          </ul>
        </div>
        <aside className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">Acciones</h4>
          <p className="text-sm text-slate-600 mt-2">Contacta por WhatsApp, guarda en favoritos, o comparte.</p>
        </aside>
      </div>
      <div className="mt-8">
        <CommentsFull plantId={plant.id} />
      </div>
    </div>
  );
}
