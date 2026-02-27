import type { Appointment, Customer, Pet, Transaction, UUID, Service } from "./types";

function id(prefix: string, n: number): UUID {
  return `${prefix}_${n}`;
}

const today = new Date();
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const seedCustomers: Customer[] = [
  {
    id: id("c", 1),
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 98888-7777",
    address: "Rua das Flores, 123 - Jardim Pet, São Paulo/SP",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("c", 2),
    name: "Maria Oliveira",
    email: "maria@email.com",
    phone: "(11) 97777-6666",
    address: "Rua Augusta, 500 - São Paulo/SP",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("c", 3),
    name: "Pedro Santos",
    email: "pedro@email.com",
    phone: "(11) 96666-5555",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("c", 4),
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 95555-4444",
    address: "Rua Haddock Lobo, 77 - São Paulo/SP",
    createdAt: new Date().toISOString(),
  },
];

export const seedPets: Pet[] = [
  {
    id: id("p", 1),
    name: "Max",
    species: "Cachorro",
    customerId: id("c", 1),
    photoDataUrl:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
    birthDate: "2022-04-18",
    size: "Grande",
    taxiDogPref: true,
    notes: "Gosta de água morna.",
    packages: [
      {
        id: id("pkg", 1),
        type: "mensal",
        totalBaths: 4,
        usedBaths: 1,
        startDate: isoDate(today),
        active: true,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: id("p", 2),
    name: "Luna",
    species: "Gato",
    customerId: id("c", 2),
    photoDataUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    birthDate: "2021-11-02",
    size: "Médio",
    taxiDogPref: false,
    packages: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: id("p", 3),
    name: "Thor",
    species: "Cachorro",
    customerId: id("c", 3),
    photoDataUrl:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop",
    birthDate: "2020-08-10",
    size: "Grande",
    taxiDogPref: true,
    packages: [
      {
        id: id("pkg", 2),
        type: "quinzenal",
        totalBaths: 2,
        usedBaths: 0,
        startDate: isoDate(today),
        active: true,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: id("p", 4),
    name: "Mel",
    species: "Gato",
    customerId: id("c", 4),
    photoDataUrl:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
    birthDate: "2023-02-21",
    size: "Pequeno",
    taxiDogPref: false,
    packages: [],
    createdAt: new Date().toISOString(),
  },
];

export const seedAppointments: Appointment[] = [
  {
    id: id("a", 1),
    petId: id("p", 1),
    serviceName: "Banho e Tosa",
    date: isoDate(today),
    time: "09:00",
    taxiDog: true,
    status: "Confirmado",
    notes: "Cortar unhas.",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("a", 2),
    petId: id("p", 2),
    serviceName: "Consulta Veterinária",
    date: isoDate(today),
    time: "10:30",
    taxiDog: false,
    status: "Pendente",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("a", 3),
    petId: id("p", 3),
    serviceName: "Banho",
    date: isoDate(today),
    time: "14:00",
    taxiDog: true,
    status: "Confirmado",
    createdAt: new Date().toISOString(),
  },
];

export const seedTransactions: Transaction[] = [
  {
    id: id("t", 1),
    type: "income",
    description: "Banho e Tosa - Max",
    category: "Serviços",
    amountCents: 8500,
    date: isoDate(today),
    paymentMethod: "PIX",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("t", 2),
    type: "income",
    description: "Taxi Dog - Luna",
    category: "Taxi Dog",
    amountCents: 2500,
    date: isoDate(today),
    paymentMethod: "Dinheiro",
    createdAt: new Date().toISOString(),
  },
  {
    id: id("t", 3),
    type: "expense",
    description: "Fornecedor de Shampoo",
    category: "Fornecedores",
    amountCents: 45000,
    date: isoDate(today),
    createdAt: new Date().toISOString(),
  },
];

export const seedServices: Service[] = [
  {
    id: id("s", 1),
    name: "Banho",
    priceCents: 4500,
    durationMin: 45,
    category: "Banho",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: id("s", 2),
    name: "Banho e Tosa",
    priceCents: 8500,
    durationMin: 90,
    category: "Tosa",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: id("s", 3),
    name: "Tosa Higiênica",
    priceCents: 3500,
    durationMin: 30,
    category: "Tosa",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: id("s", 4),
    name: "Consulta Veterinária",
    priceCents: 15000,
    durationMin: 40,
    category: "Veterinária",
    active: true,
    createdAt: new Date().toISOString(),
  },
];