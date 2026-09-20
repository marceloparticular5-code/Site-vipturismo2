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
  origin: 'exit_intent' | 'abandoned_cart' | 'tide_guide' | 'landing_modal';
  createdAt: string;
  status: 'novo' | 'followup_enviado' | 'convertido';
  lastFollowUpDate?: string;
  notes?: string;
  utmSource?: string;
  couponCode?: string;
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
