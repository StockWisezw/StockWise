import { Client, Account, Databases, Storage } from 'appwrite';

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

export const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Default database ID to use across the app
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
