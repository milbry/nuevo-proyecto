// --- src/components/App.jsx ---

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStateLocal } from "./components/hooks.js"; 

// Componentes Existentes
import Nav from './components/Nav.jsx';
import Home from './components/Home.jsx'; 
import Auth from './components/Auth.jsx';
import Profile from './components/Profile.jsx';
import PrivateZone from './components/PrivateZone.jsx';
import PlantPage from './components/PlantPage.jsx';
import ContactSection from './components/ContactSection.jsx';
import Survey from './components/Survey.jsx';
import Footer from './components/Footer.jsx';

// Componentes de Tienda
import AccessoriesGrid from './components/AccessoriesGrid.jsx'; 
import AccessoryPage from './components/AccessoryPage.jsx'; 
import CartPage from './components/CartPage.jsx'; 

// Importamos el CartProvider
import { CartProvider } from './components/CartContext.jsx'; // 👈 ¡IMPORTANTE!

// Eliminamos el import de SubscriptionPage.jsx


export default function App() {
  const { user, loading } = useAuthStateLocal();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-green-700">
        Cargando... 🌿
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      
      {/* 1. EL CARRITO DEBE ENVOLVER TODOS LOS COMPONENTES QUE LO USAN (Nav, main, etc.) */}
      <CartProvider> 
          <Nav user={user} /> 

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Rutas de Usuario y Autenticación */}
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/profile" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
              
              {/* --- RUTA ZONA PRIVADA (SIMPLE AUTH) --- */}
              <Route 
                path="/private" 
                element={user ? <PrivateZone /> : <Navigate to="/auth" />} 
              />
              {/* -------------------------------------- */}
              
              {/* Rutas de Contenido y Servicios */}
              <Route path="/contact" element={<ContactSection />} />
              <Route path="/survey" element={<Survey />} />
              
              {/* Rutas de Tienda */}
              <Route path="/plant/:id" element={<PlantPage />} />
              <Route path="/accessories" element={<AccessoriesGrid />} /> 
              <Route path="/accessory/:id" element={<AccessoryPage />} /> 

              {/* RUTA DEL CARRITO DE COMPRAS */}
              <Route path="/cart" element={<CartPage />} /> 
              
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </main>

          <Footer />
      </CartProvider> {/* 2. CERRAMOS EL PROVIDER */}
    </div>
  );
}