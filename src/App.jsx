import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStateLocal } from "./components/hooks.js";

import Nav from './components/Nav.jsx';
import Home from './components/Home.jsx';
import Auth from './components/Auth.jsx';
import Profile from './components/Profile.jsx';
import PrivateZone from './components/PrivateZone.jsx';
import PlantPage from './components/PlantPage.jsx';
import ContactSection from './components/ContactSection.jsx';
import Survey from './components/Survey.jsx';
import Footer from './components/Footer.jsx';

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
      <Nav user={user} />

      {/* Contenido que empuja el footer hacia abajo */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/plant/:id" element={<PlantPage />} />
          <Route path="/private" element={user ? <PrivateZone /> : <Navigate to="/auth" />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/survey" element={<Survey />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
