import React from 'react';
import { Organization } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateAdminDialog } from './CreateAdminDialog';

interface OrganizationCardProps {
  organization: Organization;
  onView: () => void;
  onRefresh?: () => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onView,
  onRefresh,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{organization.name}</CardTitle>
            <CardDescription>{organization.address}</CardDescription>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              organization.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : organization.status === 'inactive'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {organization.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Contact Email:</span>{' '}
            <span className="text-muted-foreground">{organization.contactEmail}</span>
          </div>
          <div>
            <span className="font-medium">Contact Phone:</span>{' '}
            <span className="text-muted-foreground">{organization.contactPhone}</span>
          </div>
          <div>
            <span className="font-medium">Created:</span>{' '}
            <span className="text-muted-foreground">
              {new Date(organization.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onView}>
          View Details
        </Button>
        <CreateAdminDialog
          organizationId={organization._id}
          organizationName={organization.name}
          onSuccess={onRefresh}
        />
      </CardFooter>
    </Card>
  );
};
