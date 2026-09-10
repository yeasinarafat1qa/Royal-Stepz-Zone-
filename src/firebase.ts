import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase safely
let app: any = null;
let dbInstance: any = null;
let authInstance: any = null;

try {
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== '') {
    app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
    authInstance = getAuth(app);
  } else {
    console.warn("Running in offline mode (No Firebase apiKey provided)");
  }
} catch (error) {
  console.error("Firebase initialization handled safely:", error);
}

export const db = dbInstance;
export const auth = authInstance;
export const isFirebaseActive = !!dbInstance;

export default app;
