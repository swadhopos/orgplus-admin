# shadcn/ui Setup Guide

This document describes the shadcn/ui setup for the orgplus-admin application.

## Overview

The orgplus-admin application uses shadcn/ui components for a consistent, accessible, and customizable UI. All components are configured to work with dark mode by default, with the ability to toggle to light mode.

## Installed Components

The following shadcn/ui components are installed and ready to use:

### Core Components
- **Button** - `@/components/ui/button`
- **Input** - `@/components/ui/input`
- **Label** - `@/components/ui/label`
- **Textarea** - `@/components/ui/textarea`

### Layout Components
- **Card** - `@/components/ui/card`
  - Includes: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Data Display
- **Table** - `@/components/ui/table`
  - Includes: Table, TableHeader, TableBody, TableHead, TableRow, TableCell

### Overlay Components
- **Dialog** - `@/components/ui/dialog`
  - Includes: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter

### Form Components
- **Form** - `@/components/ui/form`
  - Includes: Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
  - Integrates with react-hook-form and zod for validation
- **Select** - `@/components/ui/select`
  - Includes: Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel

## Configuration

### components.json

The `components.json` file configures shadcn/ui for this project:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Theme Configuration

The application uses CSS variables for theming, defined in `src/index.css`:

- Light mode variables (`:root`)
- Dark mode variables (`.dark`)

The theme can be toggled using the ThemeContext and ThemeToggle component.

## Usage Examples

### Using the Table Component

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Using the Card Component

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

<Card>
  <CardHeader>
    <CardTitle>Organization Name</CardTitle>
    <CardDescription>Organization details</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Using the Form Component with react-hook-form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
});

type FormValues = z.infer<typeof formSchema>;

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Using the Dialog Component

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Using the Select Component

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select onValueChange={(value) => console.log(value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

## Example Components

The following example components demonstrate proper usage of shadcn/ui components:

### OrganizationList
Location: `src/components/organizations/OrganizationList.tsx`

Demonstrates:
- Table component for displaying organization data
- Button component for actions
- Integration with CreateAdminDialog

### OrganizationCard
Location: `src/components/organizations/OrganizationCard.tsx`

Demonstrates:
- Card component with all sub-components
- Status badges with conditional styling
- Button integration

### OrganizationForm
Location: `src/components/organizations/OrganizationForm.tsx`

Demonstrates:
- Form component with react-hook-form
- Zod schema validation
- FormField, FormItem, FormLabel, FormControl, FormMessage
- Input, Textarea, and Select components
- Form sections and layout

### AdminForm
Location: `src/components/organizations/AdminForm.tsx`

Demonstrates:
- Simple form with validation
- Form component integration
- FormDescription for helper text

### CreateAdminDialog
Location: `src/components/organizations/CreateAdminDialog.tsx`

Demonstrates:
- Dialog component for modal interactions
- Form submission within a dialog
- Success and error states

## Adding New Components

To add new shadcn/ui components:

1. Visit https://ui.shadcn.com/docs/components
2. Find the component you need
3. Copy the component code
4. Create a new file in `src/components/ui/`
5. Paste the component code
6. Import and use in your application

Note: Some components may require additional Radix UI dependencies. Install them with:

```bash
npm install @radix-ui/react-[component-name] --legacy-peer-deps
```

## Styling

All components use Tailwind CSS classes and CSS variables for theming. To customize:

1. Modify CSS variables in `src/index.css`
2. Update `tailwind.config.js` for additional customization
3. Use the `cn()` utility from `@/lib/utils` to merge class names

## Dark Mode

The application defaults to dark mode. The theme can be toggled using:

- ThemeContext: `src/contexts/ThemeContext.tsx`
- ThemeToggle component: `src/components/layout/ThemeToggle.tsx`

The theme preference is persisted to localStorage.

## Troubleshooting

### CSS Variable Errors

If you see errors about CSS variables (e.g., `border-border`), ensure:

1. `src/index.css` contains all required CSS variables
2. The `@layer base` section includes the `:root` and `.dark` selectors
3. Tailwind CSS is properly configured in `tailwind.config.js`

### Import Errors

If you see import errors:

1. Verify the component file exists in `src/components/ui/`
2. Check that path aliases are configured in `tsconfig.json` and `vite.config.ts`
3. Ensure all required dependencies are installed

### Build Errors

If the build fails:

1. Run `npm run build` to see TypeScript errors
2. Check for unused imports or variables
3. Verify all component props are correctly typed

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [react-hook-form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
