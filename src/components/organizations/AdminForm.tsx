import React from 'react';
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

const adminFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

interface AdminFormProps {
  organizationName: string;
  onSubmit: (email: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  organizationName,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: AdminFormValues) => {
    await onSubmit(values.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Create a new admin user for <span className="font-medium">{organizationName}</span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormDescription>
                A temporary password will be sent to this email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4 pt-4">
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Admin'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
