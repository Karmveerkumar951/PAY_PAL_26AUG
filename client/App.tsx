import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BiometricSetup from "./pages/BiometricSetup";
import Payment from "./pages/Payment";
import QRScanner from "./pages/QRScanner";
import DocumentLocker from "./pages/DocumentLocker";
import Accessibility from "./pages/Accessibility";
import Palmistry from "./pages/Palmistry";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => {
  // Force dark mode for PalmPay Secure
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("dark");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/biometric-setup" element={<BiometricSetup />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/qr-scanner" element={<QRScanner />} />
              <Route path="/document-locker" element={<DocumentLocker />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/palmistry" element={<Palmistry />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
