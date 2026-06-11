"use client";
import { useClerk } from "@clerk/clerk-react";
import Button from "./components/ui/Button";

export function SignOutButton() {
  const clerk = useClerk();

  const handleSignOut = () => {
    if (localStorage.getItem('bitgold_demo_mode') === 'true') {
      localStorage.removeItem('bitgold_demo_mode');
      window.location.reload();
    } else {
      clerk.signOut();
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
