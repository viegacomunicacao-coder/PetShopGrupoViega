import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/store/store";
import ReminderScheduler from "@/components/ReminderScheduler";
import DocumentTitle from "@/components/DocumentTitle";
import AppFooter from "@/components/AppFooter";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PetDetails from "./pages/PetDetails";
import Inventory from "./pages/Inventory";
import Agenda from "./pages/Agenda";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Financial from "./pages/Financial";
import TaxiDog from "./pages/TaxiDog";
import NotFound from "./pages/NotFound";
import { SessionProvider } from "@/integrations/supabase/SessionProvider";
import RequireAuth from "@/components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ReminderScheduler />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SessionProvider>
            <DocumentTitle />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/pet/:id"
                element={
                  <RequireAuth>
                    <PetDetails />
                  </RequireAuth>
                }
              />
              <Route
                path="/inventory"
                element={
                  <RequireAuth>
                    <Inventory />
                  </RequireAuth>
                }
              />
              <Route
                path="/agenda"
                element={
                  <RequireAuth>
                    <Agenda />
                  </RequireAuth>
                }
              />
              <Route
                path="/customers"
                element={
                  <RequireAuth>
                    <Customers />
                  </RequireAuth>
                }
              />
              <Route
                path="/customer/:id"
                element={
                  <RequireAuth>
                    <CustomerDetails />
                  </RequireAuth>
                }
              />
              <Route
                path="/services"
                element={
                  <RequireAuth>
                    <Services />
                  </RequireAuth>
                }
              />
              <Route
                path="/financial"
                element={
                  <RequireAuth>
                    <Financial />
                  </RequireAuth>
                }
              />
              <Route
                path="/taxidog"
                element={
                  <RequireAuth>
                    <TaxiDog />
                  </RequireAuth>
                }
              />
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <NotFound />
                  </RequireAuth>
                }
              />
            </Routes>
            <AppFooter />
          </SessionProvider>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;