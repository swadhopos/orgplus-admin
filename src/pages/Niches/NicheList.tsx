import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Edit2, 
  Power, 
  CheckCircle2, 
  XCircle,
  Layers
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { OrgNicheType } from '../../types/niche';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';

export function NicheList() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: niches, isLoading, error } = useQuery<OrgNicheType[]>({
    queryKey: ['niche-types'],
    queryFn: () => apiClient.get<OrgNicheType[]>('/admin/niche-types'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (key: string) => apiClient.patch<{ isActive: boolean }>(`/admin/niche-types/${key}/status`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['niche-types'] });
    },
  });

  const filteredNiches = niches?.filter(niche => 
    niche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    niche.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Layout><div className="flex items-center justify-center py-20 text-gray-400">Loading Niches...</div></Layout>;
  if (error) return <Layout><div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 font-bold">Error: {(error as Error).message}</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-gray-900 tracking-tight">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4 border border-indigo-100">
              <Layers className="h-6 w-6 text-indigo-600" />
            </div>
            Org Niche Types
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage dynamic presets and feature toggles for different organization types.</p>
        </div>
        <Link to="/niches/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">
            <Plus className="mr-2 h-4 w-4" />
            Create Niche Type
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or key..."
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Name</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Model</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Groups</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest">Status</TableHead>
                <TableHead className="text-gray-600 font-bold px-6 py-4 uppercase text-[11px] tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNiches?.length === 0 ? (
                <TableRow className="border-gray-100">
                  <TableCell colSpan={5} className="h-32 text-center text-gray-400 font-medium">
                    No niche types found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNiches?.map((niche) => (
                  <TableRow key={niche._id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-900">{niche.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-medium">{niche.key}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider border border-gray-200">
                        {niche.membershipModel.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500 font-medium italic">
                      {niche.labels.groupLabel || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {niche.isActive ? (
                        <span className="flex items-center text-green-600 text-xs font-bold px-2 py-1 rounded-full bg-green-50 border border-green-100 w-fit">
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-400 text-xs font-bold px-2 py-1 rounded-full bg-gray-50 border border-gray-100 w-fit">
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/niches/${niche.key}`}>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100">
                            <Edit2 className="h-4.5 w-4.5" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            "h-9 w-9 p-0 border border-transparent transition-all",
                            niche.isActive 
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100" 
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50 hover:border-green-100"
                          )}
                          onClick={() => toggleStatusMutation.mutate(niche.key)}
                        >
                          <Power className="h-4.5 w-4.5" />
                        </Button>
                      </div>
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
