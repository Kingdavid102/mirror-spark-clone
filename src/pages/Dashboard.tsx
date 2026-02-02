import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useStockPrices } from '@/hooks/useStockPrices';
import { supabase } from '@/integrations/supabase/client';
import AuthenticatedHeader from '@/components/investment/AuthenticatedHeader';
import InvestmentFooter from '@/components/investment/InvestmentFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  User, Package, TrendingUp, Settings, ChevronRight, 
  Car, Clock, CheckCircle, XCircle, Loader2, Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  configuration: Record<string, unknown>;
  vehicles: {
    name: string;
    model: string;
    year: number;
    image_url: string | null;
  };
}

interface PortfolioItem {
  id: string;
  symbol: string;
  shares: number;
  avg_cost: number;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  region: string | null;
  language: string | null;
  get_updates: boolean | null;
}

const regions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'eu', label: 'European Union' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
];

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getStock } = useStockPrices(3000);
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [getUpdates, setGetUpdates] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch orders, portfolio, and profile in parallel
    const [ordersResult, portfolioResult, profileResult] = await Promise.all([
      supabase
        .from('vehicle_orders')
        .select(`
          id, status, total_price, created_at, configuration,
          vehicles (name, model, year, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ]);

    if (ordersResult.data) {
      setOrders(ordersResult.data as unknown as Order[]);
    }
    if (portfolioResult.data) {
      setPortfolio(portfolioResult.data);
    }
    if (profileResult.data) {
      const p = profileResult.data as Profile;
      setProfile(p);
      setFirstName(p.first_name || '');
      setLastName(p.last_name || '');
      setRegion(p.region || '');
      setLanguage(p.language || 'en-US');
      setGetUpdates(p.get_updates ?? true);
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        region,
        language,
        get_updates: getUpdates,
      })
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Your profile has been updated' });
    }
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const stock = getStock(item.symbol);
      return total + ((stock?.price || item.avg_cost) * item.shares);
    }, 0);
  };

  const calculatePortfolioGain = () => {
    return portfolio.reduce((total, item) => {
      const stock = getStock(item.symbol);
      const currentValue = (stock?.price || item.avg_cost) * item.shares;
      const costBasis = item.avg_cost * item.shares;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Order Received',
      processing: 'Processing',
      completed: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tesla-blue" />
      </div>
    );
  }

  const portfolioValue = calculatePortfolioValue();
  const portfolioGain = calculatePortfolioGain();

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {firstName || user?.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">
            Manage your Tesla vehicles, investments, and account settings
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Car className="w-5 h-5 text-tesla-blue" />
                  <span className="text-sm text-muted-foreground">Vehicle Orders</span>
                </div>
                <p className="text-3xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Portfolio Value</span>
                </div>
                <p className="text-3xl font-bold">
                  ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className={`w-5 h-5 ${portfolioGain >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
                </div>
                <p className={`text-3xl font-bold ${portfolioGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioGain >= 0 ? '+' : ''}${portfolioGain.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button onClick={() => navigate('/')}>Browse Inventory</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                          <img 
                            src={order.vehicles?.image_url || '/placeholder.svg'} 
                            alt={order.vehicles?.name || 'Vehicle'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{order.vehicles?.year} {order.vehicles?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${order.total_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm">{getStatusLabel(order.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center gap-2"
                onClick={() => navigate('/')}
              >
                <Car className="w-6 h-6" />
                <span>Browse Vehicles</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center gap-2"
                onClick={() => setActiveTab('portfolio')}
              >
                <TrendingUp className="w-6 h-6" />
                <span>View Portfolio</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center gap-2"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-6 h-6" />
                <span>Account Settings</span>
              </Button>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Your Vehicle Orders</h2>
                <p className="text-sm text-muted-foreground">Track and manage your Tesla orders</p>
              </div>
              
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your Tesla journey by ordering your dream vehicle
                  </p>
                  <Button onClick={() => navigate('/')}>Browse Inventory</Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-24 h-18 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={order.vehicles?.image_url || '/placeholder.svg'} 
                              alt={order.vehicles?.name || 'Vehicle'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {order.vehicles?.year} {order.vehicles?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">{getStatusLabel(order.status)}</span>
                          </div>
                          <p className="text-lg font-bold">
                            ${order.total_price.toLocaleString()}
                          </p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                <p className="text-3xl font-bold">
                  ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Gain/Loss</p>
                <p className={`text-3xl font-bold ${portfolioGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioGain >= 0 ? '+' : ''}${portfolioGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-1">Positions</p>
                <p className="text-3xl font-bold">{portfolio.length}</p>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Your Holdings</h2>
                  <p className="text-sm text-muted-foreground">Track your stock positions in real-time</p>
                </div>
                <Button onClick={() => navigate('/')}>
                  Add Position
                </Button>
              </div>
              
              {portfolio.length === 0 ? (
                <div className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Positions Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your portfolio by adding stock positions
                  </p>
                  <Button onClick={() => navigate('/')}>View Stock Markets</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Symbol</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Shares</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Avg Cost</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Current Price</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Market Value</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Gain/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((item) => {
                        const stock = getStock(item.symbol);
                        const currentPrice = stock?.price || item.avg_cost;
                        const marketValue = currentPrice * item.shares;
                        const costBasis = item.avg_cost * item.shares;
                        const gain = marketValue - costBasis;
                        const gainPercent = ((currentPrice - item.avg_cost) / item.avg_cost) * 100;

                        return (
                          <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                            <td className="p-4 font-medium">{item.symbol}</td>
                            <td className="p-4 text-right tabular-nums">{item.shares.toLocaleString()}</td>
                            <td className="p-4 text-right tabular-nums">${item.avg_cost.toFixed(2)}</td>
                            <td className="p-4 text-right tabular-nums">${currentPrice.toFixed(2)}</td>
                            <td className="p-4 text-right tabular-nums font-medium">
                              ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className={`p-4 text-right tabular-nums ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Account Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-muted border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-muted border-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted border-none opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                {/* Regional Preferences */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="font-medium">Regional Preferences</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="bg-muted border-none">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="bg-muted border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((l) => (
                            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="font-medium">Notifications</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Tesla Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about Tesla products, services, and events
                      </p>
                    </div>
                    <Switch
                      checked={getUpdates}
                      onCheckedChange={setGetUpdates}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-border flex justify-end gap-4">
                  <Button variant="outline" onClick={fetchData}>Cancel</Button>
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-border space-y-4">
                  <h3 className="font-medium text-red-500">Danger Zone</h3>
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                    <div>
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                    </div>
                    <Button variant="outline" onClick={signOut} className="text-red-500 border-red-500 hover:bg-red-50">
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <InvestmentFooter />
    </div>
  );
};

export default Dashboard;
