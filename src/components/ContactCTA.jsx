import React from 'react';
import { Link } from 'react-router-dom';
export default function ContactCTA(){
  return (
    <div className="bg-gradient-to-r from-green-200 to-emerald-100 p-8 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">¿Necesitas ayuda con tus plantas?</h3>
          <p className="text-slate-700">Contáctanos para asesorías personalizadas.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/contact" className="bg-green-700 text-white px-4 py-2 rounded">Contactar</Link>
          <a href="https://wa.me/51928345384" className="bg-white text-green-700 px-4 py-2 rounded">WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
