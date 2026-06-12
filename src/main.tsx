import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as Sentry from "@sentry/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = ReactDOM.createRoot(document.getElementById("root")!);

// 1. Guard against missing Convex URL to prevent runtime crash
if (!convexUrl) {
  root.render(
    <React.StrictMode>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden font-sans p-6">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#BF953F]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FCF6BA]/5 blur-[100px] rounded-full" />
        
        <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#BF953F] to-[#B38728] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold uppercase tracking-wider text-white mb-2">
            Setup Required
          </h1>
          <p className="text-gray-400 text-xs tracking-wider mb-6 font-light px-2 leading-relaxed">
            BitGold cannot initialize because the Convex Backend URL is missing in the production environment.
          </p>

          <div className="w-full text-left space-y-4 mb-6 bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-xs font-light text-gray-300">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-wider mb-2 text-center text-[#D4AF37]">
              How to configure on Vercel:
            </h4>
            <p>1. Open your project on the <span className="text-[#D4AF37] font-medium">Vercel Dashboard</span>.</p>
            <p>2. Go to <span className="text-white font-medium">Settings</span> &rarr; <span className="text-white font-medium">Environment Variables</span>.</p>
            <p>3. Add the following keys:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-400">
              <li><code className="text-white font-mono">VITE_CONVEX_URL</code> &rarr; <span className="text-[10px]">Your Convex dev/prod deployment URL</span></li>
              <li><code className="text-white font-mono">VITE_CLERK_PUBLISHABLE_KEY</code> &rarr; <span className="text-[10px]">(Optional) Clerk OAuth Key</span></li>
            </ul>
            <p className="mt-2 text-[10px] text-gray-500 italic text-center">After adding variables, trigger a new deployment on Vercel.</p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black font-extrabold uppercase tracking-widest text-[10px] shadow-xl shadow-[#D4AF37]/10 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  // 2. Initialize Sentry
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

  const convex = new ConvexReactClient(convexUrl);
  import("./context/GoldContext").then(({ GoldProvider }) => {
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
  });
}