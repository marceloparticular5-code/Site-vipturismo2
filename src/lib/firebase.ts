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
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Local storage key for tours caching
const LOCAL_TOURS_KEY = 'natal_vip_admin_local_tours';

// Check if app is inside an iframe
export function isRunningInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

// Local tours caching to guarantee persistence and responsiveness
function getLocalTours(): Map<string, TourPackage> {
  const map = new Map<string, TourPackage>();
  try {
    const raw = localStorage.getItem(LOCAL_TOURS_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as TourPackage[];
      arr.forEach((t) => map.set(t.id, t));
    }
  } catch {
    // ignore
  }
  return map;
}

function saveLocalTour(tour: TourPackage): void {
  try {
    const map = getLocalTours();
    map.set(tour.id, tour);
    localStorage.setItem(LOCAL_TOURS_KEY, JSON.stringify(Array.from(map.values())));
    window.dispatchEvent(new CustomEvent('natal-vip-tours-updated'));
  } catch {
    // ignore
  }
}

function removeLocalTour(tourId: string): void {
  try {
    const map = getLocalTours();
    const existing = map.get(tourId);
    if (existing) {
      map.set(tourId, { ...existing, active: false });
    } else {
      map.set(tourId, {
        id: tourId,
        title: '',
        description: '',
        imageUrl: '',
        priceDiscounted: 0,
        active: false,
      } as any);
    }
    localStorage.setItem(LOCAL_TOURS_KEY, JSON.stringify(Array.from(map.values())));
    window.dispatchEvent(new CustomEvent('natal-vip-tours-updated'));
  } catch {
    // ignore
  }
}

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
export interface GoogleLoginResult {
  user: User | null;
  error?: string | null;
  errorCode?: string | null;
}

export async function loginWithGoogleDetailed(): Promise<GoogleLoginResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Sync user profile in firestore
      try {
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
      } catch (profileErr) {
        console.warn('Could not sync user profile in firestore:', profileErr);
      }
    }
    return { user: result.user };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    const errorCode = error?.code || 'auth/unknown';
    let errorMessage = error?.message || 'Erro ao realizar login com o Google.';

    if (errorCode === 'auth/popup-closed-by-user') {
      errorMessage =
        'A janela do Google foi fechada antes de concluir o login. Se estiver no preview incorporado, abra o site em uma nova aba para permitir o pop-up da sua conta Google marceloparticular5@gmail.com.';
    } else if (errorCode === 'auth/unauthorized-domain') {
      errorMessage = `O domínio ${window.location.hostname} precisa ser adicionado à lista de domínios autorizados no Firebase Authentication (Console > Authentication > Settings > Authorized Domains). Adicione natalvipturismo.com.br e www.natalvipturismo.com.br.`;
    } else if (errorCode === 'auth/popup-blocked') {
      errorMessage =
        'O navegador bloqueou a janela pop-up do Google. Por favor, habilite pop-ups para este site ou abra o site diretamente em uma nova aba.';
    } else if (errorCode === 'auth/cancelled-popup-request') {
      errorMessage = 'A requisição de login foi cancelada por outra tentativa em andamento.';
    }

    return { user: null, error: errorMessage, errorCode };
  }
}

export async function loginWithGoogle(): Promise<User | null> {
  const result = await loginWithGoogleDetailed();
  return result.user;
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

// Check if a user is an authorized admin strictly via verified Google Account
export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Real-time listener for tours collection in Firestore, merged with default VIP_TOURS and local edits
export function subscribeToTours(callback: (tours: TourPackage[]) => void): () => void {
  const path = 'tours';

  const computeCombinedTours = (
    firestoreMap: Map<string, TourPackage>,
    deletedIds: Set<string>
  ) => {
    const combinedMap = new Map<string, TourPackage>();

    // 1. Seed with default tours (unless deleted)
    VIP_TOURS.forEach((defaultTour) => {
      if (!deletedIds.has(defaultTour.id)) {
        combinedMap.set(defaultTour.id, { ...defaultTour, active: true });
      }
    });

    // 2. Overwrite / insert with Firestore tours
    firestoreMap.forEach((fTour, id) => {
      if (!deletedIds.has(id)) {
        combinedMap.set(id, fTour);
      }
    });

    // 3. Overwrite / insert with Local storage admin updates
    const localTours = getLocalTours();
    localTours.forEach((lTour, id) => {
      if (lTour.active === false) {
        combinedMap.delete(id);
      } else {
        combinedMap.set(id, lTour);
      }
    });

    return Array.from(combinedMap.values());
  };

  let currentFirestoreMap = new Map<string, TourPackage>();
  let currentDeletedIds = new Set<string>();

  // Handler for local changes
  const handleLocalUpdate = () => {
    callback(computeCombinedTours(currentFirestoreMap, currentDeletedIds));
  };
  window.addEventListener('natal-vip-tours-updated', handleLocalUpdate);

  try {
    const colRef = collection(db, path);
    const unsubscribeFirestore = onSnapshot(
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

        currentFirestoreMap = firestoreToursMap;
        currentDeletedIds = deletedIds;

        callback(computeCombinedTours(firestoreToursMap, deletedIds));
      },
      (error) => {
        console.warn('Could not read from tours collection in Firestore:', error);
        callback(computeCombinedTours(new Map(), new Set()));
      }
    );

    return () => {
      window.removeEventListener('natal-vip-tours-updated', handleLocalUpdate);
      unsubscribeFirestore();
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    callback(computeCombinedTours(new Map(), new Set()));
    return () => {
      window.removeEventListener('natal-vip-tours-updated', handleLocalUpdate);
    };
  }
}

// Save or update a tour in Firestore with immediate local fallback
export async function saveTourToFirestore(tour: TourPackage): Promise<void> {
  const path = `tours/${tour.id}`;
  // Always persist locally for instant UI update & resilience
  saveLocalTour(tour);

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
    console.warn('Firestore write warning (saved locally in browser cache):', error);
    if (!auth.currentUser) {
      return; // Handled gracefully via local tours sync
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete a tour from Firestore with immediate local fallback
export async function deleteTourFromFirestore(tourId: string): Promise<void> {
  const path = `tours/${tourId}`;
  removeLocalTour(tourId);

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
    console.warn('Firestore delete warning (saved locally):', error);
    if (!auth.currentUser) {
      return;
    }
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
