"use client";

import React from "react";
import type {
  Appointment,
  Customer,
  Pet,
  PetPackage,
  TaxiDogRoute,
  Transaction,
  UUID,
  AppSettings,
  Service,
  AppSettingsPatch,
} from "./types";
import {
  seedAppointments,
  seedCustomers,
  seedPets,
  seedTransactions,
  seedServices,
} from "./seed";
import { fetchRemoteSettings, saveRemoteSettings } from "@/integrations/supabase/settings";

type State = {
  customers: Customer[];
  pets: Pet[];
  appointments: Appointment[];
  transactions: Transaction[];
  services: Service[];
  settings: AppSettings;
};

type Actions = {
  addCustomer: (input: Omit<Customer, "id" | "createdAt">) => UUID;
  updateCustomer: (id: UUID, patch: Partial<Omit<Customer, "id" | "createdAt">>) => void;
  deleteCustomer: (id: UUID) => void;

  addPet: (input: Omit<Pet, "id" | "createdAt" | "packages"> & { packages?: PetPackage[] }) => UUID;
  updatePet: (id: UUID, patch: Partial<Omit<Pet, "id" | "createdAt">>) => void;
  deletePet: (id: UUID) => void;

  addPackage: (petId: UUID, type: PetPackage["type"], startDate: string) => UUID;
  consumeBathFromActivePackage: (petId: UUID) => void;
  deactivatePackage: (petId: UUID, packageId: UUID) => void;

  addAppointment: (input: Omit<Appointment, "id" | "createdAt">) => UUID;
  updateAppointment: (id: UUID, patch: Partial<Omit<Appointment, "id" | "createdAt">>) => void;

  addTransaction: (input: Omit<Transaction, "id" | "createdAt">) => UUID;

  addService: (input: Omit<Service, "id" | "createdAt">) => UUID;
  updateService: (id: UUID, patch: Partial<Omit<Service, "id" | "createdAt">>) => void;
  deleteService: (id: UUID) => void;

  updateSettings: (patch: AppSettingsPatch) => void;
};

const STORAGE_KEY = "petmanager_state_v3";

function nowIso() {
  return new Date().toISOString();
}

function genId(prefix: string): UUID {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const defaultSettings: AppSettings = {
  notifications: {
    whatsapp24h: true,
    whatsapp2h: true,
    reminderTemplate:
      "Olá! Lembrete do agendamento de {servico} do pet {pet} em {data} às {hora}. Caso precise reagendar, por favor nos avise. Obrigado!",
  },
  brand: {
    name: "PetManager",
    logoDataUrl: undefined,
  },
};

function mergeSettings(input?: Partial<AppSettings>): AppSettings {
  return {
    ...defaultSettings,
    ...(input ?? {}),
    brand: {
      ...defaultSettings.brand,
      ...(input?.brand ?? {}),
    },
    notifications: {
      ...defaultSettings.notifications,
      ...(input?.notifications ?? {}),
      reminderTemplate:
        input?.notifications?.reminderTemplate ?? defaultSettings.notifications.reminderTemplate,
    },
  };
}

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      return {
        ...parsed,
        services: parsed.services ?? seedServices,
        settings: mergeSettings(parsed.settings),
      };
    }
    const rawV2 = localStorage.getItem("petmanager_state_v2");
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Omit<State, "services"> & Partial<Pick<State, "services">>;
      return {
        customers: parsed.customers,
        pets: parsed.pets,
        appointments: parsed.appointments,
        transactions: parsed.transactions,
        services: parsed.services ?? seedServices,
        settings: mergeSettings(parsed.settings),
      };
    }
  } catch {
    // ignore
  }
  return {
    customers: seedCustomers,
    pets: seedPets,
    appointments: seedAppointments,
    transactions: seedTransactions,
    services: seedServices,
    settings: defaultSettings,
  };
}

