import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

let firestoreInstance;

const createFirestore = () => {
    // Determine if offline mode is enabled
    const isOfflineEnabled = localStorage.getItem('tareza_offline_mode') === 'true';
    
    if (isOfflineEnabled) {
        return initializeFirestore(app, {
            localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
            databaseId: firebaseConfig.firestoreDatabaseId
        });
    } else {
        return initializeFirestore(app, {
            databaseId: firebaseConfig.firestoreDatabaseId
        });
    }
};

export const db = createFirestore();
export const auth = getAuth(app);

