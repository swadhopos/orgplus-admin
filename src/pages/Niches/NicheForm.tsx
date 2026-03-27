import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Save, 
  Info,
  CheckCircle2,
  XCircle,
  Settings2,
  ListTodo
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { OrgNicheType, MembershipModel, PaymentType } from '../../types/niche';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Layout } from '../../components/Layout';

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

export function NicheForm() {
  const { key } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!key;

  const [formData, setFormData] = useState<Partial<OrgNicheType>>({
    name: '',
    key: '',
    description: '',
    membershipModel: 'group_required',
    labels: { groupLabel: 'Family', memberLabel: 'Member' },
    features: {
      hasMembers: true,
      hasGroups: true,
      hasEvents: false,
      hasCommittees: true,
      hasBMD: false,
      hasSubscriptions: false,
      hasNotices: true,
      hasLedger: true,
      hasStaff: true,
      hasCertificates: false,
      hasMembership: false,
    },
    financial: {
      paymentType: 'Voluntary_AdHoc',
      canIssueTaxExemptions: false,
      fiscalYearStartMonth: 4,
      useCalendarYear: false,
    },
    isActive: true,
  });

  const { data: nicheData, isLoading } = useQuery({
    queryKey: ['niche-type', key],
    queryFn: () => apiClient.get<OrgNicheType>(`/admin/niche-types/${key}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (nicheData) {
      setFormData(nicheData);
    }
  }, [nicheData]);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<OrgNicheType>) => {
      if (isEdit) {
        return apiClient.put(`/admin/niche-types/${key}`, data);
      }
      return apiClient.post('/admin/niche-types', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['niche-types'] });
      navigate('/niches');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const toggleFeature = (featureKey: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features!,
        [featureKey]: !prev.features?.[featureKey as keyof typeof prev.features]
      }
    }));
  };

  if (isEdit && isLoading) return <Layout><div className="flex items-center justify-center py-20 text-gray-400">Loading Niche Data...</div></Layout>;

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            <Button 
              type="button" 
              variant="ghost" 
              className="mr-6 text-gray-400 hover:text-gray-900 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all h-10 w-10 p-0"
              onClick={() => navigate('/niches')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {isEdit ? `Edit ${nicheData?.name}` : 'Create New Niche Type'}
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                {isEdit ? 'Update labels and feature toggles for this preset.' : 'Define a new organization structure and feature set.'}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
              onClick={() => navigate('/niches')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 font-semibold"
              disabled={saveMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Niche Type'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-indigo-50 mr-3 border border-indigo-100">
                    <Info className="h-5 w-5 text-indigo-600" />
                  </div>
                  Basic Information
                </CardTitle>
                <CardDescription className="text-gray-500 font-medium ml-12">Identify and describe this organization type for the system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-gray-700">Display Name</Label>
                    <Input 
                      id="name"
                      placeholder="e.g. Shop Owners Association"
                      className="bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-500 font-medium h-11"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key" className="text-sm font-bold text-gray-700">System Key (Slug)</Label>
                    <Input 
                      id="key"
                      placeholder="e.g. shop_assoc"
                      className="bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-500 font-medium h-11"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      disabled={isEdit}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Briefly explain what organizations this niche is meant for..."
                    className="bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-indigo-500 font-medium min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center text-gray-900 font-bold">
                  <div className="p-2 rounded-lg bg-indigo-50 mr-3 border border-indigo-100">
                    <ListTodo className="h-5 w-5 text-indigo-600" />
                  </div>
                  Feature Toggles
                </CardTitle>
                <CardDescription className="text-gray-500 font-medium ml-12">Select which modules will be enabled for this organization type by default.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {FEATURE_LIST.map((feature) => {
                    const isEnabled = formData.features?.[feature.key as keyof typeof formData.features];
                    return (
                      <div 
                        key={feature.key}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all h-14 shadow-sm",
                          isEnabled 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-900 ring-1 ring-indigo-100" 
                            : "bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                        )}
                        onClick={() => toggleFeature(feature.key)}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider">{feature.label}</span>
                        {isEnabled ? (
                          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-200" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Sidebar */}
          <div className="space-y-10">
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center text-gray-900 font-bold text-lg">
                  <div className="p-2 rounded-lg bg-indigo-50 mr-3 border border-indigo-100">
                    <Settings2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  Structure & Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-8 pb-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Membership Model</Label>
                  <Select 
                    value={formData.membershipModel}
                    onValueChange={(val: MembershipModel) => setFormData({ ...formData, membershipModel: val })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-bold h-11 focus:ring-indigo-500 shadow-sm">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl border-t-0 rounded-b-xl">
                      <SelectItem value="group_required" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Group Required (Mandatory)</SelectItem>
                      <SelectItem value="group_optional" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Group Optional (Hybrid)</SelectItem>
                      <SelectItem value="individual_only" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Individual Only (Flat)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="space-y-3">
                    <Label htmlFor="memberLabel" className="text-xs font-bold text-gray-600 uppercase tracking-widest">Member Label</Label>
                    <Input 
                      id="memberLabel"
                      className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                      value={formData.labels?.memberLabel}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        labels: { ...formData.labels!, memberLabel: e.target.value } 
                      })}
                      required
                    />
                  </div>
                  
                  {formData.membershipModel !== 'individual_only' && (
                    <div className="space-y-3">
                      <Label htmlFor="groupLabel" className="text-xs font-bold text-gray-600 uppercase tracking-widest">Group Label</Label>
                      <Input 
                        id="groupLabel"
                        className="bg-white border-gray-200 text-gray-900 font-medium h-11 shadow-sm"
                        value={formData.labels?.groupLabel || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          labels: { ...formData.labels!, groupLabel: e.target.value } 
                        })}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-6 pt-8 border-t border-gray-100">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Payment Strategy</Label>
                    <Select 
                      value={formData.financial?.paymentType}
                      onValueChange={(val: PaymentType) => setFormData({ 
                        ...formData, 
                        financial: { ...formData.financial!, paymentType: val } 
                      })}
                    >
                      <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-bold h-11 focus:ring-indigo-500 shadow-sm">
                        <SelectValue placeholder="Payment Mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl border-t-0 rounded-b-xl">
                        <SelectItem value="Voluntary_AdHoc" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Voluntary / One-off</SelectItem>
                        <SelectItem value="Mandatory_Recurring" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Mandatory / Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Receipt Year Label</Label>
                    <Select 
                      value={formData.financial?.useCalendarYear ? "calendar" : "fiscal"}
                      onValueChange={(val) => setFormData({ 
                        ...formData, 
                        financial: { ...formData.financial!, paymentType: formData.financial?.paymentType || 'Voluntary_AdHoc', canIssueTaxExemptions: formData.financial?.canIssueTaxExemptions || false, useCalendarYear: val === "calendar" } 
                      })}
                    >
                      <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-bold h-11 focus:ring-indigo-500 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl border-t-0 rounded-b-xl">
                        <SelectItem value="fiscal" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Fiscal Year (e.g., 2526)</SelectItem>
                        <SelectItem value="calendar" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">Calendar Year (e.g., 26)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {!formData.financial?.useCalendarYear && (
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Fiscal Start Month</Label>
                      <Select 
                        value={formData.financial?.fiscalYearStartMonth?.toString() || "4"}
                        onValueChange={(val) => setFormData({ 
                          ...formData, 
                          financial: { ...formData.financial!, paymentType: formData.financial?.paymentType || 'Voluntary_AdHoc', canIssueTaxExemptions: formData.financial?.canIssueTaxExemptions || false, fiscalYearStartMonth: parseInt(val) } 
                        })}
                      >
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900 font-bold h-11 focus:ring-indigo-500 shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-xl border-t-0 rounded-b-xl">
                          <SelectItem value="1" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">January</SelectItem>
                          <SelectItem value="4" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">April</SelectItem>
                          <SelectItem value="7" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">July</SelectItem>
                          <SelectItem value="10" className="font-medium focus:bg-indigo-50 focus:text-indigo-700">October</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Layout>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
