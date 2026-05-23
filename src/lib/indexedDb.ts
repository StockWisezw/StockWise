import { Product, Customer } from '../store/posStore';

const DB_NAME = 'tareza-pos-catalog-db';
const DB_VERSION = 1;

export function initDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('customers')) {
        db.createObjectStore('customers', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readwrite');
      const store = transaction.objectStore('products');

      // Clear existing first
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        if (products.length === 0) {
          resolve();
          return;
        }
        
        let completed = 0;
        let errored = false;

        products.forEach(product => {
          const req = store.put(product);
          req.onsuccess = () => {
            completed++;
            if (completed === products.length && !errored) {
              resolve();
            }
          };
          req.onerror = () => {
            errored = true;
            reject(req.error);
          };
        });
      };

      clearRequest.onerror = () => {
        reject(clearRequest.error);
      };
    });
  } catch (error) {
    console.error('Failed to save products to IndexedDB:', error);
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Product[]);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to load products from IndexedDB:', error);
    return [];
  }
}

export async function saveCategories(categories: { id: string; name: string; iconName?: string }[]): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');

      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        if (categories.length === 0) {
          resolve();
          return;
        }

        let completed = 0;
        let errored = false;

        categories.forEach(category => {
          const req = store.put(category);
          req.onsuccess = () => {
            completed++;
            if (completed === categories.length && !errored) {
              resolve();
            }
          };
          req.onerror = () => {
            errored = true;
            reject(req.error);
          };
        });
      };

      clearRequest.onerror = () => {
        reject(clearRequest.error);
      };
    });
  } catch (error) {
    console.error('Failed to save categories to IndexedDB:', error);
  }
}

export async function getCategories(): Promise<{ id: string; name: string; iconName?: string }[]> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to load categories from IndexedDB:', error);
    return [];
  }
}

export async function saveCustomers(customers: Customer[]): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('customers', 'readwrite');
      const store = transaction.objectStore('customers');

      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        if (customers.length === 0) {
          resolve();
          return;
        }

        let completed = 0;
        let errored = false;

        customers.forEach(customer => {
          const req = store.put(customer);
          req.onsuccess = () => {
            completed++;
            if (completed === customers.length && !errored) {
              resolve();
            }
          };
          req.onerror = () => {
            errored = true;
            reject(req.error);
          };
        });
      };

      clearRequest.onerror = () => {
        reject(clearRequest.error);
      };
    });
  } catch (error) {
    console.error('Failed to save customers to IndexedDB:', error);
  }
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('customers', 'readonly');
      const store = transaction.objectStore('customers');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Customer[]);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to load customers from IndexedDB:', error);
    return [];
  }
}
