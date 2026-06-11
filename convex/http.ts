import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server"; // Import httpAction
import { internal } from "./_generated/api"; // Import internal

const http = httpRouter();

// Define the /api/auth/clerk endpoint
http.route({
  path: "/api/auth/clerk",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response("Unauthorized", { status: 401 });
    }
    const tokenIdentifier = identity.tokenIdentifier;
    // You can now use tokenIdentifier to get more user info from Clerk
    // For example, ctx.runMutation(internal.users.getOrCreateUser, { tokenIdentifier });
    // Or, simply return a successful response to complete the auth flow
    return new Response(null, {
      status: 200,
    });
  }),
});


// Convex expects a default export of an HTTP router.
// It will run all HTTP requests through this router.
export default http;
