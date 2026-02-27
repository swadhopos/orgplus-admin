import React from 'react';
import { Organization } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreateAdminDialog } from './CreateAdminDialog';

interface OrganizationListProps {
  organizations: Organization[];
  onViewOrganization: (orgId: string) => void;
  onRefresh?: () => void;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onViewOrganization,
  onRefresh,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org._id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell className="text-muted-foreground">{org.address}</TableCell>
            <TableCell className="text-muted-foreground">{org.contactEmail}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  org.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : org.status === 'inactive'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {org.status}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(org.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewOrganization(org._id)}
              >
                View
              </Button>
              <CreateAdminDialog
                organizationId={org._id}
                organizationName={org.name}
                onSuccess={onRefresh}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
