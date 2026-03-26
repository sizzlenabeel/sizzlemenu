import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "./pages/NotFound";
import Storytel from "./pages/Storytel";
import Sizzle from "./pages/Sizzle";
import Embark from "./pages/Embark";
import Tobii from "./pages/Tobii";
import Ahouse from "./pages/Ahouse";
import King from "./pages/King";
import Nordnet from "./pages/Nordnet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/storytel" element={<Storytel />} />
            <Route path="/sizzle" element={<Sizzle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
