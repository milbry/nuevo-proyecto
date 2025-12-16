// --- src/components/AccessoryPage.jsx ---

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ACCESSORIES } from './data.js';
// Importamos el hook del contexto del carrito
import { useCart } from './CartContext.jsx'; // 👈 ¡NUEVO!

// Importar iconos para los botones de cantidad
import { HiShoppingCart, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'; 

export default function AccessoryPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const accessory = ACCESSORIES.find(a => a.id === id);
    
  // 1. USAR CONTEXTO DEL CARRITO
  const { addToCart, cartItems } = useCart(); // 👈 Obtenemos la función y la lista de ítems

  // Si el accesorio no se encuentra, redirige o muestra un error
  if (!accessory) {
    // ... (Código de manejo de error sin cambios)
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600 font-bold">
        Accesorio no encontrado.
        <button onClick={() => nav('/accessories')} className="block mx-auto mt-4 px-4 py-2 bg-green-600 text-white rounded">
          Volver a Accesorios
        </button>
      </div>
    );
  }

  // ESTADOS DE CANTIDAD
  const [quantity, setQuantity] = useState(1); 

  // Lógica de Stock
  const isOutOfStock = accessory.stock === 0;
    
  // 2. VERIFICAR SI YA ESTÁ EN EL CARRITO (Para deshabilitar el botón si ya está el producto)
  // Utilizamos cartItems del contexto para esto
  const isAddedToCart = cartItems.some(item => item.id === accessory.id); 

  // LÓGICA DE MANEJO DE CANTIDAD
  const handleQuantityChange = (newQuantity) => {
    // Convierte a número y asegura que sea al menos 1
    let value = Math.max(1, parseInt(newQuantity) || 1); 
    // Asegura que no exceda el stock
    value = Math.min(accessory.stock, value); 
    setQuantity(value);
  };

  // 3. FUNCIÓN DE AÑADIR AL CARRITO REAL
  const handleAddToCart = () => {
    // Utilizamos la función del contexto
    addToCart(accessory, quantity); 
    
    // Notificación al usuario
    alert(`🎉 ¡${quantity} unidad(es) de ${accessory.name} añadida(s) al carrito! Total actual: $${(accessory.price * quantity).toFixed(2)}.`);
    // Ya no necesitamos setAddedToCart(true); porque la verificación de si está en el carrito es global
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
                
                {/* PRECIO TOTAL DINÁMICO */}
                <div className="text-5xl font-extrabold text-green-700 mb-4">
                    ${ (accessory.price * quantity).toFixed(2) } 
                </div>
                
                <div className="space-y-2 mb-6">
                    <span className={`px-3 py-1 rounded-full font-semibold ${accessory.stock > 10 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        Stock: {accessory.stock} unidades
                    </span>
                </div>
                
                <p className="mt-2 text-slate-700 text-lg border-b pb-4 mb-4">{accessory.desc}</p>
            </div>

            {/* --- SELECCIÓN DE CANTIDAD --- */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-white rounded-lg border">
                <label htmlFor="quantity" className="font-semibold text-gray-700 flex-shrink-0">
                    Elegir Cantidad:
                </label>
                
                {/* Botón para restar cantidad */}
                <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isOutOfStock || isAddedToCart}
                    className={`p-1 rounded-full transition ${quantity <= 1 || isOutOfStock || isAddedToCart ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
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
                    max={accessory.stock}
                    className="w-16 text-center border-none focus:ring-2 focus:ring-green-500 rounded-lg p-2 font-bold text-xl"
                    disabled={isOutOfStock || isAddedToCart}
                />
                
                {/* Botón para sumar cantidad */}
                <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= accessory.stock || isOutOfStock || isAddedToCart}
                    className={`p-1 rounded-full transition ${quantity >= accessory.stock || isOutOfStock || isAddedToCart ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                >
                    <HiPlusCircle size={30} />
                </button>
            </div>
            
            {/* Botón de Compra REAL */}
            {isAddedToCart || isOutOfStock ? (
                <button
                    disabled
                    className="w-full bg-gray-500 text-white font-bold py-3 rounded-xl cursor-not-allowed text-xl"
                >
                    {isOutOfStock ? '🚫 AGOTADO' : '✅ En el Carrito'}
                </button>
            ) : (
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition duration-300 text-xl flex items-center justify-center gap-2"
                >
                    <HiShoppingCart size={24} /> Añadir ({quantity}) al Carrito
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
      
    </div>
  );
}