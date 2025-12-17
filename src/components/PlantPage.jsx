// --- src/components/PlantPage.jsx ---

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, ACCESSORIES } from '../components/data.js'; 
import CommentsFull from './ComentsFull.jsx';
import { useCart } from './CartContext.jsx'; 
import { useAuthStateLocal } from "./hooks.js"; 

// Iconos
import { HiShoppingCart, HiMinusCircle, HiPlusCircle, HiArrowLeft } from 'react-icons/hi'; 

export default function PlantPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuthStateLocal(); 
  const { addToCart, cartItems } = useCart(); 
  const [quantity, setQuantity] = useState(1); 

  // 🛡️ CORRECCIÓN CLAVE: Convertimos ambos a String para evitar que falle la búsqueda
  // Si esto falla, la página se queda en blanco.
  const plant = PRODUCTS.find(p => String(p.id) === String(id));

  // 🚨 PROTECCIÓN ANTIPANTALLA EN BLANCO: 
  // Si no encuentra la planta, mostramos un error en lugar de dejar que el código explote.
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

  // Lógica una vez que confirmamos que la planta existe
  const isOutOfStock = plant.stock === 0;
  const isPlantInCart = cartItems.some(item => String(item.id) === String(plant.id));
  const isAccessoryInCart = (accessoryId) => cartItems.some(item => String(item.id) === String(accessoryId));
  
  const handleQuantityChange = (newQuantity) => {
    let value = Math.max(1, parseInt(newQuantity) || 1); 
    value = Math.min(plant.stock, value); 
    setQuantity(value);
  };
  
  const handleBuyPlant = () => {
    if (!user) {
      alert("⚠️ Debes iniciar sesión para añadir productos al carrito.");
      nav('/auth');
      return;
    }
    addToCart(plant, quantity); 
    alert(`🎉 ¡${quantity} unidad(es) de ${plant.name} añadida(s) al carrito!`);
  };

  const handleBuyAccessory = (accessory) => {
    if (!user) {
      alert("⚠️ Debes iniciar sesión para añadir accesorios al carrito.");
      nav('/auth');
      return;
    }
    addToCart(accessory, 1); 
    alert(`🛒 Accesorio: ${accessory.name} añadido.`);
  };

  const relatedAccessories = plant.accessories
    ? ACCESSORIES.filter(acc => plant.accessories.includes(acc.id))
    : [];
    
  const petIndicatorClass = plant.petFriendly 
    ? "bg-emerald-100 text-emerald-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
            <img 
                src={plant.image} 
                alt={plant.name} 
                className="w-full h-96 object-cover rounded-lg shadow-md" 
            />
        </div>

        <aside className="lg:col-span-1 p-4 bg-green-50 rounded-lg shadow-inner">
            <h1 className="text-4xl font-extrabold text-green-900 mb-2">{plant.name}</h1>
            <p className="text-xl font-semibold text-yellow-700 mb-4">✨ {plant.marketingTag}</p>
            <div className="text-5xl font-extrabold text-green-700 mb-4">
                ${ (plant.price * quantity).toFixed(2) } 
            </div>
            
            <div className="space-y-2 mb-6">
                <span className={`px-3 py-1 rounded-full font-semibold ${petIndicatorClass}`}>
                    {plant.petFriendly ? '✅ Pet-Friendly' : '❌ Tóxica para Mascotas'}
                </span>
                <span className={`px-3 py-1 rounded-full font-semibold ${plant.stock > 5 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    Stock: {plant.stock} unidades
                </span>
            </div>
            
            <div className="flex items-center gap-4 mb-6 p-3 bg-white rounded-lg border">
                <label className="font-semibold text-gray-700">Cantidad:</label>
                <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isOutOfStock || isPlantInCart} 
                    className="text-green-600 disabled:text-gray-400"
                >
                    <HiMinusCircle size={30} />
                </button>
                <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-12 text-center font-bold text-xl border-none"
                />
                <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= plant.stock || isOutOfStock || isPlantInCart} 
                    className="text-green-600 disabled:text-gray-400"
                >
                    <HiPlusCircle size={30} />
                </button>
            </div>
            
            {isPlantInCart || isOutOfStock ? ( 
                <button disabled className="w-full bg-gray-500 text-white font-bold py-3 rounded-xl cursor-not-allowed text-xl">
                    {isOutOfStock ? '🚫 AGOTADO' : '✅ En el Carrito'}
                </button>
            ) : (
                <button
                    onClick={handleBuyPlant}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-xl flex items-center justify-center gap-2"
                >
                    <HiShoppingCart size={24} /> Añadir ({quantity}) al Carrito
                </button>
            )}
        </aside>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold text-green-800 mb-4 border-b pb-2">Guía de Cuidado</h3>
            <div className="text-gray-700 space-y-4">
                <p>{plant.description}</p>
                {/* 🛡️ Uso de ?. para evitar errores si care no existe */}
                <ul className="list-disc list-inside space-y-2">
                    <li>💧 **Riego:** {plant.care?.watering}</li>
                    <li>💡 **Luz:** {plant.care?.light}</li>
                    <li>🌡️ **Temperatura:** {plant.care?.temperature}</li>
                </ul>
            </div>
        </div>

        <div className="lg:col-span-1 p-5 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">🔥 Accesorios</h3>
          <div className="space-y-3">
            {relatedAccessories.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <span className="text-sm font-semibold">{acc.icon} {acc.name}</span>
                <button
                  onClick={() => handleBuyAccessory(acc)}
                  disabled={isAccessoryInCart(acc.id)} 
                  className={`px-3 py-1 text-xs rounded-full font-bold ${
                    isAccessoryInCart(acc.id) ? 'bg-gray-300' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {isAccessoryInCart(acc.id) ? 'Añadido' : `$${acc.price.toFixed(2)}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t">
        <CommentsFull plantId={plant.id} />
      </div>
    </div>
  );
}