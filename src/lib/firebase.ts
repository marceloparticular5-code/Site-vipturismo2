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
import { TourPackage, LeadFollowUp } from '../types';
import { VIP_TOURS } from '../data/toursData';

// Admin email configured for agency management
export const ADMIN_EMAIL = 'marceloparticular5@gmail.com';

// Master Admin Passcodes accepted for instant management anywhere (iframe, mobile, direct)
export const ADMIN_MASTER_PINS = ['vip2026', 'natalvip', 'vipnatal2026'];
export const ADMIN_AUTH_STORAGE_KEY = 'natal_vip_admin_auth_token';

export function isPinAdminAuthenticated(): boolean {
  try {
    const token =
      sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) ||
      localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    return token === 'authenticated_admin_vip';
  } catch {
    return false;
  }
}

export function setPinAdminAuthenticated(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'authenticated_admin_vip');
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'authenticated_admin_vip');
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function verifyAdminPin(pin: string): boolean {
  if (!pin) return false;
  const clean = pin.trim().toLowerCase();
  const valid = ADMIN_MASTER_PINS.includes(clean);
  if (valid) {
    setPinAdminAuthenticated(true);
  }
  return valid;
}

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
    const existing = map.get(tourId) || VIP_TOURS.find((t) => t.id === tourId);
    if (existing) {
      map.set(tourId, { ...existing, active: false, deleted: true } as any);
    } else {
      map.set(tourId, {
        id: tourId,
        title: '',
        description: '',
        imageUrl: '',
        priceDiscounted: 0,
        active: false,
        deleted: true,
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

// Check if a user is an authorized admin via PIN or verified Google Account
export function isUserAdmin(user: User | null): boolean {
  if (isPinAdminAuthenticated()) return true;
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
      if (lTour.active === false || (lTour as any).deleted === true) {
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
            remainingSlots: typeof data.remainingSlots === 'number' ? data.remainingSlots : undefined,
            category: data.category || undefined,
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

export interface TourMutationResult {
  success: boolean;
  firestoreSynced: boolean;
  tour?: TourPackage;
  error?: string;
}

// Save or update a tour in Firestore with immediate local persistence
export async function saveTourToFirestore(tour: TourPackage): Promise<TourMutationResult> {
  // Always persist locally for instant UI update & resilience
  saveLocalTour(tour);

  let firestoreSynced = false;
  let firestoreError: string | undefined;

  try {
    const tourRef = doc(db, 'tours', tour.id);
    const tourData = {
      id: tour.id,
      title: (tour.title || '').trim(),
      subtitle: (tour.subtitle || '').trim(),
      badge: (tour.badge || '').trim(),
      location: (tour.location || '').trim(),
      rating: Number(tour.rating) || 5.0,
      reviewsCount: Number(tour.reviewsCount) || 1,
      priceOriginal: Number(tour.priceOriginal) || 0,
      priceDiscounted: Number(tour.priceDiscounted) || 0,
      duration: (tour.duration || 'Dia inteiro').trim(),
      includesDiving: Boolean(tour.includesDiving),
      isVip: Boolean(tour.isVip),
      urgencyText: (tour.urgencyText || '').trim(),
      description: (tour.description || '').trim(),
      imageUrl: (tour.imageUrl || '').trim(),
      remainingSlots: typeof tour.remainingSlots === 'number' ? tour.remainingSlots : 3,
      category: (tour.category || '').trim(),
      highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
      included: Array.isArray(tour.included) ? tour.included : [],
      active: tour.active !== false,
      deleted: false,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(tourRef, tourData, { merge: true });
    firestoreSynced = true;
  } catch (error) {
    console.warn('Firestore write warning (tour preserved locally):', error);
    firestoreError = error instanceof Error ? error.message : String(error);
  }

  return {
    success: true,
    firestoreSynced,
    tour,
    error: firestoreError,
  };
}

// Delete a tour from Firestore with immediate local persistence
export async function deleteTourFromFirestore(tourId: string): Promise<TourMutationResult> {
  removeLocalTour(tourId);

  let firestoreSynced = false;
  let firestoreError: string | undefined;

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
    firestoreSynced = true;
  } catch (error) {
    console.warn('Firestore delete warning (tour removed locally):', error);
    firestoreError = error instanceof Error ? error.message : String(error);
  }

  return {
    success: true,
    firestoreSynced,
    error: firestoreError,
  };
}

// Seed default tours to Firestore if needed
export async function seedDefaultToursToFirestore(defaultTours: TourPackage[]): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_TOURS_KEY);
    for (const tour of defaultTours) {
      await saveTourToFirestore({ ...tour, active: true });
    }
    window.dispatchEvent(new CustomEvent('natal-vip-tours-updated'));
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

// Admin listener for all leads with combined Firestore + localStorage cache
export function subscribeAllLeadsForAdmin(
  callback: (leads: LeadFollowUp[]) => void
): () => void {
  const path = 'leads';

  const getLocalLeads = (): LeadFollowUp[] => {
    try {
      const raw = localStorage.getItem('natal_vip_leads');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  };

  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const localLeads = getLocalLeads();
        const firestoreLeads: LeadFollowUp[] = [];

        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const mappedStatus =
            d.status === 'booked'
              ? 'convertido'
              : d.status === 'contacted'
              ? 'followup_enviado'
              : d.status === 'archived'
              ? 'arquivado'
              : d.status || 'novo';

          firestoreLeads.push({
            id: docSnap.id,
            name: d.name || 'Cliente Sem Nome',
            phone: d.phone || '',
            email: d.email || 'contato@cliente.com',
            tourInterest: d.tourInterest || 'Passeio VIP',
            travelMonth: d.travelMonth || '',
            origin: d.origin || 'landing_modal',
            createdAt: d.createdAt
              ? d.createdAt.includes('T')
                ? new Date(d.createdAt).toLocaleString('pt-BR')
                : d.createdAt
              : new Date().toLocaleString('pt-BR'),
            status: mappedStatus as 'novo' | 'followup_enviado' | 'convertido' | 'arquivado',
            couponCode: d.couponCode || 'VIPNATAL30',
            notes: d.notes || '',
            lastFollowUpDate: d.lastFollowUpDate || '',
            utmSource: d.utmSource || '',
            estimatedValue: d.estimatedValue || 220,
          });
        });

        // Merge: Firestore documents take priority, plus any local leads
        const map = new Map<string, LeadFollowUp>();
        localLeads.forEach((l) => map.set(l.id, l));
        firestoreLeads.forEach((f) => map.set(f.id, f));

        const merged = Array.from(map.values()).sort((a, b) => {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });

        callback(merged);
      },
      (error) => {
        console.warn('Firestore leads sync notice (using local leads cache):', error);
        callback(getLocalLeads());
      }
    );
  } catch (error) {
    console.warn('Firestore leads listener exception:', error);
    callback(getLocalLeads());
    return () => {};
  }
}

