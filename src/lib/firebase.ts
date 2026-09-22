import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { TourPackage } from '../types';
import { VIP_TOURS } from '../data/toursData';

// Admin email configured for agency management
export const ADMIN_EMAIL = 'marceloparticular5@gmail.com';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore Database instance with specified database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Firebase Auth instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on application boot as required by Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is offline or unreachable. Please check connection.');
    }
    return false;
  }
}

// Trigger initial test
testFirestoreConnection();

// Types for Firebase entities
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export interface FirebaseBooking {
  id?: string;
  userId: string;
  tourId: string;
  tourName: string;
  date: string;
  timeWindow: string;
  participants: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  voucherCode: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  createdAt: string;
}

export interface FirebaseLead {
  id?: string;
  name: string;
  phone: string;
  tourInterest: string;
  travelMonth: string;
  couponCode: string;
  status: 'new' | 'contacted' | 'booked';
  createdAt: string;
}

// Auth helpers
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Sync user profile in firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Turista VIP',
          photoURL: result.user.photoURL || '',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

// Data persistence helpers with full error handling
export async function saveBookingToFirestore(bookingData: Omit<FirebaseBooking, 'id'>): Promise<string> {
  const path = 'bookings';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...bookingData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveLeadToFirestore(leadData: Omit<FirebaseLead, 'id'>): Promise<string> {
  const path = 'leads';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...leadData,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeUserBookings(
  userId: string,
  callback: (bookings: FirebaseBooking[]) => void
): () => void {
  const path = 'bookings';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const bookings: FirebaseBooking[] = [];
        snapshot.forEach((docSnap) => {
          bookings.push({ id: docSnap.id, ...(docSnap.data() as Omit<FirebaseBooking, 'id'>) });
        });
        callback(bookings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Check if a user is an authorized admin
export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Real-time listener for tours collection in Firestore, merged with default VIP_TOURS
export function subscribeToTours(callback: (tours: TourPackage[]) => void): () => void {
  const path = 'tours';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const deletedIds = new Set<string>();
        const firestoreToursMap = new Map<string, TourPackage>();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.deleted === true) {
            deletedIds.add(docSnap.id);
            return;
          }

          firestoreToursMap.set(docSnap.id, {
            id: docSnap.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            badge: data.badge || '',
            location: data.location || '',
            rating: typeof data.rating === 'number' ? data.rating : 4.9,
            reviewsCount: typeof data.reviewsCount === 'number' ? data.reviewsCount : 100,
            priceOriginal: typeof data.priceOriginal === 'number' ? data.priceOriginal : 0,
            priceDiscounted: typeof data.priceDiscounted === 'number' ? data.priceDiscounted : 0,
            duration: data.duration || 'Dia inteiro',
            includesDiving: Boolean(data.includesDiving),
            isVip: Boolean(data.isVip),
            urgencyText: data.urgencyText || '',
            description: data.description || '',
            highlights: Array.isArray(data.highlights) ? data.highlights : [],
            included: Array.isArray(data.included) ? data.included : [],
            imageUrl: data.imageUrl || '',
            active: data.active !== false,
            updatedAt: data.updatedAt,
          });
        });

        // Combine default VIP_TOURS and firestore tours:
        // 1. Seed with all default tours (unless marked as deleted in Firestore)
        const combinedMap = new Map<string, TourPackage>();
        VIP_TOURS.forEach((defaultTour) => {
          if (!deletedIds.has(defaultTour.id)) {
            combinedMap.set(defaultTour.id, { ...defaultTour, active: true });
          }
        });

        // 2. Overwrite / insert with Firestore tours
        firestoreToursMap.forEach((fTour, id) => {
          if (!deletedIds.has(id)) {
            combinedMap.set(id, fTour);
          }
        });

        callback(Array.from(combinedMap.values()));
      },
      (error) => {
        console.warn('Could not read from tours collection in Firestore:', error);
        callback(VIP_TOURS);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    callback(VIP_TOURS);
    return () => {};
  }
}

// Save or update a tour in Firestore
export async function saveTourToFirestore(tour: TourPackage): Promise<void> {
  const path = `tours/${tour.id}`;
  try {
    const tourRef = doc(db, 'tours', tour.id);
    const tourData = {
      id: tour.id,
      title: tour.title,
      subtitle: tour.subtitle || '',
      badge: tour.badge || '',
      location: tour.location || '',
      rating: tour.rating || 5.0,
      reviewsCount: tour.reviewsCount || 1,
      priceOriginal: tour.priceOriginal || 0,
      priceDiscounted: tour.priceDiscounted,
      duration: tour.duration || 'Dia inteiro',
      includesDiving: Boolean(tour.includesDiving),
      isVip: Boolean(tour.isVip),
      urgencyText: tour.urgencyText || '',
      description: tour.description,
      imageUrl: tour.imageUrl,
      highlights: tour.highlights || [],
      included: tour.included || [],
      active: tour.active !== false,
      deleted: false,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(tourRef, tourData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete a tour from Firestore
export async function deleteTourFromFirestore(tourId: string): Promise<void> {
  const path = `tours/${tourId}`;
  try {
    const isDefault = VIP_TOURS.some((t) => t.id === tourId);
    if (isDefault) {
      const defaultTour = VIP_TOURS.find((t) => t.id === tourId)!;
      await setDoc(
        doc(db, 'tours', tourId),
        {
          id: defaultTour.id,
          title: defaultTour.title,
          priceDiscounted: defaultTour.priceDiscounted,
          description: defaultTour.description,
          imageUrl: defaultTour.imageUrl,
          active: false,
          deleted: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      await deleteDoc(doc(db, 'tours', tourId));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Seed default tours to Firestore if needed
export async function seedDefaultToursToFirestore(defaultTours: TourPackage[]): Promise<void> {
  try {
    for (const tour of defaultTours) {
      await saveTourToFirestore(tour);
    }
  } catch (error) {
    console.error('Error seeding default tours:', error);
    throw error;
  }
}

// Admin listener for all bookings
export function subscribeAllBookingsForAdmin(
  callback: (bookings: FirebaseBooking[]) => void
): () => void {
  const path = 'bookings';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const bookings: FirebaseBooking[] = [];
        snapshot.forEach((docSnap) => {
          bookings.push({ id: docSnap.id, ...(docSnap.data() as Omit<FirebaseBooking, 'id'>) });
        });
        callback(bookings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
