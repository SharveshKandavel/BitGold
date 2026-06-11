import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGold } from "../context/GoldContext";

export function useCurrentUser() {
  const { isDemoMode, demoIdentifier } = useGold();
  const user = useQuery(api.users.getMe, { 
    demoIdentifier: isDemoMode ? demoIdentifier : undefined 
  });
  return user;
}
