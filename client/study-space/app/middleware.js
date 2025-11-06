import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/history",
]);

export default clerkMiddleware(async (auth, req) => {
  // Exclude /api/webhooks from Clerk auth
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Skip Clerk for webhooks
    "/(api(?!/webhooks)|trpc)(.*)",
  ],
};

