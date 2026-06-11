import type { AuthConfig } from "convex/server";

const authConfig: AuthConfig = {
  providers: [
    {
      // 1. THIS IS YOUR CLERK ISSUER URL (From your logs)
      domain: "https://renewed-cowbird-44.clerk.accounts.dev", 
      
      // 2. THIS MUST BE "convex" (Not "clerk")
      applicationID: "convex",
    },
  ],
};

export default authConfig;