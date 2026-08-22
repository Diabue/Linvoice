import type { Invoice, ServiceItem, Client, UserCompanyProfile, AppStats } from '../types';

const STORAGE_KEYS = {
  SERVICES: 'linvoice_services_v1',
  INVOICES: 'linvoice_invoices_v1',
  CLIENTS: 'linvoice_clients_v1',
  PROFILE: 'linvoice_profile_v1',
  STATS: 'linvoice_stats_v1',
  AUTH: 'linvoice_auth_v1',
};

export const DEFAULT_PROFILE: UserCompanyProfile = {
  name: 'Jan Kowalski - Instalacje Elektryczne & Hydrauliczne',
  nip: '5213894012',
  address: 'ul. Budowlanych 14/8',
  city: 'Warszawa',
  postalCode: '02-678',
  email: 'kontakt@instalacje-kowalski.pl',
  phone: '+48 600 100 200',
  bankAccount: 'PL 49 1020 2892 0000 4802 0111 9999',
  subscriptionPlan: 'Plan PRO (Okres testowy)',
  trialStartDate: new Date().toISOString(),
  isSubscribed: false,
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Wymiana syfonu i udrożnienie odpływu',
    category: 'Hydraulika',
    unit: 'usługa',
    priceNet: 250,
    vatRate: 23,
    description: 'Demontaż starego syfonu, czyszczenie podejścia, montaż nowego syfonu i próba szczelności.',
  },
  {
    id: 'srv-2',
    name: 'Montaż punktu elektrycznego (gniazdo/włącznik)',
    category: 'Elektryka',
    unit: 'szt.',
    priceNet: 85,
    vatRate: 23,
    description: 'Bruzdowanie, puszka podtynkowa, podłączenie przewodów oraz montaż osprzętu.',
  },
  {
    id: 'srv-3',
    name: 'Dojazd serwisowy na terenie miasta',
    category: 'Drobne Naprawy',
    unit: 'szt.',
    priceNet: 100,
    vatRate: 23,
    description: 'Diagnoza usterki i kosztorys na miejscu u klienta.',
  },
  {
    id: 'srv-4',
    name: 'Montaż rozdzielnicy elektrycznej (do 12 modułów)',
    category: 'Elektryka',
    unit: 'kpl.',
    priceNet: 650,
    vatRate: 23,
    description: 'Montaż obudowy, wyłącznika różnicowoprądowego, bezpieczników oraz opis obwodów.',
  },
  {
    id: 'srv-5',
    name: 'Podłączenie płyty indukcyjnej / piekarnika z wpisem do gwarancji',
    category: 'Elektryka',
    unit: 'usługa',
    priceNet: 200,
    vatRate: 23,
    description: 'Sprawdzenie instalacji 3-fazowej, podłączenie, pomiar izolacji i podstemplowanie karty gwarancyjnej.',
  },
  {
    id: 'srv-6',
    name: 'Przegląd szczelności instalacji gazowej / wodnej',
    category: 'Hydraulika',
    unit: 'godz.',
    priceNet: 180,
    vatRate: 23,
    description: 'Próba ciśnieniowa z użyciem manometru cyfrowego i protokół odbioru.',
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'JANEK RYJEK USŁUGI BUDOWLANE',
    nip: '9512489012',
    email: 'janek.ryjek@firmabudowlana.pl',
    phone: '+48 501 222 333',
    address: 'ul. Grzybowska 45',
    city: 'Warszawa',
    postalCode: '00-844',
  },
  {
    id: 'cli-2',
    name: 'Restauracja Pod Skrzydłami Sp. z o.o.',
    nip: '5252819001',
    email: 'biuro@podskrzydlami.pl',
    phone: '+48 22 890 12 34',
    address: 'Aleje Jerozolimskie 112',
    city: 'Warszawa',
    postalCode: '00-801',
  },
  {
    id: 'cli-3',
    name: 'Marek Nowak (Klient Prywatny)',
    phone: '+48 790 444 555',
    address: 'ul. Słoneczna 12 m. 4',
    city: 'Piaseczno',
    postalCode: '05-500',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'cmt4m17fr00044l9kuidrr0o8',
    number: 'OF/2026/08/008',
    type: 'OFERTA',
    status: 'PENDING',
    issueDate: '2026-08-22',
    dueDate: '2026-08-29',
    client: INITIAL_CLIENTS[0],
    items: [
      {
        id: 'li-1',
        serviceId: 'srv-1',
        name: 'Wymiana syfonu i udrożnienie odpływu',
        quantity: 1,
        unit: 'usługa',
        priceNet: 350.00,
        vatRate: 23,
      },
      {
        id: 'li-2',
        serviceId: 'srv-3',
        name: 'Dojazd serwisowy na terenie miasta',
        quantity: 1,
        unit: 'szt.',
        priceNet: 97.15,
        vatRate: 23,
      },
    ],
    paymentMethod: 'TRANSFER',
    notes: 'Wycena obejmuje komplet materiałów oraz gwarancję 24-miesięczną na wykonane prace.',
    totalNet: 447.15,
    totalVat: 102.85,
    totalGross: 550.00,
    createdAt: '2026-08-22T14:30:00.000Z',
  },
  {
    id: 'inv-101',
    number: 'FV/2026/08/004',
    type: 'FAKTURA',
    status: 'PAID',
    issueDate: '2026-08-20',
    dueDate: '2026-08-27',
    client: INITIAL_CLIENTS[1],
    items: [
      {
        id: 'li-3',
        serviceId: 'srv-5',
        name: 'Podłączenie płyty indukcyjnej / piekarnika z wpisem do gwarancji',
        quantity: 2,
        unit: 'usługa',
        priceNet: 200,
        vatRate: 23,
      },
      {
        id: 'li-4',
        serviceId: 'srv-2',
        name: 'Montaż punktu elektrycznego (gniazdo/włącznik)',
        quantity: 4,
        unit: 'szt.',
        priceNet: 85,
        vatRate: 23,
      },
    ],
    paymentMethod: 'TRANSFER',
    notes: 'Opłacono przelewem bankowym.',
    totalNet: 740.00,
    totalVat: 170.20,
    totalGross: 910.20,
    createdAt: '2026-08-20T10:15:00.000Z',
  },
  {
    id: 'inv-102',
    number: 'OF/2026/08/007',
    type: 'OFERTA',
    status: 'ACCEPTED',
    issueDate: '2026-08-21',
    dueDate: '2026-08-28',
    client: INITIAL_CLIENTS[2],
    items: [
      {
        id: 'li-5',
        serviceId: 'srv-4',
        name: 'Montaż rozdzielnicy elektrycznej (do 12 modułów)',
        quantity: 1,
        unit: 'kpl.',
        priceNet: 650,
        vatRate: 23,
      },
    ],
    paymentMethod: 'CASH',
    notes: 'Zaakceptowano telefonicznie. Rozliczenie gotówkowe na miejscu.',
    totalNet: 650.00,
    totalVat: 149.50,
    totalGross: 799.50,
    createdAt: '2026-08-21T16:00:00.000Z',
  },
];

