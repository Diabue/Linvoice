export type InvoiceType = 'FAKTURA' | 'OFERTA';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT' | 'ACCEPTED';

export type PaymentMethod = 'TRANSFER' | 'CASH' | 'CARD';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Hydraulika' | 'Elektryka' | 'HVAC' | 'Drobne Naprawy' | 'Inne';
  unit: 'szt.' | 'godz.' | 'usługa' | 'm' | 'kpl.';
  priceNet: number;
  vatRate: number;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  nip?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface InvoiceLineItem {
  id: string;
  serviceId?: string;
  name: string;
  quantity: number;
  unit: string;
  priceNet: number;
  vatRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  client: Client;
  items: InvoiceLineItem[];
  paymentMethod: PaymentMethod;
  notes?: string;
  totalNet: number;
  totalVat: number;
  totalGross: number;
  createdAt: string;
}

export interface UserCompanyProfile {
  name: string;
  nip: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
  bankAccount: string;
  logoUrl?: string;
  subscriptionPlan: string;
  trialStartDate: string;
  isSubscribed: boolean;
}

export interface AppStats {
  totalOffers: number;
  weeklyGrowthOffers: number;
  acceptanceRate: number;
  acceptanceGrowth: number;
  monthlyRevenue: number;
}
