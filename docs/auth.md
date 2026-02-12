# Authentication

## Auth Provider
- **Clerk** is the sole authentication provider for this application
- No other auth methods should be implemented

## Protected Routes
- `/dashboard` - requires authentication
- Redirect unauthenticated users to sign-in

## Public Routes
- `/` (homepage) - redirect authenticated users to `/dashboard`

## Sign In/Sign Up
- Always use Clerk modal components
- Never redirect to separate sign-in/sign-up pages

## Implementation
- Use Clerk's Next.js middleware for route protection
- Use `<SignIn />` and `<SignUp />` components with modal display
- Check auth status with `useAuth()` or `auth()` helpers
