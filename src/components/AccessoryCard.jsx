// --- src/components/AccessoryCard.jsx ---

import React from 'react'; // Eliminamos 'useState'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// 1. Importar hooks de Carrito y Autenticación
import { useCart } from './CartContext.jsx'; // 👈 ¡NUEVO!
import { useAuthStateLocal } from "./hooks.js"; // 👈 ¡NUEVO!

export default function AccessoryCard({ accessory }){
  const nav = useNavigate();
  
  // 2. Obtener el estado del usuario y las funciones del carrito
  const { user } = useAuthStateLocal(); 
  const { addToCart, cartItems } = useCart();
  
  // 3. Lógica para determinar si ya está en el carrito (usando el Contexto)
  const isAddedToCart = cartItems.some(item => item.id === accessory.id);

  // Lógica de stock (asumiendo que el accesorio tiene una propiedad 'stock')
  const isOutOfStock = accessory.stock === 0;

  // 🚨 FUNCIÓN DE COMPRA CON GUARDIÁN DE AUTENTICACIÓN
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que se dispare la navegación
    
    // 1. VERIFICACIÓN DE AUTENTICACIÓN
    if (!user) {
      alert("⚠️ Debes iniciar sesión para añadir productos al carrito.");
      nav('/auth'); // Redirige al login
      return;
    }

    // 2. Si está logueado, procede con la adición real al carrito
    addToCart(accessory, 1); // Asumimos cantidad 1 para el botón de compra rápida
    alert(`🛒 ¡${accessory.name} añadido al carrito por $${accessory.price.toFixed(2)}!`);
  };

  return (
    <motion.article 
      whileHover={{ scale:1.02, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }} 
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-100 cursor-pointer"
      onClick={() => nav(`/accessory/${accessory.id}`)} 
    >
      <div className="relative h-44">
        <img src={accessory.image} alt={accessory.name} className="w-full h-full object-cover transition duration-300 hover:opacity-90" />
      </div>
      
      <div className="p-4 flex flex-col justify-between h-auto">
        <div>
          <h3 className="font-bold text-xl text-green-800 mb-1">{accessory.name}</h3>
          <p className="text-sm text-slate-600">{accessory.category}</p>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{accessory.desc}</p>
        </div>
        
        <div className="mt-4 flex flex-col items-center">
          <span className="text-2xl font-extrabold text-green-700 mb-3">${accessory.price.toFixed(2)}</span>
          
          {/* 4. Lógica de botón basada en el estado real del Contexto */}
          {isAddedToCart || isOutOfStock ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white font-bold py-2 rounded-lg cursor-not-allowed text-sm"
            >
              {isOutOfStock ? '🚫 AGOTADO' : '✅ Añadido'}
            </button>
          ) : (
            <button
              onClick={handleAddToCart} // Ahora usa la función protegida
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition duration-300 text-sm"
            >
              🛒 Añadir al Carrito
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}