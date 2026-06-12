import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGold } from "../context/GoldContext";
import { useUser } from "@clerk/clerk-react";

export function useCurrentUser() {
  const { isDemoMode, demoIdentifier } = useGold();
  const { isAuthenticated } = useConvexAuth();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const { isSignedIn, user: clerkUser } = PUBLISHABLE_KEY ? useUser() : { isSignedIn: false, user: null };

  let resolvedDemoIdentifier = isDemoMode ? demoIdentifier : undefined;
  if (!isDemoMode && isSignedIn && clerkUser && !isAuthenticated) {
    resolvedDemoIdentifier = `clerk_${clerkUser.id}`;
  }

  const user = useQuery(api.users.getMe, { 
    demoIdentifier: resolvedDemoIdentifier 
  });
  return user;
}
