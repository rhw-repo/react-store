import { Route, Routes, Navigate } from "react-router-dom";
import { Store } from "./pages/Store";
import { About } from "./pages/About";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import PageTemplate from "./components/PageTemplate";

function App() {
  return (
    <ErrorBoundary resetKey={location.pathname}>
      <ShoppingCartProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col justify-center items-center">
            <Routes>
              <Route path="/store" element={<Store />} />
              <Route path="/about" element={<About />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/" element={<Navigate to="/store" replace />} />
              <Route
                path="*"
                element={
                  <PageTemplate
                    heading="404 Page Not Found"
                    subheading="That address doesn't match any page."
                    message="Please visit the Store page."
                  />
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </ShoppingCartProvider>
    </ErrorBoundary>
  );
}

export default App;
