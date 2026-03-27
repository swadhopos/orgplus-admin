import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Layers, 
  LogOut, 
  PlusCircle, 
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Organizations', href: '/organizations', icon: Building2 },
    { name: 'Niche Types', href: '/niches', icon: Layers },
    { name: 'Create Organization', href: '/organizations/new', icon: PlusCircle },
  ];

  return (
    <div className={cn("pb-12 h-screen border-r bg-white border-gray-200 text-gray-900 w-64", className)}>
      <div className="space-y-4 py-6">
        <div className="px-6 py-2">
          <h2 className="mb-4 px-2 text-xl font-bold tracking-tight text-gray-900 flex items-center">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-200">
               <Settings className="h-5 w-5 text-white" />
            </div>
            OrgPlus Admin
          </h2>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 w-full px-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
