import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';

interface CreateAdminDialogProps {
  organizationId: string;
  organizationName: string;
  onSuccess?: () => void;
}

export const CreateAdminDialog: React.FC<CreateAdminDialogProps> = ({
  organizationId,
  organizationName,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post(`/organizations/${organizationId}/admins`, {
        email,
      });
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setEmail('');
        setSuccess(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Create Admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization Admin</DialogTitle>
          <DialogDescription>
            Create a new admin user for {organizationName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="text-sm text-destructive border border-destructive rounded-md p-3">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600 dark:text-green-400 border border-green-500 rounded-md p-3">
                Admin created successfully!
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                A temporary password will be sent to this email
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
