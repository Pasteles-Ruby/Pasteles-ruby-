export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Changed from ProductCategory enum to string for dynamic categories
  imageUrl: string;
}

// Partial type for product form data, as ID is not needed for creation
// and image file is handled separately.
export type ProductFormData = Omit<Product, 'id' | 'imageUrl'> & {
    imageFile?: File;
};