# Shadcn UI Component Standards

**Version**: 1.0  
**Last Updated**: 2026-02-11

## Overview

This project uses **Shadcn UI (New York variant)** as the exclusive UI component library. All UI elements must use Shadcn UI components - **do not create custom components** when a Shadcn equivalent exists.

## Core Principles

1. **Always use Shadcn UI components** - Never create custom buttons, cards, dialogs, etc.
2. **Component composition** - Combine Shadcn components to build complex UIs
3. **Styling with Tailwind** - Customize components using Tailwind utility classes
4. **Use `cn()` utility** - For conditional className merging

## Available Components

Shadcn UI components are located in `components/ui/`. Common components include:

### Layout & Structure
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Separator`
- `Sheet`, `SheetTrigger`, `SheetContent`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

### Forms & Inputs
- `Button` (variants: default, destructive, outline, secondary, ghost, link)
- `Input`
- `Textarea`
- `Label`
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Checkbox`
- `RadioGroup`, `RadioGroupItem`
- `Switch`

### Feedback & Overlays
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
- `AlertDialog` (for confirmations)
- `Toast` / `Toaster` (for notifications)
- `Alert`, `AlertTitle`, `AlertDescription`
- `Badge`
- `Skeleton` (loading states)

### Data Display
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `Tooltip`, `TooltipTrigger`, `TooltipContent`

### Navigation
- `DropdownMenu` (for user menus, actions)
- `NavigationMenu`
- `Command` (command palette)

## Installation

To add a new Shadcn component:

```bash
npx shadcn@latest add <component-name>
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Usage Patterns

### Basic Component Usage

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Styling with Tailwind

Use the `cn()` utility to merge Tailwind classes with component defaults:

```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CustomButton({ className, ...props }: ButtonProps) {
  return (
    <Button 
      className={cn("w-full", className)} 
      {...props}
    />
  );
}
```

### Form Pattern

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  return (
    <form>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </div>
    </form>
  );
}
```

### Dialog Pattern

```typescript
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CreateLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten.
          </DialogDescription>
        </DialogHeader>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  );
}
```

### Table Pattern

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function LinksTable({ links }: { links: Link[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short Code</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead>Clicks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell>{link.shortCode}</TableCell>
            <TableCell>{link.originalUrl}</TableCell>
            <TableCell>{link.clicks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Critical Rules

### ✅ DO

- **Always use Shadcn UI components** for all UI elements
- Use component variants (e.g., `Button variant="outline"`)
- Import from `@/components/ui/*`
- Use `cn()` for className composition
- Use Lucide React icons with Shadcn components
- Follow Shadcn's composition patterns (e.g., `asChild` prop)
- Add new components with `npx shadcn@latest add`

### ❌ DON'T

- **Never create custom button, card, or dialog components**
- Don't write custom CSS for components that Shadcn provides
- Don't modify Shadcn component source files directly
- Don't use other UI libraries (Material-UI, Ant Design, etc.)
- Don't create wrapper components when Shadcn provides the functionality
- Don't hardcode styles that Tailwind utilities can handle

## Common Variants

### Button Variants
```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Badge Variants
```typescript
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## Icons

Use **Lucide React** icons with Shadcn components:

```typescript
import { Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

<Button size="icon" variant="ghost">
  <Copy className="h-4 w-4" />
</Button>
```

## Accessibility

Shadcn UI components are built with accessibility in mind:

- Use `Label` components for form inputs
- Use `DialogTitle` and `DialogDescription` for dialogs
- Use `asChild` prop to maintain semantic HTML
- Add `aria-label` to icon-only buttons

```typescript
<Button size="icon" variant="ghost" aria-label="Copy link">
  <Copy className="h-4 w-4" />
</Button>
```

## Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Browse Components](https://ui.shadcn.com/docs/components)
- [Lucide Icons](https://lucide.dev/)

---

**Remember**: If Shadcn UI has a component for it, use it. Do not reinvent the wheel.
