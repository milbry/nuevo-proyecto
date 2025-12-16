// --- src/components/AccessoryPage.jsx ---

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ACCESSORIES } from './data.js'; // Importamos solo ACCESSORIES

export default function AccessoryPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const accessory = ACCESSORIES.find(a => a.id === id);

  // Si el accesorio no se encuentra, redirige o muestra un error
  if (!accessory) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600 font-bold">
        Accesorio no encontrado.
        <button onClick={() => nav('/accessories')} className="block mx-auto mt-4 px-4 py-2 bg-green-600 text-white rounded">
          Volver a Accesorios
        </button>
      </div>
    );
  }

  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    alert(`🎉 ¡${accessory.name} ha sido añadido al carrito por $${accessory.price.toFixed(2)}!`);
    // Lógica para añadir al carrito global aquí
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Columna 1: Imagen Principal del Accesorio */}
        <div>
            <img 
                src={accessory.image} 
                alt={accessory.name} 
                className="w-full h-80 object-cover rounded-lg shadow-md" 
            />
        </div>

        {/* Columna 2: Info de Compra y Detalles */}
        <aside className="p-4 bg-green-50 rounded-lg shadow-inner flex flex-col justify-between">
            <div>
                <h1 className="text-4xl font-extrabold text-green-900 mb-2">{accessory.name}</h1>
                <p className="text-xl font-semibold text-gray-700 mb-4">{accessory.category}</p>
                
                <div className="text-5xl font-extrabold text-green-700 mb-4">
                    ${accessory.price.toFixed(2)}
                </div>
                
                <div className="space-y-2 mb-6">
                    <span className={`px-3 py-1 rounded-full font-semibold ${accessory.stock > 10 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        Stock: {accessory.stock} unidades
                    </span>
                </div>
                
                <p className="mt-2 text-slate-700 text-lg border-b pb-4 mb-4">{accessory.desc}</p>
            </div>
            
            {/* Botón de Compra SIMULADA */}
            {addedToCart ? (
                <button
                    disabled
                    className="w-full bg-gray-500 text-white font-bold py-3 rounded-xl cursor-not-allowed text-xl"
                >
                    ✅ Añadido al Carrito
                </button>
            ) : (
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition duration-300 text-xl"
                >
                    🛒 Comprar {accessory.name}
                </button>
            )}
            
            <div className="mt-4 text-center">
                <button onClick={() => nav('/accessories')} className="text-sm text-green-600 hover:underline">
                    Ver más accesorios
                </button>
            </div>
        </aside>
      </div>

      {/* Sección de Tips del Accesorio */}
      {accessory.tips && accessory.tips.length > 0 && (
        <div className="mt-10 p-5 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Consejos para {accessory.name}</h3>
          <ul className="list-disc ml-5 text-slate-700 space-y-1">
            {accessory.tips.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
      )}
      
      {/* Puedes añadir una sección de reseñas o preguntas si deseas */}
      {/* <div className="mt-12 pt-6 border-t">
        <CommentsFull accessoryId={accessory.id} /> // Si quieres comentarios específicos para accesorios
      </div> */}
    </div>
  );
}