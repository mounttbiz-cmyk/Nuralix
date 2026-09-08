import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCgDPSYWfrXdRWU3k_oy-SKpER5p3kT3_U",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nuralix-24360.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://nuralix-24360-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nuralix-24360",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nuralix-24360.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "544020085393",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:544020085393:web:f0e9dfa8aced6b18cc9d30",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q8VTHHVTVR",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("YOUR_")
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let rtdb: Database | undefined;
let analytics: Analytics | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    // Initialize Analytics if supported in this environment
    if (typeof window !== "undefined") {
      isSupported().then((yes) => {
        if (yes && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {});
    }
  } catch (error) {
    console.warn("Firebase initialization warning:", error);
  }
}

export { app, auth, db, rtdb, analytics, googleProvider, firebaseConfig };
