

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from '../config';
import { Product, ProductFormData, Category } from '../types';
import { uploadImage } from './cloudinaryService';

// Re-export User type for other components.
export type User = firebase.User;


// --- INITIALIZE FIREBASE (v8 compat syntax) ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const productsCollectionRef = db.collection("products");
const categoriesCollectionRef = db.collection("categories");

// --- AUTHENTICATION ---
export const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};

export const logout = () => {
    return auth.signOut();
};

export const onAuthChange = (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};

// --- CATEGORY MANAGEMENT ---

/**
 * Fetches all categories from Firestore.
 */
export const getCategories = async (): Promise<Category[]> => {
    const q = categoriesCollectionRef.orderBy("name");
    const querySnapshot = await q.get();
    const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Category[];
    
    // Ensure default categories exist if the collection is empty
    if (categories.length === 0) {
        console.log("No categories found, creating default ones...");
        return await createDefaultCategories();
    }
    return categories;
};

/**
 * Adds a new category to Firestore if it doesn't exist.
 */
export const addCategory = async (name: string): Promise<Category> => {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error("El nombre de la categoría no puede estar vacío.");

    // Check if category already exists (case-insensitive)
    const q = categoriesCollectionRef.where("name", "==", normalizedName);
    const existingSnapshot = await q.get();
    if (!existingSnapshot.empty) {
        throw new Error(`La categoría "${normalizedName}" ya existe.`);
    }

    const docRef = await categoriesCollectionRef.add({ name: normalizedName });
    return { id: docRef.id, name: normalizedName };
};


/**
 * Creates default categories if none exist in the database.
 */
const createDefaultCategories = async (): Promise<Category[]> => {
    const defaultCategories = ["Pasteles", "Panes", "Especiales"];
    const createdCategories: Category[] = [];
    
    // Using a loop to add one by one to easily get the new doc IDs.
    // A batch write would be faster but doesn't return the generated IDs.
    for (const catName of defaultCategories) {
        const docRef = await categoriesCollectionRef.add({ name: catName });
        createdCategories.push({ id: docRef.id, name: catName });
    }
    return createdCategories;
};


// --- PRODUCT MANAGEMENT ---

/**
 * Fetches all products from Firestore.
 */
export const getProducts = async (): Promise<Product[]> => {
  const q = productsCollectionRef.orderBy("name");
  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
};

/**
 * Adds a new product to Firestore.
 */
export const addProduct = async (productData: ProductFormData & { imageFile: File }): Promise<Product> => {
  // 1. Upload image to Cloudinary
  const imageUrl = await uploadImage(productData.imageFile);

  // 2. Prepare data for Firestore (excluding imageFile)
  const dataToSave = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    imageUrl: imageUrl,
  };

  // 3. Save to Firestore
  const docRef = await productsCollectionRef.add(dataToSave);
  return { id: docRef.id, ...dataToSave };
};

/**
 * Updates an existing product in Firestore.
 */
export const updateProduct = async (productId: string, updateData: Partial<ProductFormData> & { imageFile?: File }): Promise<void> => {
    const productRef = db.collection('products').doc(productId);
    const { imageFile, ...productFields } = updateData;
    // Use 'any' for dataToUpdate to handle dynamic properties for Firestore update.
    const dataToUpdate: { [key: string]: any } = { ...productFields };

    // 1. If there's a new image, upload it and add its URL to the update object
    if (imageFile) {
        dataToUpdate.imageUrl = await uploadImage(imageFile);
    }
    
    // 2. Save to Firestore only if there's something to update
    if (Object.keys(dataToUpdate).length > 0) {
        await productRef.update(dataToUpdate);
    }
};

/**
 * Deletes a product from Firestore.
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  // In a real app, you should also delete the associated image from Cloudinary.
  const productRef = db.collection('products').doc(productId);
  await productRef.delete();
};