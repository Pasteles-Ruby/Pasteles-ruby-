// config.ts
// ADVERTENCIA: No subas este archivo con tus claves reales a un repositorio público.
// Rellena esta configuración con tus propias credenciales de Firebase y Cloudinary.

/**
 * El único email autorizado para acceder al panel de administrador.
 * Déjalo como una cadena vacía ('') para permitir que cualquier usuario de Firebase inicie sesión.
 */
export const adminEmail = "pasteleriaruby880@gmail.com";

/**
 * Configuración de Firebase.
 * Obtén estos valores desde la configuración de tu proyecto en la consola de Firebase.
 */
export const firebaseConfig = {
  // ¡IMPORTANTE! Copia y pega tu API Key aquí.
  apiKey: "AIzaSyBC9SWCW3ynNzdGeZSddLdYWf9uzgvDRjs",
  authDomain: "pasteleria-ruby.firebaseapp.com",
  projectId: "pasteleria-ruby",
  storageBucket: "pasteleria-ruby.appspot.com",
  messagingSenderId: "469646147035",
  appId: "1:469646147035:web:924297a9f3cce2e0eb7bfe"
};

/**
 * Configuración de Cloudinary.
 * Obtén estos valores desde tu panel de control de Cloudinary.
 */
export const cloudinaryConfig = {
  cloudName: "TU_CLOUD_NAME_DE_CLOUDINARY",
  // Crea un "unsigned upload preset" en la configuración de Cloudinary
  // para permitir la subida de imágenes sin necesidad de una firma del backend.
  uploadPreset: "TU_UPLOAD_PRESET_DE_CLOUDINARY" 
};