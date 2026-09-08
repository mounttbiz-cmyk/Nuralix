import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { ref, set, update, get } from "firebase/database";
import { db, rtdb, isFirebaseConfigured } from "./config";

/**
 * Saves or updates a business profile in Cloud Firestore and Realtime Database
 */
export async function saveUserProfileToFirestore(userId: string, data: Record<string, any>) {
  if (!isFirebaseConfigured) return null;
  const payload = { ...data, updatedAt: new Date().toISOString() };

  // 1. Save to Cloud Firestore
  if (db) {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, payload, { merge: true });
    } catch (err) {
      console.warn("Firestore save notice:", err);
    }
  }

  // 2. Save to Realtime Database
  if (rtdb) {
    try {
      const rtdbRef = ref(rtdb, `users/${userId}`);
      await update(rtdbRef, payload);
    } catch (err) {
      console.warn("Realtime Database save notice:", err);
    }
  }

  return true;
}

/**
 * Retrieves a user profile from Firestore or Realtime Database
 */
export async function getUserProfileFromFirestore(userId: string) {
  if (!isFirebaseConfigured) return null;

  // 1. Try Firestore
  if (db) {
    try {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) return snap.data();
    } catch (err) {
      // continue to fallback
    }
  }

  // 2. Try Realtime Database
  if (rtdb) {
    try {
      const rtdbRef = ref(rtdb, `users/${userId}`);
      const snap = await get(rtdbRef);
      if (snap.exists()) return snap.val();
    } catch (err) {
      // ignore
    }
  }

  return null;
}

/**
 * Records a business daily check-in in Firestore and Realtime Database
 */
export async function recordCheckInToFirestore(companyId: string, checkInData: Record<string, any>) {
  if (!isFirebaseConfigured) return null;
  const payload = {
    ...checkInData,
    companyId,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const checkInRef = doc(collection(db, "checkins"));
      await setDoc(checkInRef, payload);
    } catch (err) {
      console.warn("Firestore checkin save notice:", err);
    }
  }

  if (rtdb) {
    try {
      const checkInKey = `chk_${Date.now()}`;
      const rtdbCheckinRef = ref(rtdb, `checkins/${companyId}/${checkInKey}`);
      await set(rtdbCheckinRef, payload);
    } catch (err) {
      console.warn("Realtime Database checkin save notice:", err);
    }
  }

  return true;
}
