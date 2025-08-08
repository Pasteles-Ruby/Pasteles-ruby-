
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firestore from "firebase/firestore";
import { firebaseConfig } from '../config';
import { Product, ProductFormData, Category } from '../types';
import { uploadImage } from './cloudinaryService';

// --- INITIALIZE FIREBASE (v9+ modular syntax) ---
const app = firebaseApp.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(app);
const db = firestore.getFirestore(app);

const productsCollectionRef = firestore.collection(db, "products");
const categoriesCollectionRef = firestore.collection(db, "categories");

// Re-export User type and FirebaseError for other components.
export type User = firebaseAuth.User;
export const FirebaseError = firebaseApp.FirebaseError;


// --- AUTHENTICATION ---
export const login = (email, password) => {
  return firebaseAuth.signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return firebaseAuth.signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return firebaseAuth.onAuthStateChanged(auth, callback);
};

// --- CATEGORY MANAGEMENT ---

/**
 * Fetches all categories from Firestore.
 */
export const getCategories = async (): Promise<Category[]> => {
    const q = firestore.query(categoriesCollectionRef, firestore.orderBy("name"));
    const querySnapshot = await firestore.getDocs(q);
    const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Category[];
    
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

    const q = firestore.query(categoriesCollectionRef, firestore.where("name", "==", normalizedName));
    const existingSnapshot = await firestore.getDocs(q);
    if (!existingSnapshot.empty) {
        throw new Error(`La categoría "${normalizedName}" ya existe.`);
    }

    const docRef = await firestore.addDoc(categoriesCollectionRef, { name: normalizedName });
    return { id: docRef.id, name: normalizedName };
};


/**
 * Creates default categories if none exist in the database.
 */
const createDefaultCategories = async (): Promise<Category[]> => {
    const defaultCategories = ["Pasteles", "Panes", "Especiales"];
    const createdCategories: Category[] = [];
    const batch = firestore.writeBatch(db);

    for (const catName of defaultCategories) {
        const docRef = firestore.doc(categoriesCollectionRef); // Create a new doc reference with a unique ID
        batch.set(docRef, { name: catName });
        createdCategories.push({ id: docRef.id, name: catName });
    }
    
    await batch.commit();
    // Re-sort by name as batch order isn't guaranteed
    return createdCategories.sort((a, b) => a.name.localeCompare(b.name));
};


// --- PRODUCT MANAGEMENT ---

/**
 * Fetches all products from Firestore.
 */
export const getProducts = async (): Promise<Product[]> => {
  const q = firestore.query(productsCollectionRef, firestore.orderBy("name"));
  const querySnapshot = await firestore.getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
};

/**
 * Adds a new product to Firestore.
 */
export const addProduct = async (productData: ProductFormData & { imageFile: File }): Promise<Product> => {
  const imageUrl = await uploadImage(productData.imageFile);

  const dataToSave = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    imageUrl: imageUrl,
  };

  const docRef = await firestore.addDoc(productsCollectionRef, dataToSave);
  return { id: docRef.id, ...dataToSave };
};

/**
 * Updates an existing product in Firestore.
 */
export const updateProduct = async (productId: string, updateData: Partial<ProductFormData> & { imageFile?: File }): Promise<void> => {
    const productRef = firestore.doc(db, 'products', productId);
    const { imageFile, ...productFields } = updateData;
    const dataToUpdate: { [key: string]: any } = { ...productFields };

    if (imageFile) {
        dataToUpdate.imageUrl = await uploadImage(imageFile);
    }
    
    if (Object.keys(dataToUpdate).length > 0) {
        await firestore.updateDoc(productRef, dataToUpdate);
    }
};

/**
 * Deletes a product from Firestore.
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const productRef = firestore.doc(db, 'products', productId);
  await firestore.deleteDoc(productRef);
};
