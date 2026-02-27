import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { CreateOrganizationData, ApiResponse, Organization } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const CreateOrganization: React.FC = () => {
  const [formData, setFormData] = useState<CreateOrganizationData>({
    name: '',
    type: 'housing_society',
    registrationNumber: '',
    establishedDate: '',
    totalUnits: 0,
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    contactEmail: '',
    contactPhone: '',
    alternatePhone: '',
    website: '',
    description: '',
    status: 'active',
    adminEmail: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post<ApiResponse<Organization>>('/organizations', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="mr-4"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">Create Organization</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Organization</CardTitle>
            <CardDescription>Create a new organization and its admin user</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Card className="mb-4 border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {success && (
              <Card className="mb-4 border-green-500">
                <CardContent className="pt-6">
                  <p className="text-green-600 dark:text-green-400">Organization created successfully! Redirecting...</p>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Acme Housing Society"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Organization Type *</Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="housing_society">Housing Society</option>
                      <option value="apartment_complex">Apartment Complex</option>
                      <option value="gated_community">Gated Community</option>
                      <option value="cooperative_society">Cooperative Society</option>
                      <option value="church">Church</option>
                      <option value="mahallu">Mahallu</option>
                      <option value="temple">Temple</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="REG/2024/001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishedDate">Established Date</Label>
                    <Input
                      type="date"
                      id="establishedDate"
                      name="establishedDate"
                      value={formData.establishedDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalUnits">Total Units/Flats</Label>
                    <Input
                      type="number"
                      id="totalUnits"
                      name="totalUnits"
                      min="0"
                      value={formData.totalUnits}
                      onChange={handleChange}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the organization..."
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium border-b pb-2">Address Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Sector 5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Bangalore"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Karnataka"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="560001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      required
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      type="tel"
                      id="alternatePhone"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      placeholder="+91 9876543211"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Admin User Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Organization Admin</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <Input
                      type="email"
                      id="adminEmail"
                      name="adminEmail"
                      required
                      value={formData.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@example.com"
                    />
                    <p className="text-sm text-muted-foreground">
                      This email will be used to create the organization admin account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password *</Label>
                    <Input
                      type="password"
                      id="adminPassword"
                      name="adminPassword"
                      required
                      minLength={8}
                      value={formData.adminPassword}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                    />
                    <p className="text-sm text-muted-foreground">
                      Admin can change this password after first login
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
