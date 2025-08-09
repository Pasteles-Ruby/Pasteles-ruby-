
import React, { useState, useEffect, useCallback } from 'react';
import { Product, Category } from './types';
import * as firebaseService from './services/firebaseService';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Modal from './components/Modal';
import Spinner from './components/Spinner';
import Login from './components/Login';
import { AddIcon } from './components/icons';
import CategoryManager from './components/CategoryManager';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChange(user => {
        setIsAuthenticated(!!user);
        setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
          firebaseService.getProducts(),
          firebaseService.getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (err) {
      setError('No se pudieron cargar los datos. Revisa la configuración de Firebase y tu conexión.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    } else {
        setProducts([]);
        setCategories([]);
    }
  }, [isAuthenticated, fetchData]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // This will trigger the data fetch
  };
  
  const handleLogout = () => {
    firebaseService.logout(); // Firebase handles the rest via onAuthChange
  };

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  
  const handleDelete = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await firebaseService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId)); // Optimistic update
      } catch (err) {
        setError('No se pudo eliminar el producto.');
        console.error(err);
        fetchData(); // Refetch to sync state
      }
    }
  };
  
  const handleSaveSuccess = () => {
    fetchData(); // Refetch both products and categories
  };

  if (isAuthLoading) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-stone-100">
            <Spinner size="lg" />
        </div>
      );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-stone-100 text-gray-800 font-sans">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
          >
            <AddIcon />
            <span>Agregar Producto</span>
          </button>
        </div>
        
        <CategoryManager categories={categories} onCategoryAdded={fetchData} />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <ProductList products={products} onEdit={handleOpenModal} onDelete={handleDelete} />
        )}
        
        {isModalOpen && (
            <Modal onClose={handleCloseModal}>
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                />
            </Modal>
        )}
      </main>
    </div>
  );
};

export default App;
