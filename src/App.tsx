import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
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
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/storytel" element={<Storytel />} />
              <Route path="/sizzle" element={<Sizzle />} />
              <Route path="/embark" element={<Embark />} />
              <Route path="/tobii" element={<Tobii />} />
              <Route path="/ahouse" element={<Ahouse />} />
              <Route path="/king" element={<King />} />
              <Route path="/nordnet" element={<Nordnet />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
