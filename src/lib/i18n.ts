/**
 * Internationalization (i18n), Currency & Nationalities utility
 * for Natal Vip Turismo.
 * Supports Brazilian and International tourists (Argentina, Uruguay, Chile, USA, Europe, etc.)
 */

export type SupportedLanguage = 'pt' | 'en' | 'es';
export type SupportedCurrency = 'BRL' | 'USD' | 'EUR' | 'ARS';

export interface NationalityInfo {
  code: string;
  namePt: string;
  nameEn: string;
  nameEs: string;
  flag: string;
  dialCode: string;
  currency: SupportedCurrency;
  currencySymbol: string;
  documentType: string;
  documentPlaceholder: string;
}

export const NATIONALITIES: NationalityInfo[] = [
  {
    code: 'BR',
    namePt: 'Brasil',
    nameEn: 'Brazil',
    nameEs: 'Brasil',
    flag: '🇧🇷',
    dialCode: '+55',
    currency: 'BRL',
    currencySymbol: 'R$',
    documentType: 'CPF ou RG',
    documentPlaceholder: '000.000.000-00',
  },
  {
    code: 'AR',
    namePt: 'Argentina',
    nameEn: 'Argentina',
    nameEs: 'Argentina',
    flag: '🇦🇷',
    dialCode: '+54',
    currency: 'ARS',
    currencySymbol: 'ARS $',
    documentType: 'DNI / Pasaporte',
    documentPlaceholder: 'Número de DNI ou Pasaporte',
  },
  {
    code: 'UY',
    namePt: 'Uruguai',
    nameEn: 'Uruguay',
    nameEs: 'Uruguay',
    flag: '🇺🇾',
    dialCode: '+598',
    currency: 'USD',
    currencySymbol: 'US$',
    documentType: 'CI / Pasaporte',
    documentPlaceholder: 'Documento / Pasaporte',
  },
  {
    code: 'CL',
    namePt: 'Chile',
    nameEn: 'Chile',
    nameEs: 'Chile',
    flag: '🇨🇱',
    dialCode: '+56',
    currency: 'USD',
    currencySymbol: 'US$',
    documentType: 'RUT / Pasaporte',
    documentPlaceholder: 'RUT o Pasaporte',
  },
  {
    code: 'US',
    namePt: 'Estados Unidos / Internacional',
    nameEn: 'United States / Global',
    nameEs: 'Estados Unidos / Global',
    flag: '🇺🇸',
    dialCode: '+1',
    currency: 'USD',
    currencySymbol: 'US$',
    documentType: 'Passport ID',
    documentPlaceholder: 'Passport Number',
  },
  {
    code: 'PT',
    namePt: 'Portugal',
    nameEn: 'Portugal',
    nameEs: 'Portugal',
    flag: '🇵🇹',
    dialCode: '+351',
    currency: 'EUR',
    currencySymbol: '€',
    documentType: 'CC / Passaporte / NIF',
    documentPlaceholder: 'Cartão de Cidadão ou Passaporte',
  },
  {
    code: 'EU',
    namePt: 'União Europeia',
    nameEn: 'European Union',
    nameEs: 'Unión Europea',
    flag: '🇪🇺',
    dialCode: '+34',
    currency: 'EUR',
    currencySymbol: '€',
    documentType: 'Passport / National ID',
    documentPlaceholder: 'Passport ID',
  },
  {
    code: 'OTHER',
    namePt: 'Outras Nacionalidades',
    nameEn: 'Other Nationalities',
    nameEs: 'Otras Nacionalidades',
    flag: '🌍',
    dialCode: '+',
    currency: 'USD',
    currencySymbol: 'US$',
    documentType: 'Passport ID',
    documentPlaceholder: 'Passport Number',
  },
];

// Approximate exchange rates relative to BRL
export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  BRL: 1,
  USD: 0.177, // ~ 5.65 BRL
  EUR: 0.162, // ~ 6.15 BRL
  ARS: 185.0, // ~ 1 BRL = 185 ARS
};

export function formatCurrencyValue(amountBrl: number, currency: SupportedCurrency = 'BRL'): string {
  if (currency === 'BRL') {
    return amountBrl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const converted = amountBrl * (EXCHANGE_RATES[currency] || 1);

  if (currency === 'USD') {
    return `US$ ${converted.toFixed(2)}`;
  }
  if (currency === 'EUR') {
    return `€ ${converted.toFixed(2)}`;
  }
  if (currency === 'ARS') {
    return `$ ${Math.round(converted).toLocaleString('es-AR')} ARS`;
  }

  return `R$ ${amountBrl.toFixed(2)}`;
}

// Translations dictionary
export const TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  nav_packages: {
    pt: 'Pacotes VIP',
    en: 'VIP Packages',
    es: 'Paquetes VIP',
  },
  nav_tides: {
    pt: 'Tábua de Maré Inteligente',
    en: 'Smart Tide Calendar',
    es: 'Tabla de Mareas Inteligente',
  },
  nav_diving: {
    pt: 'Maracajaú & Rio do Fogo',
    en: 'Maracajaú & Rio do Fogo Reefs',
    es: 'Maracajaú y Rio do Fogo',
  },
  nav_map: {
    pt: 'Mapa de Roteiros',
    en: 'Tour Route Map',
    es: 'Mapa de Rutas',
  },
  nav_instagram: {
    pt: 'Instagram VIP',
    en: 'Instagram Feed',
    es: 'Instagram VIP',
  },
  nav_selfservice: {
    pt: 'Autoatendimento 24h',
    en: '24/7 Self-Service',
    es: 'Autoservicio 24h',
  },
  nav_book_now: {
    pt: 'RESERVAR AGORA',
    en: 'BOOK NOW',
    es: 'RESERVAR AHORA',
  },
  hero_title_accent: {
    pt: 'Experiência VIP em Natal',
    en: 'VIP Experience in Natal',
    es: 'Experiencia VIP en Natal',
  },
  verified_company: {
    pt: 'Agência Nº 1 em Satisfação · Cadastur Regular',
    en: '#1 Rated Tourism Agency in Natal · Cadastur Registered',
    es: 'Agencia Nº 1 en Satisfacción · Registro Oficial Cadastur',
  },
  international_support: {
    pt: 'Atendimento a Todas as Nacionalidades (Português · Español · English)',
    en: 'International Tourists Welcome (Português · Español · English)',
    es: 'Atención a Todas las Nacionalidades (Português · Español · English)',
  },
  low_tide_guarantee: {
    pt: 'Maré Baixa 0.0 - 0.2 Garantida',
    en: 'Low Tide 0.0 - 0.2 Guaranteed',
    es: 'Marea Baja 0.0 - 0.2 Garantizada',
  },
};

export function getTranslation(key: string, lang: SupportedLanguage = 'pt'): string {
  if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
    return TRANSLATIONS[key][lang];
  }
  return TRANSLATIONS[key]?.pt || key;
}
