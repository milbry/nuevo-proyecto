// --- src/components/PlantPage.jsx ---

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, ACCESSORIES } from '../components/data.js'; 
import CommentsFull from './ComentsFull.jsx';

// Importar iconos para los botones de cantidad (Asegúrese de tener react-icons instalado)
import { HiShoppingCart, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'; 

export default function PlantPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const plant = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  // 1. ESTADOS DE COMPRA
  const [plantInCart, setPlantInCart] = useState(false);
  const [accessoriesInCart, setAccessoriesInCart] = useState({});
  // AÑADIDO: Estado para la cantidad seleccionada (inicia en 1)
  const [quantity, setQuantity] = useState(1); 
  
  // 2. LÓGICA DE CANTIDAD
  const isOutOfStock = plant.stock === 0;

  // Asegura que la cantidad siempre esté entre 1 y el stock disponible
  const handleQuantityChange = (newQuantity) => {
    // Convierte a número y asegura que sea al menos 1
    let value = Math.max(1, parseInt(newQuantity) || 1); 
    // Asegura que no exceda el stock
    value = Math.min(plant.stock, value); 
    setQuantity(value);
  };
  
  // Función de Simulación de Compra para la planta principal
  const handleBuyPlant = () => {
    setPlantInCart(true);
    // MODIFICADO: Muestra la cantidad en el mensaje de alerta
    alert(`🎉 ¡${quantity} unidad(es) de ${plant.name} añadido(s) al carrito por $${(plant.price * quantity).toFixed(2)}!`);
  };

  // Función de Simulación de Compra para accesorios (no modificada)
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
            
            {/* Precio Total basado en la cantidad seleccionada */}
            <div className="text-5xl font-extrabold text-green-700 mb-4">
                ${ (plant.price * quantity).toFixed(2) } {/* MODIFICADO */}
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
            
            {/* --- 3. SELECCIÓN DE CANTIDAD (NUEVO UI) --- */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-white rounded-lg border">
                <label htmlFor="quantity" className="font-semibold text-gray-700 flex-shrink-0">
                    Elegir Cantidad:
                </label>
                
                {/* Botón para restar cantidad */}
                <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isOutOfStock || plantInCart}
                    className={`p-1 rounded-full transition ${quantity <= 1 || isOutOfStock || plantInCart ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                >
                    <HiMinusCircle size={30} />
                </button>
                
                {/* Input de cantidad */}
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    min="1"
                    max={plant.stock}
                    className="w-16 text-center border-none focus:ring-2 focus:ring-green-500 rounded-lg p-2 font-bold text-xl"
                    disabled={isOutOfStock || plantInCart}
                />
                
                {/* Botón para sumar cantidad */}
                <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= plant.stock || isOutOfStock || plantInCart}
                    className={`p-1 rounded-full transition ${quantity >= plant.stock || isOutOfStock || plantInCart ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                >
                    <HiPlusCircle size={30} />
                </button>
            </div>
            {/* ------------------------------------------- */}
            
            {/* Botón de Compra SIMULADA */}
            {plantInCart || isOutOfStock ? (
                <button
                    disabled
                    className="w-full bg-gray-500 text-white font-bold py-3 rounded-xl cursor-not-allowed text-xl"
                >
                    {isOutOfStock ? '🚫 AGOTADO' : '✅ Producto Añadido'}
                </button>
            ) : (
                <button
                    onClick={handleBuyPlant}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition duration-300 text-xl flex items-center justify-center gap-2"
                >
                    <HiShoppingCart size={24} /> Comprar ({quantity})
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