function computeNextBathDate(startDate: string, type: PetPackage["type"], usedBaths: number) {
  const base = new Date(startDate + "T00:00:00");
  const days = type === "mensal" ? 7 * usedBaths : 15 * usedBaths;
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const StoreContext = React.createContext<(State & Actions) | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(() => loadInitial());

  const remoteLoadedRef = React.useRef(false);
  const remoteAvailableRef = React.useRef(false);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Tenta carregar do Supabase; se conseguir, habilita salvamento remoto.
  React.useEffect(() => {
    (async () => {
      const remote = await fetchRemoteSettings();
      if (remote) {
        setState((s) => ({ ...s, settings: mergeSettings(remote) }));
        remoteAvailableRef.current = true;
      } else {
        remoteAvailableRef.current = false;
      }
      remoteLoadedRef.current = true;
    })();
  }, []);

  // Salva remotamente apenas se o remoto estiver disponível (evita 5xx)
  React.useEffect(() => {
    if (!remoteLoadedRef.current || !remoteAvailableRef.current) return;
    (async () => {
      await saveRemoteSettings(state.settings);
    })();
  }, [state.settings]);

  const api = React.useMemo<State & Actions>(() => {
    const addCustomer: Actions["addCustomer"] = (input) => {
      const id = genId("c");
      setState((s) => ({
        ...s,
        customers: [{ id, createdAt: nowIso(), ...input }, ...s.customers],
      }));
      return id;
    };

    const updateCustomer: Actions["updateCustomer"] = (id, patch) => {
      setState((s) => ({
        ...s,
        customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    };

    const deleteCustomer: Actions["deleteCustomer"] = (id) => {
      setState((s) => {
        const remainingPets = s.pets.filter((p) => p.customerId !== id);
        const removedPetIds = new Set(s.pets.filter((p) => p.customerId === id).map((p) => p.id));
        const remainingAppointments = s.appointments.filter((a) => !removedPetIds.has(a.petId));
        return {
          ...s,
          customers: s.customers.filter((c) => c.id !== id),
          pets: remainingPets,
          appointments: remainingAppointments,
        };
      });
    };

    const addPet: Actions["addPet"] = (input) => {
      const id = genId("p");
      const { packages, ...rest } = input;
      setState((s) => ({
        ...s,
        pets: [{ id, createdAt: nowIso(), packages: packages ?? [], ...rest }, ...s.pets],
      }));
      return id;
    };

    const updatePet: Actions["updatePet"] = (id, patch) => {
      setState((s) => ({
        ...s,
        pets: s.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
    };

    const deletePet: Actions["deletePet"] = (id) => {
      setState((s) => ({
        ...s,
        pets: s.pets.filter((p) => p.id !== id),
        appointments: s.appointments.filter((a) => a.petId !== id),
      }));
    };

    const addPackage: Actions["addPackage"] = (petId, type, startDate) => {
      const packageId = genId("pkg");
      setState((s) => ({
        ...s,
        pets: s.pets.map((p) => {
          if (p.id !== petId) return p;
          const next: PetPackage = {
            id: packageId,
            type,
            totalBaths: type === "mensal" ? 4 : 2,
            usedBaths: 0,
            startDate,
            active: true,
          };
          return {
            ...p,
            packages: [next, ...p.packages.map((pk) => ({ ...pk, active: false }))],
          };
        }),
      }));
      return packageId;
    };

    const consumeBathFromActivePackage: Actions["consumeBathFromActivePackage"] = (petId) => {
      setState((s) => ({
        ...s,
        pets: s.pets.map((p) => {
          if (p.id !== petId) return p;
          const idx = p.packages.findIndex((pk) => pk.active);
          if (idx === -1) return p;
          const pk = p.packages[idx];
          const used = Math.min(pk.usedBaths + 1, pk.totalBaths);
          const finished = used >= pk.totalBaths;
          const nextPk: PetPackage = { ...pk, usedBaths: used, active: !finished };
          const next = [...p.packages];
          next[idx] = nextPk;
          return { ...p, packages: next };
        }),
      }));
    };

    const deactivatePackage: Actions["deactivatePackage"] = (petId, packageId) => {
      setState((s) => ({
        ...s,
        pets: s.pets.map((p) => {
          if (p.id !== petId) return p;
          return {
            ...p,
            packages: p.packages.map((pk) => (pk.id === packageId ? { ...pk, active: false } : pk)),
          };
        }),
      }));
    };

    const addAppointment: Actions["addAppointment"] = (input) => {
      const id = genId("a");
      setState((s) => ({
        ...s,
        appointments: [{ id, createdAt: nowIso(), ...input }, ...s.appointments],
      }));
      return id;
    };

    const updateAppointment: Actions["updateAppointment"] = (id, patch) => {
      setState((s) => ({
        ...s,
        appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      }));
    };

    const addTransaction: Actions["addTransaction"] = (input) => {
      const id = genId("t");
      setState((s) => ({
        ...s,
        transactions: [{ id, createdAt: nowIso(), ...input }, ...s.transactions],
      }));
      return id;
    };

    const addService: Actions["addService"] = (input) => {
      const id = genId("s");
      setState((s) => ({
        ...s,
        services: [{ id, createdAt: nowIso(), ...input }, ...s.services],
      }));
      return id;
    };

    const updateService: Actions["updateService"] = (id, patch) => {
      setState((s) => ({
        ...s,
        services: s.services.map((svc) => (svc.id === id ? { ...svc, ...patch } : svc)),
      }));
    };

    const deleteService: Actions["deleteService"] = (id) => {
      setState((s) => ({
        ...s,
        services: s.services.filter((svc) => svc.id !== id),
      }));
    };

    const updateSettings: Actions["updateSettings"] = (patch) => {
      setState((s) => ({
        ...s,
        settings: {
          ...s.settings,
          ...(patch as Partial<AppSettings>),
          brand: {
            ...s.settings.brand,
            ...(patch.brand ?? {}),
          },
          notifications: {
            ...s.settings.notifications,
            ...(patch.notifications ?? {}),
            reminderTemplate:
              patch.notifications?.reminderTemplate ?? s.settings.notifications.reminderTemplate,
          },
        },
      }));
    };

    return {
      ...state,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addPet,
      updatePet,
      deletePet,
      addPackage,
      consumeBathFromActivePackage,
      deactivatePackage,
      addAppointment,
      updateAppointment,
      addTransaction,
      addService,
      updateService,
      deleteService,
      updateSettings,
    };
  }, [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function getActivePackage(pet: Pet) {
  return pet.packages.find((pk) => pk.active);
}

export function getNextBathDateFromPackage(pkg: PetPackage) {
  const nextIndex = pkg.usedBaths;
  const d = computeNextBathDate(pkg.startDate, pkg.type, nextIndex);
  return d;
}

export function getCustomerById(customers: Customer[], id: UUID) {
  return customers.find((c) => c.id === id);
}

export function getPetById(pets: Pet[], id: UUID) {
  return pets.find((p) => p.id === id);
}

export function getPetsByCustomerId(pets: Pet[], customerId: UUID) {
  return pets.filter((p) => p.customerId === customerId);
}

export function buildTaxiRoutesForDate(
  pets: Pet[],
  customers: Customer[],
  appointments: Appointment[],
  date: string,
): TaxiDogRoute[] {
  const routes: TaxiDogRoute[] = [];
  for (const appt of appointments) {
    if (appt.date !== date) continue;
    if (!appt.taxiDog) continue;
    const pet = getPetById(pets, appt.petId);
    if (!pet) continue;
    const cust = getCustomerById(customers, pet.customerId);
    if (!cust?.address) continue;

    routes.push({
      id: genId("r"),
      appointmentId: appt.id,
      petId: pet.id,
      customerId: cust.id,
      leg: "pickup",
      time: appt.time,
      address: cust.address,
      status: "pending",
      createdAt: nowIso(),
    });
    const [hh, mm] = appt.time.split(":").map(Number);
    const drop = new Date(`${date}T${appt.time}:00`);
    drop.setHours(hh + 2, mm, 0, 0);
    const dropTime = drop.toISOString().slice(11, 16);
    routes.push({
      id: genId("r"),
      appointmentId: appt.id,
      petId: pet.id,
      customerId: cust.id,
      leg: "dropoff",
      time: dropTime,
      address: cust.address,
      status: "pending",
      createdAt: nowIso(),
    });
  }

  routes.sort((a, b) => a.time.localeCompare(b.time));
  return routes;
}