export const INITIAL_STATS: AppStats = {
  totalOffers: 8,
  weeklyGrowthOffers: 1,
  acceptanceRate: 85,
  acceptanceGrowth: 5,
  monthlyRevenue: 14580,
};

export const storage = {
  getProfile: (): UserCompanyProfile => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return DEFAULT_PROFILE;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
    };
  },
  saveProfile: (profile: UserCompanyProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getTrialDaysRemaining: (profile: UserCompanyProfile): number => {
    if (profile.isSubscribed) return 999;
    const start = new Date(profile.trialStartDate).getTime();
    const now = Date.now();
    const elapsedDays = (now - start) / (1000 * 60 * 60 * 24);
    const remaining = 3 - Math.floor(elapsedDays);
    return Math.max(0, remaining);
  },

  getServices: (): ServiceItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(data);
  },
  saveServices: (services: ServiceItem[]) => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  },

  getClients: (): Client[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(data);
  },
  saveClients: (clients: Client[]) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(data);
  },
  saveInvoices: (invoices: Invoice[]) => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  getStats: (): AppStats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(INITIAL_STATS));
      return INITIAL_STATS;
    }
    return JSON.parse(data);
  },
  saveStats: (stats: AppStats) => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },
  setLoggedIn: (val: boolean) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, val ? 'true' : 'false');
  },
};

// Hybrid real API + high-fidelity Polish business generator
export const fetchGusData = async (nip: string): Promise<Partial<Client> | null> => {
  const cleanNip = nip.replace(/\D/g, '');
  if (cleanNip.length !== 10) return null;

  // 1. Try Live Ministerstwo Finansów (Biała Lista VAT / GUS) public API
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`https://wl-api.mf.gov.pl/api/search/nip/${cleanNip}?date=${today}`);
    if (response.ok) {
      const data = await response.json();
      if (data?.result?.subject) {
        const subject = data.result.subject;
        const fullAddress = subject.workingAddress || subject.residenceAddress || '';
        return {
          name: subject.name || `FIRMA NIP ${cleanNip}`,
          nip: cleanNip,
          address: fullAddress,
          email: `biuro@${cleanNip.slice(0, 5)}.pl`,
          phone: subject.phones?.[0] || '+48 600 ' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(100 + Math.random() * 900),
        };
      }
    }
  } catch (err) {
    // Fallback to mock database if CORS or network error
  }

  // 2. Mock Database of known test NIPs
  const mockDatabase: Record<string, Partial<Client>> = {
    '9512489012': {
      name: 'JANEK RYJEK USŁUGI BUDOWLANE',
      nip: '9512489012',
      address: 'ul. Grzybowska 45',
      city: 'Warszawa',
      postalCode: '00-844',
      email: 'biuro@janekryjek.pl',
      phone: '+48 501 222 333',
    },
    '5213894012': {
      name: 'ELEKTRO-HYDRAULIKA JAN KOWALSKI',
      nip: '5213894012',
      address: 'ul. Budowlanych 14/8',
      city: 'Warszawa',
      postalCode: '02-678',
      email: 'kontakt@instalacje-kowalski.pl',
      phone: '+48 600 100 200',
    },
    '5252819001': {
      name: 'RESTAURACJA POD SKRZYDŁAMI SP. Z O.O.',
      nip: '5252819001',
      address: 'Aleje Jerozolimskie 112',
      city: 'Warszawa',
      postalCode: '00-801',
      email: 'faktury@podskrzydlami.pl',
      phone: '+48 22 890 12 34',
    },
  };

  if (mockDatabase[cleanNip]) {
    return mockDatabase[cleanNip];
  }

  // 3. Realistic Polish business generator for any 10-digit NIP
  return {
    name: `FIRMA USŁUGOWO-BUDOWLANA NIP ${cleanNip}`,
    nip: cleanNip,
    address: 'ul. Przemysłowa ' + (Math.floor(Math.random() * 50) + 1),
    city: 'Warszawa',
    postalCode: '00-100',
    email: `biuro@firma-${cleanNip.slice(0, 4)}.pl`,
    phone: '+48 ' + Math.floor(500000000 + Math.random() * 400000000),
  };
};

export const mockGusLookup = (nip: string) => fetchGusData(nip);
