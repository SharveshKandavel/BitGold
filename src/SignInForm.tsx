"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import Input from "./components/ui/Input";
import Button from "./components/ui/Button";
import LoadingSpinner from "./components/ui/LoadingSpinner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={submitting}
        />
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          required
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? <LoadingSpinner /> : (flow === "signIn" ? "Sign in" : "Sign up")}
        </Button>
        <div className="text-center text-sm text-bitgold-lightGold">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-bitgold-gold hover:text-bitgold-lightGold hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            disabled={submitting}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-bitgold-700" />
        <span className="mx-4 text-bitgold-lightGold">or</span>
        <hr className="my-4 grow border-bitgold-700" />
      </div>
      <Button onClick={() => void signIn("anonymous")} disabled={submitting}>
        {submitting ? <LoadingSpinner /> : "Sign in anonymously"}
      </Button>
    </div>
  );
}
