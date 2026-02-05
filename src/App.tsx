import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Store } from "./pages/Store";
import { About } from "./pages/About";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <ErrorBoundary resetKey={location.pathname}>
        <ShoppingCartProvider>
          <Navbar />
          <main className="flex flex-col justify-center items-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
          </main>
        </ShoppingCartProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
