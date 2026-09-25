import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: QueryClient;
  }
}

// Development only: in production anyone could inspect the cache from the console
if (import.meta.env.DEV) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
