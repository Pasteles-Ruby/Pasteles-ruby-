import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Product, Category, ProductFormData } from '../types';
import * as firebaseService from '../services/firebaseService';
import { uploadImage } from '../services/cloudinaryService';
import Spinner from './Spinner';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || (categories[0]?.name || ''),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!product;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Revoke previous object URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEditing && !imageFile) {
        setError('Es necesario seleccionar una imagen para el nuevo producto.');
        return;
    }
    
    if (formData.name.trim() === '' || formData.description.trim() === '' || formData.price <= 0 || formData.category.trim() === '') {
        setError('Por favor, completa todos los campos correctamente.');
        return;
    }

    setIsSubmitting(true);
    
    try {
        if (isEditing) {
            // Pass imageFile only if it has been changed
            const updatePayload = { ...formData, imageFile: imageFile || undefined };
            await firebaseService.updateProduct(product.id, updatePayload);
        } else {
            // imageFile is guaranteed to exist here due to the check above
            await firebaseService.addProduct({ ...formData, imageFile: imageFile! });
        }
        onSaveSuccess();
        onClose();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo guardar el producto. Inténtalo de nuevo.');
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      
       {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Producto</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500">
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen del Producto</label>
        <div className="mt-2 flex items-center gap-4">
            {imagePreview && <img src={imagePreview} alt="Previsualización" className="w-24 h-24 object-cover rounded-md bg-gray-200 dark:bg-gray-600" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 dark:file:bg-pink-900/50 file:text-pink-700 dark:file:text-pink-300 hover:file:bg-pink-100 dark:hover:file:bg-pink-800"/>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end gap-3">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting ? <><Spinner size="sm" /> Guardando...</> : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;