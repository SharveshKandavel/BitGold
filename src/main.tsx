import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [/^https:\/\/.*\.convex\.cloud/, "localhost"],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

import { GoldProvider } from "./context/GoldContext";

// 2. Ensure Database and Auth variables are loaded
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root")!);

if (!PUBLISHABLE_KEY) {
  console.warn("Clerk Publishable Key is missing. Rendering app without Clerk authentication.");
  root.render(
    <React.StrictMode>
      <ConvexProvider client={convex}>
        <GoldProvider>
          <App />
        </GoldProvider>
      </ConvexProvider>
    </React.StrictMode>
  );
} else {
  // 3. Render the App securely
  root.render(
    <React.StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        routerPush={(to: string) => window.history.pushState({}, "", to)}
        routerReplace={(to: string) => window.history.replaceState({}, "", to)}
        localization={{
          signIn: {
            start: {
              title: "Sign in to BitGold",
              subtitle: "to access your secure gold vault"
            },
          },
          signUp: {
            start: {
              title: "Create BitGold Account",
              subtitle: "start your gold investment journey"
            },
          }
        }}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <GoldProvider>
            <App />
          </GoldProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </React.StrictMode>
  );
}