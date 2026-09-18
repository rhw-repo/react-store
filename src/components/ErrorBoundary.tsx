// 'Component' must be imported to write any class component
import React, { Component, type ReactNode } from "react";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  // error assigned to the JavaScript Error Object
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Dev phase only. Production: log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  // Allow reset
  componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  // When error, display fallback UI with button to navigate to store page
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <section className="bg-[url('/imgs/error-boundary-bg-image.svg')] bg-cover bg-center flex justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center landscape:flex-row landscape:h-[80vh] landscape:lg:h-auto landscape:xl:flex-col w-3xl p-5 rounded-xl bg-gray-50 text-neutral-900 text-center text-balance text-2xl font-bold portrait:m-8 portrait:sm:md-4 m-4">
              <div className="landscape:flex flex-col">
                <h1 className="text-7xl landscape:text-6xl md:text-9xl text-gray-600 m-4">
                  Oops!
                </h1>
                <h2 className="text-gray-500 text-3xl md:text-4xl landscape:text-2xl">
                  Something went wrong.
                </h2>
              </div>
              <div className="aspect-3/2 p-4 overflow-hidden mb-8 landscape:mb-0">
                <img
                  src="/imgs/error-boundary-image.webp"
                  alt="A retro style robot toy stares with a fixed expression."
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between mt-4 gap-4">
                <p className="text-2xl landscape:text-base font-medium text-gray-500 text-balance">
                  We apologize for the inconvenience. Please use the button
                  below to go back.
                </p>
                <Button
                  variant="blankPages"
                  dataKey="goToStore"
                  onClick={() => (window.location.href = "/store")}
                />
              </div>
            </div>
          </section>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
