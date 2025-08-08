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
 * Sigue los pasos en los comentarios para configurar la subida de imágenes.
 */
export const cloudinaryConfig = {
  /**
   * Tu "Cloud Name" de Cloudinary.
   * 1. Inicia sesión en tu cuenta de Cloudinary.
   * 2. En el "Dashboard" principal, busca el campo "Cloud Name".
   * 3. Copia y pégalo aquí en lugar de "TU_CLOUD_NAME_AQUI".
   * @example "mi-pasteleria-cloud"
   */
  cloudName: "dgfjb8syc",

  /**
   * Tu "Upload Preset" (sin firma).
   * Es esencial que sea "unsigned" para que la app pueda subir imágenes de forma segura sin claves secretas.
   * CÓMO CREARLO:
   * 1. En Cloudinary, ve a "Settings" (el ícono de engranaje).
   * 2. Ve a la pestaña "Upload".
   * 3. Abajo, en la sección "Upload presets", haz clic en "Add upload preset".
   * 4. Cambia el "Signing Mode" de "Signed" a "Unsigned".
   * 5. Dale un nombre si quieres (opcional).
   * 6. Haz clic en "Save" en la parte superior.
   * 7. Copia el nombre del "Upload preset" que acabas de crear y pégalo aquí en lugar de "TU_UPLOAD_PRESET_AQUI".
   * @example "ml_default"
   */
  uploadPreset: "ylg5ckfc" 
};