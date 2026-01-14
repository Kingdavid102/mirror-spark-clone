import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import modelXInventory from "@/assets/model-x-inventory.jpg";
import model3Inventory from "@/assets/model-3-inventory.jpg";
import modelXPlaidInventory from "@/assets/model-x-plaid-inventory.jpg";

interface Vehicle {
  id: string;
  name: string;
  year: number;
  model: string;
  range_mi: number;
  acceleration_0_60: number;
  top_speed_mph: number;
  price: number;
  image_url: string | null;
  status: string;
  featured: boolean;
  description: string | null;
}

const vehicleImages: Record<string, string> = {
  'Model X': modelXInventory,
  'Model X Plaid': modelXPlaidInventory,
  'Model 3': model3Inventory,
  'Model S': modelXInventory,
  'Model S Plaid': modelXPlaidInventory,
  'Model Y': model3Inventory,
  'Cybertruck': modelXInventory,
  'Roadster': modelXPlaidInventory,
};

const EnhancedInventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  
  // Filters
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterMake, setFilterMake] = useState('all');
  const [filterModel, setFilterModel] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filterAvailable && v.status !== 'available') return false;
    if (filterFeatured && !v.featured) return false;
    if (filterModel !== 'all' && v.model !== filterModel) return false;
    if (filterYear !== 'all' && v.year.toString() !== filterYear) return false;
    if (filterPrice !== 'all') {
      if (filterPrice === 'under50k' && v.price >= 50000) return false;
      if (filterPrice === '50k-100k' && (v.price < 50000 || v.price >= 100000)) return false;
      if (filterPrice === 'over100k' && v.price < 100000) return false;
    }
    return true;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'newest') return b.year - a.year;
    if (sortBy === 'oldest') return a.year - b.year;
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  const uniqueModels = [...new Set(vehicles.map(v => v.model))];
  const uniqueYears = [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a);

  const handleOrder = async (vehicle: Vehicle) => {
    if (!user) {
      toast({ 
        title: 'Sign in required', 
        description: 'Please sign in to place an order',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    
    setSelectedVehicle(vehicle);
    setOrderDialogOpen(true);
  };

  const confirmOrder = async () => {
    if (!selectedVehicle || !user) return;

    const { error } = await supabase
      .from('vehicle_orders')
      .insert({
        user_id: user.id,
        vehicle_id: selectedVehicle.id,
        total_price: selectedVehicle.price,
        status: 'pending',
        configuration: {},
      });

    if (error) {
      toast({ title: 'Order failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Order placed!', description: `Your ${selectedVehicle.name} order has been submitted.` });
      setOrderDialogOpen(false);
    }
  };

  const resetFilters = () => {
    setFilterAvailable(false);
    setFilterFeatured(false);
    setFilterMake('all');
    setFilterModel('all');
    setFilterYear('all');
    setFilterPrice('all');
    setSortBy('newest');
  };

  const getVehicleImage = (vehicle: Vehicle) => {
    return vehicle.image_url || vehicleImages[vehicle.model] || modelXInventory;
  };

  if (loading) {
    return (
      <section className="bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="bg-[#1a1a1a] rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-4xl font-bold mb-2">Browse Inventory</h2>
          <p className="text-gray-400">Explore premium electric vehicles ready for immediate delivery.</p>
        </div>

        {/* Filters Toggle */}
        <div 
          className="border border-border rounded-xl p-4 mb-6 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters & Sort</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="border border-border rounded-xl p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">Quick Filters</div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="available" 
                    checked={filterAvailable}
                    onCheckedChange={(c) => setFilterAvailable(c as boolean)}
                  />
                  <label htmlFor="available" className="text-sm">Available Only</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="featured" 
                    checked={filterFeatured}
                    onCheckedChange={(c) => setFilterFeatured(c as boolean)}
                  />
                  <label htmlFor="featured" className="text-sm">Featured Vehicles</label>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Make</label>
                  <Select value={filterMake} onValueChange={setFilterMake}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Makes</SelectItem>
                      <SelectItem value="tesla">Tesla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Model</label>
                  <Select value={filterModel} onValueChange={setFilterModel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {uniqueModels.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={filterPrice} onValueChange={setFilterPrice}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="over100k">Over $100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                    <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                  Apply Filters
                </Button>
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  Reset All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">Available Vehicles</h3>
            <p className="text-sm text-muted-foreground">
              Showing 1 - {sortedVehicles.length} of {sortedVehicles.length} vehicles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-muted' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-muted' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {sortedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={getVehicleImage(vehicle)}
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {vehicle.status === 'sold_out' && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Sold Out
                  </span>
                )}
                {vehicle.status === 'coming_soon' && (
                  <span className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {vehicle.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {vehicle.year} {vehicle.name}
                </p>

                {/* Specs */}
                <div className="flex gap-6 mb-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{vehicle.range_mi}mi</p>
                    <p className="text-muted-foreground text-xs">Range</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.acceleration_0_60}s</p>
                    <p className="text-muted-foreground text-xs">0-60 mph</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.top_speed_mph}mph</p>
                    <p className="text-muted-foreground text-xs">Top Speed</p>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Starting at ${vehicle.price.toLocaleString()}*
                    </p>
                    <p className="text-xs text-muted-foreground">
                      After Est. Gas Savings
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Learn</Button>
                    <Button 
                      size="sm"
                      onClick={() => handleOrder(vehicle)}
                      disabled={vehicle.status !== 'available'}
                    >
                      Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Dialog */}
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
              <DialogDescription>
                You're about to order a {selectedVehicle?.year} {selectedVehicle?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="space-y-4">
                <img 
                  src={getVehicleImage(selectedVehicle)} 
                  alt={selectedVehicle.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-medium">{selectedVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{selectedVehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Range</span>
                    <span className="font-medium">{selectedVehicle.range_mi} miles</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${selectedVehicle.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setOrderDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={confirmOrder}>
                    Confirm Order
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default EnhancedInventory;
