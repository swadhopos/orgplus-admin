import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Organization, ApiResponse } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Building2, 
  Layers, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck,
  Activity,
  UserCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const { data: orgsData, isLoading: orgsLoading } = useQuery<ApiResponse<Organization[]>>({
    queryKey: ['organizations-summary'],
    queryFn: () => apiClient.get<ApiResponse<Organization[]>>('/organizations'),
  });

  const { data: niches, isLoading: nichesLoading } = useQuery({
    queryKey: ['niches-summary'],
    queryFn: () => apiClient.get<any[]>('/admin/niche-types'),
  });

  const stats = [
    { 
      name: 'Total Organizations', 
      value: orgsData?.data?.length || 0, 
      icon: Building2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/organizations'
    },
    { 
      name: 'Active Niches', 
      value: niches?.filter((n: any) => n.isActive).length || 0, 
      icon: Layers, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/niches'
    },
    { 
      name: 'System Status', 
      value: 'Healthy', 
      icon: ShieldCheck, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '#'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-gray-900 tracking-tight">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4 border border-indigo-100">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            {getGreeting()}, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back to the OrgPlus Super Admin portal. System metrics are synchronized.</p>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-semibold tracking-tight text-gray-900">{user?.email?.split('@')[0]}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 opacity-70">Super Admin</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group hover:bg-indigo-100 transition-all duration-300 shadow-sm">
            <UserCircle className="h-7 w-7 text-indigo-600 opacity-80 group-hover:opacity-100 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.name}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {orgsLoading || nichesLoading ? '...' : stat.value}
              </div>
              <Link to={stat.href} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-4 flex items-center transition-colors">
                View Details <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-500">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-28 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex flex-col items-center justify-center space-y-3 text-gray-700 transition-all group"
              onClick={() => navigate('/organizations/new')}
            >
              <div className="p-3 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                <PlusCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-semibold">New Organization</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-28 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex flex-col items-center justify-center space-y-3 text-gray-700 transition-all group"
              onClick={() => navigate('/niches/new')}
            >
               <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                <PlusCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="font-semibold">Create Niche Type</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Organizations */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <CardTitle className="text-gray-900">Recent Organizations</CardTitle>
              <CardDescription className="text-gray-500">Latest registrations</CardDescription>
            </div>
            <Link to="/organizations">
              <Button variant="ghost" size="sm" className="text-indigo-600 font-semibold hover:bg-indigo-50">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {orgsLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : orgsData?.data?.slice(0, 5).map((org) => (
                <div key={org._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-colors group">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center mr-4 group-hover:border-indigo-200">
                      <Building2 className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{org.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">{new Date(org.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {orgsData?.data?.length === 0 && (
                <p className="text-sm text-center text-gray-500 py-8">No organizations yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
