
import React, { useState, FormEvent } from 'react';
import * as firebaseService from '../services/firebaseService';
import { FirebaseError } from '../services/firebaseService';
import Spinner from './Spinner';
import { CakeIcon, EyeOpenIcon, EyeClosedIcon } from './icons';
import { adminEmail } from '../config'; // Importar el email del admin

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // --- RESTRICCIÓN DE ACCESO ---
    // Si hay un adminEmail configurado, solo permitir ese email.
    if (adminEmail && email.toLowerCase() !== adminEmail.toLowerCase()) {
      setError('Acceso denegado. Este email no está autorizado.');
      setIsLoading(false);
      return;
    }
    // --- FIN DE RESTRICCIÓN ---

    try {
      await firebaseService.login(email, password);
      onLoginSuccess();
    } catch (err) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Usuario o contraseña incorrectos. Por favor, verifica que la contraseña sea la misma que estableciste en Firebase. Puedes restablecerla desde la consola de Firebase si es necesario.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El formato del email no es válido.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Acceso bloqueado: Demasiados intentos fallidos. Por seguridad, espera unos minutos antes de volver a intentarlo.';
            break;
          default:
            errorMessage = 'Error al iniciar sesión. Revisa la consola para más detalles.';
            console.error("Firebase Login Error:", err);
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dgfjb8syc/image/upload/v1754775319/Gemini_Generated_Image_bompzlbompzlbomp_ohqoll.png')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in-up">
        <div className="text-center">
            <CakeIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Pastelería Admin</h1>
            <p className="text-gray-600">Bienvenido de vuelta</p>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm" role="alert">
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <><Spinner size="sm" /> Procesando...</> : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 pt-2">
            {adminEmail ? 'Solo el administrador autorizado puede acceder.' : 'Utiliza las credenciales (email/contraseña) del usuario que creaste en la consola de Firebase.'}
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