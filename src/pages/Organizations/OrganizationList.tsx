import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Building2, 
  MapPin,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { Organization, ApiResponse } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';

export function OrganizationList() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery<ApiResponse<Organization[]>>({
    queryKey: ['organizations'],
    queryFn: () => apiClient.get<ApiResponse<Organization[]>>('/organizations'),
  });

  const organizations = data?.data || [];

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Layout><div className="flex items-center justify-center py-20 text-gray-400 font-medium">Loading Organizations...</div></Layout>;
  if (error) return <Layout><div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 font-bold">Error: {(error as Error).message}</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-gray-900 tracking-tight">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4 border border-indigo-100">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            Organizations
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage all registered organizations and their configurations.</p>
        </div>
        <Link to="/organizations/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 font-semibold px-6">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or city..."
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-500 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Organization</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Niche</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Location</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Status</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.length === 0 ? (
                <TableRow className="border-gray-100">
                  <TableCell colSpan={5} className="h-32 text-center text-gray-400 font-medium">
                    No organizations found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org._id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4">
                          <Building2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 leading-none">{org.name}</div>
                          {org.subtype && (
                            <div className="inline-block px-1.5 py-0.5 rounded bg-gray-100 text-[9px] font-black text-gray-500 uppercase tracking-wider mt-1 border border-gray-200/50">
                              {org.subtype}
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tight opacity-60">ID: {org._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                        {org.nicheTypeKey || 'Legacy'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center text-gray-600 font-medium text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-gray-300" />
                        {org.city || 'N/A'}{org.state ? `, ${org.state}` : ''}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      {org.status === 'active' ? (
                        <span className="flex items-center text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 border border-green-100 w-fit uppercase tracking-tight">
                          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 border border-red-100 w-fit uppercase tracking-tight">
                          <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                          {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                       <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-gray-900 hover:bg-white hover:border-gray-200 border border-transparent shadow-none hover:shadow-sm transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
