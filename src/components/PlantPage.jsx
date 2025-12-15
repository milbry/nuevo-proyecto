import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, ACCESSORIES } from './data.js'; // Importamos PRODUCTS
import CommentsFull from './ComentsFull.jsx';

export default function PlantPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const plant = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  // Estado para simular la compra
  const [plantInCart, setPlantInCart] = useState(false);
  const [accessoriesInCart, setAccessoriesInCart] = useState({});
  
  // Función de Simulación de Compra para la planta principal
  const handleBuyPlant = () => {
    setPlantInCart(true);
    // Simulación: se podría añadir al carrito global aquí
    alert(`🎉 ¡${plant.name} añadido al carrito por $${plant.price.toFixed(2)}!`);
  };

  // Función de Simulación de Compra para accesorios
  const handleBuyAccessory = (accessory) => {
    setAccessoriesInCart(prev => ({ ...prev, [accessory.id]: true }));
    alert(`🛒 Accesorio: ${accessory.name} añadido.`);
  };

  // Obtener accesorios relacionados
  const relatedAccessories = plant.accessories
    ? ACCESSORIES.filter(acc => plant.accessories.includes(acc.id))
    : [];
    
  // Estilo para los indicadores de amigable
  const petIndicatorClass = plant.petFriendly 
    ? "bg-emerald-100 text-emerald-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      
      {/* Sección 1: Imagen, Título y Compra */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna 1: Imagen Principal */}
        <div className="lg:col-span-2">
            <img 
                src={plant.image} 
                alt={plant.name} 
                className="w-full h-96 object-cover rounded-lg shadow-md" 
            />
        </div>

        {/* Columna 2: Info de Compra y Marketing */}
        <aside className="lg:col-span-1 p-4 bg-green-50 rounded-lg shadow-inner">
            <h1 className="text-4xl font-extrabold text-green-900 mb-2">{plant.name}</h1>
            
            {/* Hook de Marketing */}
            <p className="text-xl font-semibold text-yellow-700 mb-4">
                ✨ {plant.marketingTag}
            </p>
            
            <div className="text-5xl font-extrabold text-green-700 mb-4">
                ${plant.price.toFixed(2)}
            </div>
            
            {/* Indicadores Clave de Marketing */}
            <div className="space-y-2 mb-6">
                <span className={`px-3 py-1 rounded-full font-semibold ${petIndicatorClass}`}>
                    {plant.petFriendly ? '✅ Pet-Friendly' : '❌ Tóxica para Mascotas'}
                </span>
                <span className={`px-3 py-1 rounded-full font-semibold ${plant.stock > 5 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    Stock: {plant.stock} unidades
                </span>
            </div>
            
            {/* Botón de Compra SIMULADA */}
            {plantInCart ? (
                <button
                    disabled
                    className="w-full bg-gray-500 text-white font-bold py-3 rounded-xl cursor-not-allowed text-xl"
                >
                    ✅ Producto Añadido
                </button>
            ) : (
                <button
                    onClick={handleBuyPlant}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition duration-300 text-xl"
                >
                    🛒 Comprar {plant.name}
                </button>
            )}
            
            <div className="mt-4 text-center">
                <button onClick={() => nav('/grid')} className="text-sm text-green-600 hover:underline">
                    Continuar comprando
                </button>
            </div>
        </aside>
      </div>

      {/* Sección 2: Descripción y Cross-Selling */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna 1 y 2: Guía Rápida y Tips */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-green-800 mb-3">Descripción y Cuidados</h2>
          <p className="mt-2 text-slate-700 text-lg border-b pb-4 mb-4">{plant.desc}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
                <h3 className="font-bold text-lg text-green-700">Guía Rápida</h3>
                <ul className="list-disc ml-5 mt-2 text-slate-600 space-y-1">
                    <li>💡 Luz: <span className="font-semibold">{plant.light}</span></li>
                    <li>💧 Riego: <span className="font-semibold">{plant.water}</span></li>
                    <li>🌱 Dificultad: <span className="font-semibold">{plant.difficulty}</span></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg text-green-700">Tips Profesionales</h3>
                <ul className="list-disc ml-5 mt-2 text-slate-600 space-y-1">
                    {plant.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </div>
          </div>
        </div>

        {/* Columna 3: Cross-Selling (Venta Cruzada) */}
        <div className="lg:col-span-1 p-5 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
            🔥 Completa tu Compra: Accesorios
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            ¡Estos productos aseguran la salud y belleza de tu **{plant.name}**!
          </p>
          
          <div className="space-y-3">
            {relatedAccessories.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <div className="font-semibold text-green-800">{acc.icon} {acc.name}</div>
                  <div className="text-xs text-slate-500">{acc.desc}</div>
                </div>
                <button
                  onClick={() => handleBuyAccessory(acc)}
                  disabled={accessoriesInCart[acc.id]}
                  className={`ml-3 px-3 py-1 text-xs rounded-full font-bold transition ${
                    accessoriesInCart[acc.id] 
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {accessoriesInCart[acc.id] ? 'Añadido' : `$${acc.price.toFixed(2)}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sección 3: Comentarios */}
      <div className="mt-12 pt-6 border-t">
        <CommentsFull plantId={plant.id} />
      </div>
    </div>
  );
}