// Update lead status and notes in Firestore and LocalStorage
export async function updateLeadInFirestore(
  leadId: string,
  updates: Partial<LeadFollowUp>
): Promise<void> {
  // Update local storage first
  try {
    const raw = localStorage.getItem('natal_vip_leads');
    if (raw) {
      const leads: LeadFollowUp[] = JSON.parse(raw);
      const updated = leads.map((l) => (l.id === leadId ? { ...l, ...updates } : l));
      localStorage.setItem('natal_vip_leads', JSON.stringify(updated));
    }
  } catch {
    // ignore
  }

  // Update in Firestore if logged in
  try {
    const docRef = doc(db, 'leads', leadId);
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not update lead in Firestore:', err);
  }
}

// Delete lead from Firestore and LocalStorage
export async function deleteLeadFromFirestore(leadId: string): Promise<void> {
  try {
    const raw = localStorage.getItem('natal_vip_leads');
    if (raw) {
      const leads: LeadFollowUp[] = JSON.parse(raw);
      const updated = leads.filter((l) => l.id !== leadId);
      localStorage.setItem('natal_vip_leads', JSON.stringify(updated));
    }
  } catch {
    // ignore
  }

  try {
    await deleteDoc(doc(db, 'leads', leadId));
  } catch (err) {
    console.warn('Could not delete lead from Firestore:', err);
  }
}

// Save lead created manually by Admin
export async function saveLeadManualAdmin(
  leadData: Omit<LeadFollowUp, 'id'>
): Promise<string> {
  const newId = `lead-${Date.now()}`;
  const fullLead: LeadFollowUp = {
    ...leadData,
    id: newId,
  };

  // Local storage save
  try {
    const raw = localStorage.getItem('natal_vip_leads');
    const list: LeadFollowUp[] = raw ? JSON.parse(raw) : [];
    list.unshift(fullLead);
    localStorage.setItem('natal_vip_leads', JSON.stringify(list));
  } catch {
    // ignore
  }

  // Firestore save
  try {
    await setDoc(doc(db, 'leads', newId), {
      ...leadData,
      id: newId,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not save manual lead in Firestore:', err);
  }

  return newId;
}

