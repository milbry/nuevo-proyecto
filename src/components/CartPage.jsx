// --- src/components/CartPage.jsx ---
import React from 'react';
import { HiShoppingCart, HiTrash, HiArrowRight, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext.jsx'; 
// 1. Importamos el hook de autenticación
import { useAuthStateLocal } from "./hooks.js"; // 👈 ¡NUEVO!

export default function CartPage() {
    const nav = useNavigate();
    const { cartItems, removeFromCart, clearCart } = useCart(); 
    
    // 2. Obtenemos el estado del usuario
    const { user } = useAuthStateLocal(); // 👈 ¡NUEVO!

    // Cálculo del total dinámico (sin cambios)
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0.00 : 7.50; 
    const total = subtotal + shipping;

    // 🚨 Lógica para el pago con Guardián de Autenticación
    const handleCheckout = () => {
        // 3. VERIFICACIÓN DE AUTENTICACIÓN
        if (!user) {
            alert("🔒 Debes iniciar sesión para proceder a la finalización y pago de tu pedido.");
            nav('/auth'); // Redirige al login/registro
            return;
        }

        const confirmCheckout = window.confirm(
            `Confirmar Pago: Total $${total.toFixed(2)}. ¿Desea proceder a finalizar la compra?`
        );
        
        if (confirmCheckout) {
            alert(`✅ Pedido Confirmado! Nos comunicaremos contigo al número 📱 +51 987 654 321 para coordinar el pago y la entrega. ¡Muchas gracias!`);
            clearCart(); 
            nav('/'); 
        }
    };

    if (cartItems.length === 0) {
        // ... (Renderizado de carrito vacío sin cambios) ...
        return (
            <div className="max-w-4xl mx-auto py-24 px-4 text-center min-h-screen">
                <HiShoppingCart size={80} className="text-gray-300 mx-auto mb-4" />
                <h1 className="text-3xl font-extrabold text-gray-700 mb-2">Tu Carrito Está Vacío</h1>
                <p className="text-gray-500 mb-8">Parece que aún no has añadido ninguna planta o accesorio.</p>
                <button 
                    onClick={() => nav('/accessories')} 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                    <HiArrowRight size={20} /> Empezar a Comprar
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
            <h1 className="text-4xl font-extrabold text-green-900 mb-8 flex items-center gap-3">
                <HiShoppingCart size={36} /> Tu Carrito ({cartItems.length} tipos de producto)
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1 y 2: Lista de Ítems Dinámica (sin cambios) */}
                <div className="lg:col-span-2 space-y-4">
                    {/* ... mapeo de cartItems ... */}
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Cantidad: <span className="font-semibold text-green-700">{item.quantity}</span> | 
                                    Unitario: ${item.price.toFixed(2)}
                                </p>
                            </div>
                            
                            <div className="text-right">
                                <p className="font-extrabold text-xl text-green-800">
                                    Total: ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button 
                                    onClick={() => removeFromCart(item.id)} 
                                    className="text-red-500 hover:text-red-700 transition mt-1 text-sm flex items-center gap-1 ml-auto"
                                >
                                    <HiTrash size={16} /> Quitar
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        onClick={() => nav('/accessories')} 
                        className="text-green-600 hover:text-green-700 font-semibold mt-4 flex items-center gap-1"
                    >
                        <HiArrowRight className="transform rotate-180" size={20} /> Continuar Comprando
                    </button>
                </div>
                
                {/* Columna 3: Resumen del Pedido Dinámico (sin cambios) */}
                <div className="lg:col-span-1 bg-green-50 p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">Resumen de Compra</h2>
                    
                    {/* ... Totales y Envío ... */}

                    <button
                        onClick={handleCheckout} // 👈 Ahora usa la función protegida
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition duration-300 text-xl flex items-center justify-center gap-2"
                    >
                        <HiOutlineCurrencyDollar size={24} /> Finalizar y Pagar
                    </button>
                    
                    <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 rounded-lg text-sm text-center">
                        <p className="font-bold text-yellow-800 mb-1">Nota Importante de Pago:</p>
                        <p className="text-yellow-700">El pago se coordina por WhatsApp una vez finalizado el pedido. Comunicate al numero **+51 928 345 384**.</p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}