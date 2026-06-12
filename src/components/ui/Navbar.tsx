import { cn } from "../../lib/utils";
import BitGoldLogo from "../brand/BitGoldLogo";
import NavLink from "./NavLink";
import Container from "./Container";
import { useLocation } from "../../context/LocationContext";
import { ShieldCheck, User } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUser } from "@clerk/clerk-react";

export function Navbar() {
  const { currentLocation } = useLocation();
  const user = useCurrentUser();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const { user: clerkUser } = PUBLISHABLE_KEY ? useUser() : { user: null };

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const dbName = user?.name && user.name !== "New User" ? user.name : user?.email;
  const clerkName = clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress;
  const displayName = dbName || clerkName || 'Valued Member';

  return (
    <nav className="pt-8">
      <Container className="flex justify-between items-start">
        <div>
          <p className="text-darkGray text-sm font-sans">Welcome back 👋</p>
          <h1 className="text-white text-2xl font-bold font-sans">
            {user?.name && user.name !== "New User" 
              ? `${user.name.split(" ")[0]}'s Gold Vault` 
              : user?.email 
                ? `${user.email.split("@")[0]}'s Gold Vault` 
                : "Your Gold Portfolio"}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5 overflow-hidden bg-white/5">
            {user?.picture ? (
              <img src={user.picture} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                {getInitials(displayName)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck size={12} />
            <span>Vault Secured</span>
          </div>
        </div>
      </Container>
    </nav>
  );
}
