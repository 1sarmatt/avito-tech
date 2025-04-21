
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskModalProvider } from "@/hooks/useTaskModal";

// Pages
import { BoardsPage } from "./pages/BoardsPage";
import { BoardPage } from "./pages/BoardPage";
import { IssuesPage } from "./pages/IssuesPage";
import NotFound from "./pages/NotFound";

// Components
import { Header } from "./components/Header";
import { TaskModal } from "./components/TaskModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TaskModalProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<BoardsPage />} />
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="/board/:id" element={<BoardPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <TaskModal />
        </BrowserRouter>
      </TaskModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
