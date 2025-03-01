
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LeaveApplication from "./pages/LeaveApplication";
import Attendance from "./pages/Attendance";
import Academics from "./pages/Academics";
import Calendar from "./pages/Calendar";
import Homework from "./pages/Homework";
import Fees from "./pages/Fees";
import Timetable from "./pages/Timetable";
import Results from "./pages/Results";
import Permission from "./pages/Permission";
import Transport from "./pages/Transport";
import Announcements from "./pages/Announcements";
import Messages from "./pages/Messages";

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
            <Route path="/academics" element={<Academics />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/leaves" element={<LeaveApplication />} />
            <Route path="/results" element={<Results />} />
            <Route path="/permission" element={<Permission />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
