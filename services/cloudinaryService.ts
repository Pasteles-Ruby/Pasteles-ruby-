// services/cloudinaryService.ts
import { cloudinaryConfig } from '../config';

/**
 * Sube un archivo de imagen a Cloudinary.
 * @param file El archivo de imagen a subir.
 * @returns Una promesa que se resuelve con la URL segura de la imagen subida.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const { cloudName, uploadPreset } = cloudinaryConfig;

  if (!cloudName || !uploadPreset || cloudName === "TU_CLOUD_NAME_DE_CLOUDINARY") {
      console.error("Cloudinary no está configurado. Revisa tu archivo config.ts.");
      // Devolver una imagen de marcador de posición para que la UI no se rompa
      const randomSeed = Math.random().toString(36).substring(7);
      return `https://picsum.photos/seed/${randomSeed}/400/300`;
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al subir a Cloudinary: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error en la subida a Cloudinary:", error);
    throw error;
  }
};
