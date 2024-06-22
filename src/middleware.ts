import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher([
  "/",
  "/previous",
  "/recordings",
  "/upcoming",
  "/personal-room",
  "/meeting(/.*)",
]);
export default clerkMiddleware((auth, req) =>{
  
    if(protectedRoutes(req)) auth().protect();

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};