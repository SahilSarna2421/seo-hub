import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";

import Index from "./pages/Index"; // Home page
import Analyzer from "./pages/Analyzer"; // ✅ NEW
import ContentOptimizer from "./pages/ContentOptimizer"; // ✅ NEW
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* 🏠 Home */}
            <Route path="/" element={<Index />} />

            {/* 🔍 Website Analyzer */}
            <Route path="/analyzer" element={<Analyzer />} />

            {/* ✍️ Content Optimizer */}
            <Route path="/optimizer" element={<ContentOptimizer />} />

            {/* ❌ Fallback */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;