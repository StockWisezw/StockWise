import { firebaseService, auth as firebaseAuth } from './firebase';

// Backwards compatibility keys
export const DATABASE_ID = 'default';
export const BUCKET_ID = 'tareza-uploads';

// Real low-level account mock using Firebase Auth promises
export const account = {
  get: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve({
            $id: user.uid,
            email: user.email,
            name: user.displayName || '',
            created_at: user.metadata.creationTime,
            updated_at: user.metadata.lastSignInTime
          });
        } else {
          reject(new Error('No authenticated session found'));
        }
      });
    });
  },
  deleteSession: async (sessionId: string) => {
    return firebaseService.auth.signOut();
  }
};

// Mock low-level client/databases structures so other direct references conform beautifully
export const client = {
  setEndpoint: () => client,
  setProject: () => client
};
export const databases = {};
export const storage = {};

// Direct fallback maps
export const appwrite = {
  auth: {
    getUser: firebaseService.auth.getUser,
    getSession: firebaseService.auth.getSession,
    signUp: firebaseService.auth.signUp,
    signInWithPassword: firebaseService.auth.signInWithPassword,
    signInWithOAuth: firebaseService.auth.signInWithOAuth,
    signInAnonymously: firebaseService.auth.signInAnonymously,
    sendMagicLink: firebaseService.auth.sendMagicLink,
    completeMagicLinkSession: firebaseService.auth.completeMagicLinkSession,
    signOut: firebaseService.auth.signOut,
    onAuthStateChange: (cb: any) => {
      return firebaseService.auth.onAuthStateChange((user) => {
        cb(user ? { user: { id: user.uid, email: user.email } } : null);
      });
    }
  },
  from: firebaseService.from,
  storage: firebaseService.storage,
  channel: (name: string) => {
    return {
      on: (event: string, filter: any, callback: any) => ({
        subscribe: () => {}
      }),
      subscribe: () => {}
    };
  },
  removeChannel: (channel: any) => {}
};

// Re-export type definitions for TS satisfaction
export type AppwriteQueryBuilder = any;
