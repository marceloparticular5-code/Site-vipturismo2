export type TideCategory = 'melhor' | 'atencao' | 'nao_recomendado';

export interface TideDayInfo {
  day: number;
  height: number;
  timeWindow: string;
  category: TideCategory;
  available: boolean;
  notes?: string;
}

export interface MonthTideData {
  monthIndex: number; // 0 = Jan, 11 = Dec
  monthName: string;
  year: number;
  days: TideDayInfo[];
}

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  location: string;
  rating: number;
  reviewsCount: number;
  priceOriginal: number;
  priceDiscounted: number;
  duration: string;
  includesDiving: boolean;
  isVip: boolean;
  urgencyText: string;
  description: string;
  highlights: string[];
  included: string[];
  imageUrl: string;
  remainingSlots?: number;
  category?: 'combo' | 'aventura' | 'mergulho' | 'cultural' | 'transfer' | string;
  active?: boolean;
  updatedAt?: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: string;
}

export interface BookingState {
  tourId: string;
  tourName: string;
  date: string;
  timeWindow: string;
  tideHeight: number;
  adultsCount: number;
  childrenCount: number; // 0-5 free, 6-11 discount
  addons: string[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hotelPickup: string;
  paymentMethod: 'pix' | 'card';
  totalPrice: number;
  emailSentToCustomer?: boolean;
  emailSentToAgency?: boolean;
}

export interface VoucherData {
  voucherCode: string;
  booking: BookingState;
  createdAt: string;
  status: 'confirmado' | 'pendente';
  qrCodeUrl: string;
  emailDispatchedAt?: string;
  confirmationEmailAddress?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  tag: string;
  location: string;
  timing: string;
  description: string;
  highlight: string;
  natalVipTip: string;
  suggestedTourId: string;
  suggestedTourName: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTourId?: string;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  acceptedAt?: string;
  hasChosen: boolean;
}

export interface LeadFollowUp {
  id: string;
  name: string;
  phone: string;
  email: string;
  travelMonth?: string;
  tourInterest?: string;
  origin: 'exit_intent' | 'abandoned_cart' | 'tide_guide' | 'landing_modal' | 'marcelo_chat' | 'manual_admin' | string;
  createdAt: string;
  status: 'novo' | 'followup_enviado' | 'convertido' | 'arquivado';
  lastFollowUpDate?: string;
  notes?: string;
  utmSource?: string;
  couponCode?: string;
  estimatedValue?: number;
}

export interface CustomerTestimonial {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  tourName: string;
  comment: string;
  date: string;
  photoUrl: string;
  verifiedTag: string;
  badge?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  tideAlerts: boolean; // Alertas de maré excelente (≤ 0.3m) e condições nos Parrachos
  vacancyAlerts: boolean; // Alertas de novas vagas e últimas vagas em lanchas VIP
  promoAlerts: boolean; // Alertas de ofertas relâmpago e cupons VIP
  lastUpdated?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'tide' | 'vacancy' | 'promo' | 'general';
  url?: string;
  timestamp: string;
  read: boolean;
  badge?: string;
}

export interface HotelPartner {
  id: string;
  name: string;
  tagline: string;
  category: 'Resort 5 Estrelas' | 'Hotel Boutique' | 'Resort All-Inclusive' | 'Hotel Executivo & Lazer' | 'Pousada de Charme';
  region: 'Ponta Negra' | 'Via Costeira' | 'Litoral Norte' | 'Pipa / Litoral Sul';
  departurePointProximity: string;
  distanceToDeparture: string;
  rating: number;
  reviewsCount: number;
  priceEstimate: string;
  badge?: string;
  perksForVipClients: string[];
  amenities: string[];
  imageUrl: string;
  directBookingUrl: string;
  whatsappConciergeNumber?: string;
  marceloTip: string;
  address: string;
  toursNearby: string[];
}

export type InfraCategory = 'vistos' | 'seguro' | 'conectividade' | 'financas';

export interface InfraChecklistTask {
  id: string;
  category: InfraCategory;
  title: string;
  description: string;
  requiredFor: string;
  tip?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface StudentProfile {
  id: string;
  name?: string;
  email?: string;
  targetTripMonth?: string;
  checklistProgress: Record<string, boolean>; // taskId -> boolean
  lastActiveTab?: InfraCategory | 'todos';
  notes?: string;
  updatedAt: string;
}

