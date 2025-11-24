import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase.js';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [mode, setMode] = useState('login');
  return (
    <div className="max-w-md mx-auto p-6 mt-8 bg-white rounded-xl shadow">
      {mode === 'login' ? <LoginForm switchMode={() => setMode('register')} /> : <RegisterForm switchMode={() => setMode('login')} />}
    </div>
  );

}

function LoginForm({ switchMode }) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const nav = useNavigate();
  async function go() { try { await signInWithEmailAndPassword(auth, email, pw); nav('/'); } catch (e) { alert(e.message); } }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ingresar</h2>
      <input className="w-full p-2 border rounded mb-3" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" />
      <input className="w-full p-2 border rounded mb-3" value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Contraseña" />
      <div className="flex gap-3">
        <button onClick={go} className="bg-green-700 text-white px-4 py-2 rounded">Entrar</button>
        <button onClick={() => signInWithPopup(auth, googleProvider)} className="bg-red-500 text-white px-4 py-2 rounded">Google</button>
      </div>
      <p className="mt-4 text-sm">¿No tienes cuenta? <button onClick={switchMode} className="text-emerald-600">Regístrate</button></p>
    </div>
  );
}

function RegisterForm({ switchMode }) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [name, setName] = useState('');
  const nav = useNavigate();
  async function go() { try { const { user } = await createUserWithEmailAndPassword(auth, email, pw); await updateProfile(user, { displayName: name }); nav('/'); } catch (e) { alert(e.message); } }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
      <input className="w-full p-2 border rounded mb-3" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
      <input className="w-full p-2 border rounded mb-3" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" />
      <input className="w-full p-2 border rounded mb-3" value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Contraseña" />
      <div className="flex gap-3">
        <button onClick={go} className="bg-green-700 text-white px-4 py-2 rounded">Crear</button>
      </div>
      <p className="mt-4 text-sm">¿Ya tienes cuenta? <button onClick={switchMode} className="text-emerald-600">Entrar</button></p>
    </div>
  );
}
