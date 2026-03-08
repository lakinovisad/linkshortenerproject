---
description: Read this before implementing data mutations or server actions in the project.
---
# Server Actions

## Data Mutations
- All data mutations MUST be done via server actions
- Never use API routes for data mutations

## File Naming and Location
- Server action files MUST be named `actions.ts`
- Colocate `actions.ts` in the same directory as the component that calls it
- Example: `app/dashboard/actions.ts` for components in `app/dashboard/`

## Server Actions Must Be Called From Client Components
- Mark components with `'use client'` directive
- Import and call server actions from client components

## Type Safety
- All data passed to server actions MUST have explicit TypeScript types
- **DO NOT use the FormData TypeScript type**
- Define proper interfaces or types for action parameters

## Data Validation
- All input data MUST be validated using Zod schemas
- Validate before any database operations
- Return appropriate error messages for validation failures

## Authentication
- Every server action MUST check for an authenticated user first
- Use `auth()` from Clerk before any database operations
- Return early if user is not authenticated

## Database Operations
- **DO NOT use Drizzle queries directly in server actions**
- Use helper functions from the `/data` directory
- Helper functions wrap Drizzle queries and handle common patterns
- Example: Import from `@/data/links` instead of calling `db.select()` directly

## Error Handling
- **DO NOT throw errors in server actions**
- Always return an object with either `error` or `success` property
- Use try-catch blocks and return error messages instead of throwing
- Return `{ error: 'Error message' }` for failures
- Return `{ success: true }` or `{ success: true, data: ... }` for successful operations

## Example Structure
```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLinkInDB } from '@/data/links';

const linkSchema = z.object({
  url: z.string().url(),
  shortCode: z.string().min(3),
});

export async function createLink(data: { url: string; shortCode: string }) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // 2. Validate data
  const parsed = linkSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  // 3. Use helper function from /data with error handling
  try {
    const link = await createLinkInDB(userId, parsed.data);
    return { success: true, data: link };
  } catch (error) {
    console.error('Create link error:', error);
    return { error: 'Failed to create link' };
  }
}
```
