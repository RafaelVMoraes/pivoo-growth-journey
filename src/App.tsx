import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Intro from "./pages/Intro";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import SelfDiscovery from "./pages/SelfDiscovery";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <AppLayout>
                  <Goals />
                </AppLayout>
              } 
            />
            <Route 
              path="/self-discovery" 
              element={
                <AppLayout>
                  <SelfDiscovery />
                </AppLayout>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <AppLayout>
                  <Profile />
                </AppLayout>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
