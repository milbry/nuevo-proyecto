// --- src/components/PlantPage.jsx ---
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, ACCESSORIES } from '../components/data.js'; 
import CommentsFull from './ComentsFull.jsx';
import { useCart } from './CartContext.jsx'; 
import { useAuthStateLocal } from "./hooks.js"; 

import { HiShoppingCart, HiMinusCircle, HiPlusCircle, HiArrowLeft } from 'react-icons/hi'; 

export default function PlantPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuthStateLocal(); 
  const { addToCart, cartItems } = useCart(); 
  const [quantity, setQuantity] = useState(1); 

  // 🛡️ ARREGLO 1: Forzamos que ambos IDs sean String para que se encuentren siempre
  const plant = PRODUCTS.find(p => String(p.id) === String(id));

  // 🛡️ ARREGLO 2: Si la planta no existe, frenamos el renderizado aquí.
  // Esto evita que el código intente leer plant.care y explote.
  if (!plant) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600">⚠️ Planta no encontrada</h2>
        <p className="text-gray-600 mb-6">No pudimos encontrar el producto con el ID: {id}</p>
        <button onClick={() => nav('/grid')} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
          <HiArrowLeft /> Volver al catálogo
        </button>
      </div>
    );
  }

  // Lógica de estado (solo se ejecuta si la planta existe)
  const isOutOfStock = plant.stock === 0;
  const isPlantInCart = cartItems.some(item => String(item.id) === String(plant.id));
  
  const handleBuyPlant = () => {
    if (!user) {
      alert("⚠️ Debes iniciar sesión para añadir productos al carrito.");
      nav('/auth');
      return;
    }
    addToCart(plant, quantity); 
    alert(`🎉 ¡${plant.name} añadida!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <img src={plant.image} alt={plant.name} className="w-full h-96 object-cover rounded-lg shadow-md" />
        </div>

        <aside className="lg:col-span-1 p-4 bg-green-50 rounded-lg">
            <h1 className="text-4xl font-extrabold text-green-900 mb-2">{plant.name}</h1>
            <div className="text-5xl font-extrabold text-green-700 mb-4">${plant.price}</div>
            
            <button
                onClick={handleBuyPlant}
                disabled={isPlantInCart || isOutOfStock}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl transition text-xl"
            >
                {isPlantInCart ? '✅ En el Carrito' : isOutOfStock ? '🚫 AGOTADO' : 'Añadir al Carrito'}
            </button>
        </aside>
      </div>

      <div className="mt-10">
        <h3 className="text-3xl font-bold text-green-800 mb-4 border-b pb-2">Guía de Cuidado</h3>
        <div className="text-gray-700 space-y-4">
            <p>{plant.description}</p>
            
            {/* 🛡️ ARREGLO 3: Usamos ?. para que si 'care' no existe, no explote la página */}
            <ul className="list-disc list-inside space-y-2">
                <li>💧 **Riego:** {plant.care?.watering || "No especificado"}</li>
                <li>💡 **Luz:** {plant.care?.light || "No especificado"}</li>
                <li>🌡️ **Temperatura:** {plant.care?.temperature || "No especificado"}</li>
            </ul>
        </div>
      </div>
    </div>
  );
}