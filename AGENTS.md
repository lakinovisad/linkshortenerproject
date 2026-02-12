# Agent Instructions - Link Shortener Project

**Version**: 1.0  
**Last Updated**: 2026-02-10

## Overview

This document serves as the master reference for AI coding agents working on this Link Shortener project. All agents must follow these coding standards and patterns to maintain consistency and quality.

## ⚠️ CRITICAL: Read Documentation BEFORE Coding

**ALWAYS read the relevant documentation files in the `/docs` directory BEFORE generating ANY code.**

This is NON-NEGOTIABLE. Each documentation file contains specific standards, patterns, and critical rules that MUST be followed. Generating code without consulting the relevant documentation will result in:
- Non-compliant code that violates project standards
- Custom components when Shadcn UI equivalents exist
- Incorrect authentication patterns
- Database queries that don't follow established patterns
- Type safety violations

**Before writing ANY code, ask yourself: "Which docs file(s) do I need to read first?"**

## Documentation Structure

Detailed instructions are organized in the `/docs` directory:

- [docs/shadcn-ui.md](docs/shadcn-ui.md) - **Shadcn UI component standards** (CRITICAL: Never create custom UI components when Shadcn provides them) 

## Quick Reference

### Tech Stack Summary

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + Shadcn UI (New York)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Clerk
- **Icons**: Lucide React

### Key Principles

1. **Server-First**: Prefer Server Components over Client Components
2. **Type Safety**: All code must compile with strict TypeScript
3. **Utility-First CSS**: Use Tailwind utilities, not custom CSS
4. **Component Library**: Use Shadcn UI components when available
5. **Server Actions**: Prefer Server Actions over API routes for mutations
6. **Authentication**: Always verify user authentication and ownership

### File Structure Conventions

```
app/                    # Next.js App Router
├── (auth)/            # Auth route group
│   ├── sign-in/
│   └── sign-up/
├── (app)/             # Main app route group
│   ├── dashboard/
│   └── settings/
├── api/               # API routes
├── layout.tsx         # Root layout
└── page.tsx           # Home page

components/            # React components
├── ui/               # Shadcn UI components
└── [feature]/        # Feature-specific components

db/                   # Database
├── schema.ts         # Drizzle schema
└── index.ts          # DB client

lib/                  # Utilities
└── utils.ts          # Helper functions

docs/                 # Documentation
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`, `create-link.ts`)
- **Components**: PascalCase (`UserProfile`, `CreateLinkButton`)
- **Functions**: camelCase (`createLink`, `getUserLinks`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LINKS`, `API_URL`)
- **Types/Interfaces**: PascalCase (`User`, `LinkData`)

### Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { clsx } from 'clsx';

// 3. Internal modules (absolute imports)
import { db } from '@/db';
import { Button } from '@/components/ui/button';
import { createLink } from '@/app/actions/links';

// 4. Relative imports
import { formatDate } from './utils';

// 5. Types
import type { Link } from '@/db/schema';
```

### Component Pattern

```typescript
// Server Component (default)
import { db } from '@/db';
import type { ReactNode } from 'react';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const data = await db.query.links.findFirst();
  return <div>{/* content */}</div>;
}

// Client Component
'use client';

import { useState } from 'react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
  children: ReactNode;
}

export function Component({ title, onClick, children }: ComponentProps) {
  const [state, setState] = useState(false);
  return <div onClick={onClick}>{children}</div>;
}
```

### Database Query Pattern

```typescript
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function getUserLinks() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
  
  return userLinks;
}
```

### Server Action Pattern

```typescript
'use server';

import { db } from '@/db';
import { links } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createLinkSchema = z.object({
  url: z.string().url(),
  shortCode: z.string().min(3).max(20),
});

export async function createLink(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    return { error: 'Unauthorized' };
  }
  
  // Validate input
  const parsed = createLinkSchema.safeParse({
    url: formData.get('url'),
    shortCode: formData.get('shortCode'),
  });
  
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  
  // Database operation
  try {
    const [newLink] = await db
      .insert(links)
      .values({
        ...parsed.data,
        userId,
      })
      .returning();
    
    revalidatePath('/dashboard');
    return { success: true, link: newLink };
  } catch (error) {
    console.error('Create link error:', error);
    return { error: 'Failed to create link' };
  }
}
```

### Styling Pattern

```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';

export function LinkCard({ link }: { link: Link }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{link.shortCode}</span>
          <Button variant="ghost" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">
          {link.originalUrl}
        </p>
      </CardContent>
    </Card>
  );
}
```

## Critical Rules

### ✅ DO

- Use TypeScript strict mode - no `any` types
- Prefer Server Components by default
- Use Server Actions for data mutations
- Always verify user authentication
- Use Drizzle ORM for database queries
- Use Tailwind utilities for styling
- **Always use Shadcn UI components - never create custom UI components**
- Use `cn()` utility for className composition
- Add proper TypeScript types to all functions
- Include error handling in Server Actions
- Validate user input with Zod
- Use path aliases (`@/*`) for imports

### ❌ DON'T

- Don't use Client Components unless needed (interactivity/hooks/browser APIs)
- Don't create API routes when Server Actions can be used
- **Don't create custom UI components when Shadcn UI provides them**
- Don't write custom CSS (use Tailwind)
- Don't use inline styles
- Don't use `any` type
- Don't skip authentication checks
- Don't query database without filtering by userId for user-specific data
- Don't commit environment variables
- Don't use old Pages Router patterns
- Don't use `!` (non-null assertion) without careful consideration

## Environment Variables

Required variables in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npx drizzle-kit generate # Generate migrations
npx drizzle-kit push     # Push schema to database
npx drizzle-kit studio   # Open Drizzle Studio

# Build and Deploy
npm run build            # Production build
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## Testing Checklist

Before submitting code, verify:

- [ ] **Read relevant documentation files in `/docs` directory before starting**
- [ ] TypeScript compiles without errors
- [ ] All routes require authentication where needed
- [ ] Database queries filter by userId for user data
- [ ] Forms validate input (client and server)
- [ ] Error states are handled gracefully
- [ ] Loading states are implemented
- [ ] Responsive design works on mobile
- [ ] Dark mode is supported
- [ ] Accessibility (keyboard navigation, ARIA labels)

## Getting Help

For detailed information on specific topics:
- Project structure → [docs/01-project-overview.md](docs/01-project-overview.md)
- TypeScript patterns → [docs/02-typescript-standards.md](docs/02-typescript-standards.md)
- Next.js usage → [docs/03-nextjs-patterns.md](docs/03-nextjs-patterns.md)
- Database queries → [docs/04-database-drizzle.md](docs/04-database-drizzle.md)
- UI components → [docs/05-ui-styling.md](docs/05-ui-styling.md)
- Authentication → [docs/06-authentication.md](docs/06-authentication.md)
- Auth implementation → [docs/auth.md](docs/auth.md)
- **Shadcn UI standards** → [docs/shadcn-ui.md](docs/shadcn-ui.md)

---

**Note**: These standards must be followed for all code contributions. Consistency is critical for maintainability.
