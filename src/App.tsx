
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Initialize Capacitor
const configureCapacitor = () => {
  // This is where Capacitor specific initialization would go
  console.log("Capacitor app initialized");
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize Capacitor when the app loads
    configureCapacitor();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/academics" element={<Navigate to="/" />} />
            <Route path="/calendar" element={<Navigate to="/" />} />
            <Route path="/messages" element={<Navigate to="/" />} />
            <Route path="/fees" element={<Navigate to="/" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
