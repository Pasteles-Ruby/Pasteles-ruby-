
import React from 'react';
import { Product } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductCard: React.FC<{ product: Product; onEdit: () => void; onDelete: () => void; }> = ({ product, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col">
        <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
        <div className="p-6 flex flex-col flex-grow">
            <span className="inline-block bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 self-start">{product.category}</span>
            <h3 className="font-bold text-xl mb-2 text-gray-900">{product.name}</h3>
            <p className="text-gray-700 text-base flex-grow">{product.description}</p>
            <p className="text-red-600 font-bold text-2xl mt-4">${product.price.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-100">
                <EditIcon />
            </button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100">
                <DeleteIcon />
            </button>
        </div>
    </div>
);


const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h2 className="text-2xl font-semibold text-gray-600">No hay productos todavía</h2>
        <p className="text-gray-500 mt-2">¡Haz clic en "Agregar Producto" para empezar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map(product => (
        <ProductCard 
            key={product.id} 
            product={product} 
            onEdit={() => onEdit(product)} 
            onDelete={() => onDelete(product.id)} 
        />
      ))}
    </div>
  );
};

export default ProductList;