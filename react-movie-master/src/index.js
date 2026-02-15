import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import App from "./App";

// Get Clerk Publishable Key
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Please add REACT_APP_CLERK_PUBLISHABLE_KEY to your .env file");
}

// React 18 API
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
