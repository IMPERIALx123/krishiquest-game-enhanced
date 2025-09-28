import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { GameProvider } from "./contexts/GameContext";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import MarketPlace from "./pages/MarketPlace";
import Rewards from "./pages/Rewards";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <GameProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/marketplace" element={<MarketPlace />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/community" element={<Community />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
