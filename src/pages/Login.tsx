import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100 mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            OrgPlus <span className="text-indigo-600">Admin</span>
          </h1>
          <p className="text-gray-500 font-medium">Enterprise Organization Management</p>
        </div>

        <Card className="bg-white border-gray-200 shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden mt-8">
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-400 font-medium">
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm font-bold animate-shake">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@orgplus.com"
                      className="pl-11 h-12 bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" title="Password" className="text-sm font-bold text-gray-700 ml-1">
                    Password
                  </Label>
                   <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-11 h-12 bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <div className="bg-gray-50 p-4 border-t border-gray-100">
             <p className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                System Administrator Access Only
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
