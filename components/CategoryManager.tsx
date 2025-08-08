import React, { useState, FormEvent } from 'react';
import { Category } from '../types';
import * as firebaseService from '../services/firebaseService';
import { AddIcon } from './icons';
import Spinner from './Spinner';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryAdded: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() === '') return;

    setIsLoading(true);
    setError(null);
    try {
      await firebaseService.addCategory(newCategory);
      setNewCategory('');
      onCategoryAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la categoría.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Gestionar Categorías</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <span key={cat.id} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
            {cat.name}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
        <div className="w-full">
            <label htmlFor="newCategory" className="sr-only">Nueva categoría</label>
            <input
            type="text"
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
        </div>
        <button
          type="submit"
          disabled={isLoading || newCategory.trim() === ''}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Spinner size="sm" /> : <AddIcon />}
          <span>Agregar</span>
        </button>
      </form>
       {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default CategoryManager;
