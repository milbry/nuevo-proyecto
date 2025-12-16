import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';

export function useAuthStateLocal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        
        // --- 🔑 LÓGICA DE SUSCRIPCIÓN SIMULADA ---
        // Asumimos que si el email contiene 'premium', el usuario tiene acceso VIP.
        const isPremium = firebaseUser.email.includes('premium');
        
        // Creamos un objeto de usuario extendido
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // Añadimos la nueva propiedad
          isPremium: isPremium, 
          // Puede incluir otras propiedades de firebaseUser si las necesita (displayName, photoURL, etc.)
        });
      } else {
        // Si no hay usuario, el estado es null
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { user, loading };
}