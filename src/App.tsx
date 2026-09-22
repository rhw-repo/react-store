import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Store } from "./pages/Store";
import { About } from "./pages/About";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import BlankPagesTemplate from "./components/BlankPagesTemplate";

function App() {
  return (
    <ErrorBoundary resetKey={location.pathname}>
      <ShoppingCartProvider>
        {/* A min-h-screen column with main as the only growing child. Without
            this the page is always taller than the viewport, because a
            full-height page section stacks *below* the Navbar rather than
            sharing the viewport with it. */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col justify-center items-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/about" element={<About />} />
              <Route
                path="*"
                element={
                  <BlankPagesTemplate
                    heading="Page Not Found"
                    subheading="That address doesn't match any page on this site."
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
