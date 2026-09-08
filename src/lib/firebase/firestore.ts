import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

/**
 * Saves or updates a business profile in Firestore
 */
export async function saveUserProfileToFirestore(userId: string, data: Record<string, any>) {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
    return false;
  }
}

/**
 * Retrieves a user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string) {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Error fetching user from Firestore:", err);
    return null;
  }
}

/**
 * Records a business daily check-in in Firestore
 */
export async function recordCheckInToFirestore(companyId: string, checkInData: Record<string, any>) {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const checkInRef = doc(collection(db, "checkins"));
    await setDoc(checkInRef, {
      ...checkInData,
      companyId,
      createdAt: new Date().toISOString(),
    });
    return checkInRef.id;
  } catch (err) {
    console.error("Error saving checkin to Firestore:", err);
    return null;
  }
}
