import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStateLocal } from "./components/hooks.js";

// Componentes Existentes
import Nav from './components/Nav.jsx';
import Home from './components/Home.jsx'; // Asumimos que contiene el listado de plantas (Grid)
import Auth from './components/Auth.jsx';
import Profile from './components/Profile.jsx';
import PrivateZone from './components/PrivateZone.jsx';
import PlantPage from './components/PlantPage.jsx';
import ContactSection from './components/ContactSection.jsx';
import Survey from './components/Survey.jsx';
import Footer from './components/Footer.jsx';

// NUEVOS Componentes de Accesorios
import AccessoriesGrid from './components/AccessoriesGrid.jsx'; 
import AccessoryPage from './components/AccessoryPage.jsx'; 


export default function App() {
  const { user, loading } = useAuthStateLocal();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Es importante que Nav tenga un Link a /accessories */}
      <Nav user={user} /> 

      {/* Contenido que empuja el footer hacia abajo */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rutas de Usuario */}
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/private" element={user ? <PrivateZone /> : <Navigate to="/auth" />} />
          
          {/* Rutas de Contenido y Servicios */}
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/survey" element={<Survey />} />
          
          {/* Rutas de PRODUCTOS */}
          <Route path="/plant/:id" element={<PlantPage />} />
          
          {/* NUEVAS RUTAS DE ACCESORIOS */}
          <Route path="/accessories" element={<AccessoriesGrid />} /> {/* Listado de todos los accesorios */}
          <Route path="/accessory/:id" element={<AccessoryPage />} /> {/* Detalle individual del accesorio */}
          
        </Routes>
      </main>

      <Footer />
    </div>
  );
}