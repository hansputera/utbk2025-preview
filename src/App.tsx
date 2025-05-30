
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from "./pages/Dashboard";
import UniversityDetail from "./pages/UniversityDetail";
import ProgramDetail from "./pages/ProgramDetail";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";
import { SEO } from "./components/SEO";

const queryClient = new QueryClient();

// Default SEO configuration for the app
const defaultSEO = {
  title: 'UTBK Tracker - Pantau Prestasi UTBK 2025',
  description: 'Pantau prestasi UTBK 2025, cek passing grade, dan lihat statistik kampus dengan UTBK Tracker.',
  type: 'website',
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SEO {...defaultSEO} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/university/:id" element={<UniversityDetail />} />
            <Route path="/university/:id/program/:programId" element={<ProgramDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
