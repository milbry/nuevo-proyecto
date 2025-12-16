// --- src/components/CartContext.jsx ---
import React, { createContext, useContext, useState } from 'react';

// 1. Crear el Contexto
export const CartContext = createContext();

// 2. Crear el Provider
export const CartProvider = ({ children }) => {
    // Estado donde guardamos los items: [{ id, name, price, quantity, image }]
    const [cartItems, setCartItems] = useState([]);

    // 3. Función para añadir o actualizar un producto
    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                // El producto ya existe, actualiza la cantidad
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // El producto es nuevo, agrégalo
                return [...prevItems, { 
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity 
                }];
            }
        });
    };

    // 4. Función para eliminar completamente un producto
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // 5. Función para limpiar todo el carrito (usar después de un pago simulado)
    const clearCart = () => {
        setCartItems([]);
    };
    
    // Calcula la cantidad total de ítems en el carrito
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider 
            value={{ 
                cartItems, 
                addToCart, 
                removeFromCart,
                clearCart,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
    return useContext(CartContext);
};