import React, { useState, FormEvent } from 'react';
import * as firebaseService from '../services/firebaseService';
import Spinner from './Spinner';
import { CakeIcon } from './icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // Pre-fill with example credentials to guide the user.
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await firebaseService.login(email, password);
      onLoginSuccess();
    } catch (err) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (err instanceof firebase.FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Usuario o contraseña incorrectos.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El formato del email no es válido.';
            break;
          default:
            errorMessage = 'Error al iniciar sesión. Revisa la consola para más detalles.';
            console.error("Firebase Login Error:", err);
        }
      }
      setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in-up">
        <div className="text-center">
            <CakeIcon className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pastelería Admin</h1>
            <p className="text-gray-600 dark:text-gray-300">Bienvenido de vuelta</p>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm" role="alert">
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario (Email)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-pink-500 text-white font-bold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <><Spinner size="sm" /> Procesando...</> : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
            Utiliza las credenciales (email/contraseña) del usuario que creaste en la consola de Firebase.
        </p>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;