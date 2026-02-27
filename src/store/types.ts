export type UUID = string;

export type Species = "Cachorro" | "Gato" | "Outro";
export type PackageType = "mensal" | "quinzenal";
export type PetSize = "Pequeno" | "Médio" | "Grande" | "GG";

export type TaxiDogLeg = "pickup" | "dropoff";
export type TaxiDogStatus = "pending" | "in_progress" | "completed";

export type PaymentMethod = "PIX" | "Cartão" | "Dinheiro";

export type TransactionCategory =
  | "Serviços"
  | "Produtos"
  | "Taxi Dog"
  | "Fornecedores"
  | "Fixos"
  | "Outros";

export interface Customer {
  id: UUID;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string; // ISO
}

export interface PetPackage {
  id: UUID;
  type: PackageType;
  totalBaths: number;
  usedBaths: number;
  startDate: string; // ISO date
  active: boolean;
}

export interface Pet {
  id: UUID;
  name: string;
  species: Species;
  customerId: UUID;
  photoDataUrl?: string;
  birthDate?: string; // ISO date
  size?: PetSize;
  taxiDogPref: boolean;
  notes?: string;
  packages: PetPackage[];
  createdAt: string; // ISO
}

export interface Appointment {
  id: UUID;
  petId: UUID;
  serviceName: string;
  date: string; // ISO date
  time: string; // HH:mm
  taxiDog: boolean;
  // Mantemos antigos para compatibilidade, mas priorizamos Pendente | Em andamento | Concluído no app
  status: "Confirmado" | "Pendente" | "Atrasado" | "Em andamento" | "Concluído";
  notes?: string;
  createdAt: string; // ISO
}

export interface TaxiDogRoute {
  id: UUID;
  appointmentId: UUID;
  petId: UUID;
  customerId: UUID;
  leg: TaxiDogLeg;
  time: string; // HH:mm
  address: string;
  status: TaxiDogStatus;
  createdAt: string; // ISO
}

export interface Transaction {
  id: UUID;
  type: "income" | "expense";
  description: string;
  category: TransactionCategory;
  amountCents: number;
  date: string; // ISO date
  paymentMethod?: PaymentMethod;
  createdAt: string; // ISO
}

export interface Service {
  id: UUID;
  name: string;
  priceCents: number;
  durationMin: number;
  category?: string;
  active: boolean;
  createdAt: string; // ISO
}

export interface AppSettings {
  notifications: {
    whatsapp24h: boolean;
    whatsapp2h: boolean;
    reminderTemplate: string;
  };
  brand: {
    name: string;
    logoDataUrl?: string;
  };
}

export type AppSettingsPatch = {
  notifications?: Partial<AppSettings["notifications"]>;
  brand?: Partial<AppSettings["brand"]>;
};