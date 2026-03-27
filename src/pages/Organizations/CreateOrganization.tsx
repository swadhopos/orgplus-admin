import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { CreateOrganizationData, ApiResponse, Organization } from '../../types';
import { OrgNicheType } from '../../types/niche';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Layout } from '../../components/Layout';
import { Building2, UserCircle2, MapPin, Globe, Loader2, ArrowLeft, CheckCircle2, XCircle, Info, Settings2, Shield, Activity, Users, User, Building, Palette } from 'lucide-react';

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export const CreateOrganization: React.FC = () => {
  const [formData, setFormData] = useState<CreateOrganizationData>({
    name: '',
    nicheTypeKey: '',
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
    subtype: '',
    adminEmail: '',
    adminPassword: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
  });
  
  const [isCustomSubtype, setIsCustomSubtype] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Configuration state
  const [config, setConfig] = useState<{
    membershipModel: string;
    labels: { groupLabel: string | null; memberLabel: string };
    features: Record<string, boolean>;
    financial: { fiscalYearStartMonth?: number; useCalendarYear?: boolean; paymentType?: string; canIssueTaxExemptions?: boolean; };
  }>({
    membershipModel: '',
    labels: { groupLabel: '', memberLabel: '' },
    features: {},
    financial: {},
  });

  // Fetch Niches
  const { data: niches, isLoading: nichesLoading } = useQuery<OrgNicheType[]>({
    queryKey: ['active-niches'],
    queryFn: () => apiClient.get<OrgNicheType[]>('/admin/niche-types'),
  });

  const activeNiches = niches?.filter(n => n.isActive);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalUnits' ? parseInt(value) || 0 : value,
    });
  };

  const selectedNiche = activeNiches?.find(n => n.key === formData.nicheTypeKey);

  const toggleFeature = (key: string) => {
    // Prevent toggling fixed modules
    if (key === 'hasMembers' || key === 'hasGroups') return;
    
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key]
      }
    }));
  };

  // Sync config when niche or model changes
  React.useEffect(() => {
    if (selectedNiche) {
      // Reset subtype and set primary color from niche suggestions
      setFormData(prev => ({ 
        ...prev, 
        subtype: '',
        primaryColor: selectedNiche.suggestedColors?.[0] || '#2563eb'
      }));
      setIsCustomSubtype(false);
      
      setConfig(prev => {
        const currentModel = prev.membershipModel || selectedNiche.membershipModel;
        const isIndividual = currentModel === 'individual_only';
        
        return {
          ...prev,
          membershipModel: currentModel,
          // Only sync labels from niche if they haven't been edited yet
          labels: prev.labels.memberLabel === '' ? { ...selectedNiche.labels } : prev.labels,
          features: { 
            ...selectedNiche.features, 
            ...prev.features,
            hasMembers: true, // Always required
            hasGroups: !isIndividual, // Dependent on model
          },
          financial: {
            ...selectedNiche.financial,
            ...prev.financial,
          }
        };
      });
    }
  }, [formData.nicheTypeKey, selectedNiche, config.membershipModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nicheTypeKey) {
      setError('Please select an organization type (Niche)');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Merge base data with current config choices
      const payload = {
        ...formData,
        membershipModel: config.membershipModel,
        labels: config.labels,
        features: config.features,
        financial: config.financial,
      };

      await apiClient.post<ApiResponse<Organization>>('/organizations', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/organizations');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const FEATURE_LIST = [
    { key: 'hasMembers', label: 'Members', required: true },
    { key: 'hasGroups', label: 'Groups', required: true },
    { key: 'hasEvents', label: 'Event & Fundraising' },
    { key: 'hasCommittees', label: 'Finance & Committees' },
    { key: 'hasBMD', label: 'BMD (Birth/Marriage/Death)' },
    { key: 'hasSubscriptions', label: 'Fees & Subscription' },
    { key: 'hasNotices', label: 'Notice Board' },
    { key: 'hasLedger', label: 'Ledger & Accounts' },
    { key: 'hasStaff', label: 'Staff Management' },
    { key: 'hasCertificates', label: 'Certificates' },
    { key: 'hasMembership', label: 'Membership' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-6 text-gray-400 hover:text-gray-900 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all h-10 w-10 p-0"
            onClick={() => navigate('/organizations')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Create Organization
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Registers a new organization and generates a snapshot configuration.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-5xl">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold flex items-center shadow-sm">
            <XCircle className="mr-3 h-5 w-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl font-bold flex items-center shadow-sm">
            <CheckCircle2 className="mr-3 h-5 w-5" />
            Organization created successfully! Redirecting...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-10">
            {/* Basic Info */}
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-indigo-50 mr-3 border border-indigo-100">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8 pb-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-gray-700">Organization Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Green Valley Residents Assoc."
                    className="bg-white border-gray-200 text-gray-900 font-medium h-11 focus-visible:ring-indigo-500 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the organization's purpose"
                    className="bg-white border-gray-200 text-gray-900 font-medium min-h-[80px] shadow-sm focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Organization Category *</Label>
                  <Select 
                    value={formData.nicheTypeKey}
                    onValueChange={(val: string) => setFormData({ ...formData, nicheTypeKey: val })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-bold h-11 shadow-sm">
                      <SelectValue placeholder={nichesLoading ? "Loading..." : "Select Type"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl border-t-0 rounded-b-xl">
                      {activeNiches?.map(niche => (
                        <SelectItem key={niche.key} value={niche.key} className="font-medium focus:bg-indigo-50 focus:text-indigo-700">
                          {niche.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedNiche && (
                    <div className="flex items-center text-xs text-indigo-600 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 mt-3 font-bold uppercase tracking-wider">
                      <Info className="mr-2 h-3.5 w-3.5" />
                      Template: {selectedNiche.name}
                    </div>
                  )}
                </div>

                {selectedNiche && selectedNiche.subtypes && (
                  <div className="space-y-4 pt-2">
                    <Label className="text-sm font-bold text-gray-700">Specific Type / Classification *</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedNiche.subtypes.map((st) => (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => {
                            setIsCustomSubtype(false);
                            setFormData(prev => ({ ...prev, subtype: st.label }));
                          }}
                          className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                            !isCustomSubtype && formData.subtype === st.label
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md ring-2 ring-indigo-100"
                              : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                          )}
                        >
                          {st.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSubtype(true);
                          setFormData(prev => ({ ...prev, subtype: '' }));
                        }}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                          isCustomSubtype
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md ring-2 ring-indigo-100"
                            : "bg-white border-gray-200 text-gray-400 hover:border-indigo-300 hover:bg-indigo-50/50"
                        )}
                      >
                        Custom...
                      </button>
                    </div>
                    
                    {isCustomSubtype && (
                      <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Input
                          placeholder="Enter custom subtype (e.g. Sufi Dargah, Youth Hostel...)"
                          value={formData.subtype}
                          onChange={(e) => setFormData(prev => ({ ...prev, subtype: e.target.value }))}
                          className="bg-white border-gray-200 text-gray-900 font-medium h-10 shadow-sm focus-visible:ring-indigo-500"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-sm font-bold text-gray-700">Reg. Number</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedDate" className="text-sm font-bold text-gray-700">Established Date</Label>
                    <Input
                      id="establishedDate"
                      name="establishedDate"
                      type="date"
                      value={formData.establishedDate}
                      onChange={handleChange}
                      className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="totalUnits" className="text-sm font-bold text-gray-700">Scale (Units/Size)</Label>
                    <Input
                      id="totalUnits"
                      name="totalUnits"
                      type="number"
                      value={formData.totalUnits}
                      onChange={handleChange}
                      className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin User */}
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-green-50 mr-3 border border-green-100">
                    <UserCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  System Administrator
                </CardTitle>
                <CardDescription className="text-gray-500 font-medium ml-12">Initial credentials for the organization's root admin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8 pb-8">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-sm font-bold text-gray-700">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={handleChange}
                    className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                    placeholder="admin@organization.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-sm font-bold text-gray-700">Initial Password *</Label>
                  <Input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    required
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-10">
            {/* Branding & Theme */}
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-emerald-50 mr-3 border border-emerald-100">
                    <Palette className="h-5 w-5 text-emerald-600" />
                  </div>
                  Branding & Theme
                </CardTitle>
                <CardDescription className="text-gray-500 font-medium ml-12">
                  Choose a primary identity color for the organization's portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8 pb-8">
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-gray-700">Primary Brand Color</Label>
                  
                  {selectedNiche?.suggestedColors && selectedNiche.suggestedColors.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Popular for {selectedNiche.name}</p>
                      <div className="flex flex-wrap gap-3">
                        {selectedNiche.suggestedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData({ ...formData, primaryColor: color })}
                            className={cn(
                              "w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm",
                              formData.primaryColor === color 
                                ? "border-indigo-600 ring-4 ring-indigo-50" 
                                : "border-white"
                            )}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <div 
                      className="w-12 h-12 rounded-xl border border-gray-200 shadow-inner shrink-0 transition-transform duration-300"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <div className="flex-1 space-y-2">
                       <Input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        placeholder="#HEXCODE"
                        className="bg-white border-gray-200 text-gray-900 font-bold h-11 shadow-sm uppercase"
                      />
                      <p className="text-[10px] text-gray-400 font-medium italic">Enter a hex code for a custom brand color.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formData.primaryColor }} />
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Real-time Preview</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-black text-white uppercase tracking-tighter" style={{ backgroundColor: formData.primaryColor }}>
                      Button Action
                    </div>
                    <div className="h-8 w-8 rounded-lg shadow-sm flex items-center justify-center" style={{ backgroundColor: `${formData.primaryColor}15`, color: formData.primaryColor }}>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="h-8 px-3 rounded-lg border flex items-center justify-center text-[10px] font-black uppercase tracking-tighter" style={{ borderColor: `${formData.primaryColor}30`, color: formData.primaryColor, backgroundColor: `${formData.primaryColor}05` }}>
                      Badge Tint
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Overrides */}
             <Card className="bg-white border-indigo-100 shadow-lg shadow-indigo-50 overflow-hidden ring-1 ring-indigo-50">
              <CardHeader className="bg-indigo-50/30 border-b border-indigo-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center text-indigo-900 font-bold">
                    <div className="p-2 rounded-lg bg-indigo-100/50 mr-3 border border-indigo-200/50">
                      <Settings2 className="h-5 w-5 text-indigo-700" />
                    </div>
                    One-Time Configuration
                  </CardTitle>
                   <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-white px-2 py-1 rounded border border-indigo-100 shadow-sm">
                      <Shield className="h-3 w-3 mr-1" /> Initial Setup Only
                   </div>
                </div>
                <CardDescription className="text-indigo-600/70 font-medium mt-2">
                  Customize the structural model and active features for this specific organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-8 pb-8">
                {/* Membership Model Selection */}
                {selectedNiche && (
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                      <Users className="h-3.5 w-3.5 mr-2" />
                      Membership Strategy
                    </Label>
                    
                    {selectedNiche.membershipModel === 'group_optional' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, membershipModel: 'group_required' }))}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all space-y-2",
                            config.membershipModel === 'group_required'
                              ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm ring-1 ring-indigo-200"
                              : "bg-white border-gray-100 text-gray-400 grayscale hover:grayscale-0 hover:bg-gray-50"
                          )}
                        >
                          <Building className="h-6 w-6" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">Group-Centric</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, membershipModel: 'individual_only' }))}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all space-y-2",
                            config.membershipModel === 'individual_only'
                              ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm ring-1 ring-indigo-200"
                              : "bg-white border-gray-100 text-gray-400 grayscale hover:grayscale-0 hover:bg-gray-50"
                          )}
                        >
                          <User className="h-6 w-6" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">Individual-Only</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wide flex items-center">
                         <div className="p-1.5 rounded bg-white mr-3 border border-gray-200 shadow-sm">
                            <Info className="h-3.5 w-3.5 text-gray-400" />
                         </div>
                         Fixed Template Model: {selectedNiche.membershipModel.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Labels */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                   <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Label</Label>
                    <Input 
                      value={config.labels.memberLabel}
                      onChange={(e) => setConfig(prev => ({ ...prev, labels: { ...prev.labels, memberLabel: e.target.value } }))}
                      className="bg-white border-gray-200 text-gray-900 font-bold text-sm h-10 shadow-sm"
                    />
                  </div>
                  {config.membershipModel !== 'individual_only' && (
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Group Label</Label>
                       <Input 
                        value={config.labels.groupLabel || ''}
                        onChange={(e) => setConfig(prev => ({ ...prev, labels: { ...prev.labels, groupLabel: e.target.value } }))}
                        className="bg-white border-gray-200 text-gray-900 font-bold text-sm h-10 shadow-sm"
                       />
                    </div>
                  )}
                </div>

                {/* Features Grid */}
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <Label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                    <Activity className="h-3.5 w-3.5 mr-2" />
                    Module Enablement
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FEATURE_LIST.map(feature => {
                      const isRequired = (feature as any).required;
                      const isActive = config.features[feature.key];
                      
                      return (
                        <div 
                          key={feature.key}
                          onClick={() => toggleFeature(feature.key)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all",
                            isActive
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                              : "bg-white border-gray-100 text-gray-300 hover:border-gray-200",
                            isRequired && "cursor-not-allowed opacity-80"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-tight leading-none mb-1">{feature.label}</span>
                            {isRequired && <span className="text-[8px] font-black uppercase text-indigo-400">Core</span>}
                          </div>
                          {isActive ? (
                            <CheckCircle2 className={cn("h-4 w-4", isRequired && "text-indigo-400")} />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-100" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fiscal Settings */}
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <Label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                    Receipt Settings
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Year Label Strategy</Label>
                      <Select 
                        value={config.financial?.useCalendarYear ? "calendar" : "fiscal"}
                        onValueChange={(val) => setConfig(prev => ({ 
                          ...prev, 
                          financial: { ...prev.financial, useCalendarYear: val === "calendar" } 
                        }))}
                      >
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-medium h-10 shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fiscal">Fiscal Year (e.g. 2526)</SelectItem>
                          <SelectItem value="calendar">Calendar Year (e.g. 26)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!config.financial?.useCalendarYear && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fiscal Start Month</Label>
                        <Select 
                          value={config.financial?.fiscalYearStartMonth?.toString() || "4"}
                          onValueChange={(val) => setConfig(prev => ({ 
                            ...prev, 
                            financial: { ...prev.financial, fiscalYearStartMonth: parseInt(val) } 
                          }))}
                        >
                          <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-medium h-10 shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="4">April (India standard)</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Address */}
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-orange-50 mr-3 border border-orange-100">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8 pb-8">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-bold text-gray-700">Physical Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-white border-gray-200 text-gray-900 font-medium min-h-[100px] shadow-sm"
                    placeholder="Enter full address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-bold text-gray-700">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-bold text-gray-700">State</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-bold text-gray-700">Pincode</Label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" placeholder="e.g. 682001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-bold text-gray-700">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-blue-50 mr-3 border border-blue-100">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-sm font-bold text-gray-700">Contact Email *</Label>
                    <Input id="contactEmail" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-sm font-bold text-gray-700">Contact Phone *</Label>
                    <Input id="contactPhone" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone" className="text-sm font-bold text-gray-700">Alternate Phone</Label>
                    <Input id="alternatePhone" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-bold text-gray-700">Website URL</Label>
                    <Input id="website" name="website" value={formData.website} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm" placeholder="https://..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-6 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/organizations')} 
            className="border-gray-200 text-gray-600 font-bold px-8 h-12"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold px-10 h-12"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Register Organization'}
          </Button>
        </div>
      </form>
    </Layout>
  );
};


