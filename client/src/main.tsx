import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ModalProvider } from "@/lib/modalContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ModalProvider>
      <App />
    </ModalProvider>
  </QueryClientProvider>
);
