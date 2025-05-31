
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TodoProvider } from "@/contexts/TodoContext";
import { FocusProvider } from "@/contexts/FocusContext";

import Layout from "@/components/layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PaperGenerator from "./pages/PaperGenerator";
import AnswerAnalyzer from "./pages/AnswerAnalyzer";
import DoubtSolver from "./pages/DoubtSolver";
import Todo from "./pages/Todo";
import Focus from "./pages/Focus";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <TodoProvider>
            <FocusProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Auth routes */}
                  <Route path="/" element={<Layout requireAuth={false}><Login /></Layout>} />
                  <Route path="/signup" element={<Layout requireAuth={false}><Signup /></Layout>} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                  <Route path="/paper-generator" element={<Layout><PaperGenerator /></Layout>} />
                  <Route path="/answer-analyzer" element={<Layout><AnswerAnalyzer /></Layout>} />
                  <Route path="/doubt-solver" element={<Layout><DoubtSolver /></Layout>} />
                  <Route path="/todo" element={<Layout><Todo /></Layout>} />
                  <Route path="/focus" element={<Layout><Focus /></Layout>} />
                  <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
                  
                  {/* Fallback routes */}
                  <Route path="/auth" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </FocusProvider>
          </TodoProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
