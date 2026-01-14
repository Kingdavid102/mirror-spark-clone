import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStockPrices } from '@/hooks/useStockPrices';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  symbol: string;
  shares: number;
  avg_cost: number;
}

const UserPortfolio = () => {
  const { user } = useAuth();
  const { stocks, getStock } = useStockPrices(3000);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newShares, setNewShares] = useState('');
  const [newCost, setNewCost] = useState('');

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPortfolio = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching portfolio:', error);
    } else {
      setPortfolio(data || []);
    }
    setLoading(false);
  };

  const addToPortfolio = async () => {
    if (!user || !newSymbol || !newShares || !newCost) return;

    const { error } = await supabase
      .from('portfolios')
      .upsert({
        user_id: user.id,
        symbol: newSymbol.toUpperCase(),
        shares: parseFloat(newShares),
        avg_cost: parseFloat(newCost),
      }, {
        onConflict: 'user_id,symbol'
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Added!', description: `${newSymbol.toUpperCase()} added to your portfolio` });
      setAddDialogOpen(false);
      setNewSymbol('');
      setNewShares('');
      setNewCost('');
      fetchPortfolio();
    }
  };

  const removeFromPortfolio = async (id: string) => {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Removed', description: 'Position removed from portfolio' });
      fetchPortfolio();
    }
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => {
      const stock = getStock(item.symbol);
      if (stock) {
        return total + (stock.price * item.shares);
      }
      return total + (item.avg_cost * item.shares);
    }, 0);
  };

  const calculateTotalGain = () => {
    return portfolio.reduce((total, item) => {
      const stock = getStock(item.symbol);
      if (stock) {
        const currentValue = stock.price * item.shares;
        const costBasis = item.avg_cost * item.shares;
        return total + (currentValue - costBasis);
      }
      return total;
    }, 0);
  };

  if (!user) {
    return (
      <section className="bg-[#0a0a0a] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-xl p-8 text-center border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
            <p className="text-gray-400 mb-6">Sign in to track your investments and build your portfolio</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-tesla-blue hover:bg-tesla-blue/90"
            >
              Sign In to Start Investing
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const totalValue = calculateTotalValue();
  const totalGain = calculateTotalGain();
  const totalGainPercent = portfolio.length > 0 
    ? (totalGain / (totalValue - totalGain)) * 100 
    : 0;

  return (
    <section className="bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Portfolio</h2>
            <p className="text-gray-400">Track your investments in real-time</p>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-tesla-blue hover:bg-tesla-blue/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Value</p>
            <p className="text-3xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Gain/Loss</p>
            <p className={`text-3xl font-bold ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Return</p>
            <div className={`text-3xl font-bold flex items-center gap-2 ${totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainPercent >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Holdings */}
        {portfolio.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-xl p-8 text-center border border-gray-800">
            <p className="text-gray-400 mb-4">You don't have any positions yet</p>
            <Button 
              onClick={() => setAddDialogOpen(true)}
              variant="outline"
              className="border-gray-600"
            >
              Add Your First Position
            </Button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400">
              <div>Symbol</div>
              <div>Shares</div>
              <div>Avg Cost</div>
              <div>Current Price</div>
              <div>Gain/Loss</div>
              <div></div>
            </div>
            {portfolio.map((item) => {
              const stock = getStock(item.symbol);
              const currentPrice = stock?.price || item.avg_cost;
              const gain = (currentPrice - item.avg_cost) * item.shares;
              const gainPercent = ((currentPrice - item.avg_cost) / item.avg_cost) * 100;

              return (
                <div key={item.id} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-800 last:border-0 items-center">
                  <div className="font-medium">{item.symbol}</div>
                  <div>{item.shares.toLocaleString()}</div>
                  <div>${item.avg_cost.toFixed(2)}</div>
                  <div className="tabular-nums">${currentPrice.toFixed(2)}</div>
                  <div className={`${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => removeFromPortfolio(item.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Position Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-md bg-[#1a1a1a] text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>Add Position</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Symbol</label>
                <Select value={newSymbol} onValueChange={setNewSymbol}>
                  <SelectTrigger className="bg-[#0a0a0a] border-gray-700">
                    <SelectValue placeholder="Select stock" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-gray-700">
                    {stocks.map(s => (
                      <SelectItem key={s.symbol} value={s.symbol}>
                        {s.symbol} - {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Number of Shares</label>
                <Input
                  type="number"
                  value={newShares}
                  onChange={(e) => setNewShares(e.target.value)}
                  placeholder="0"
                  className="bg-[#0a0a0a] border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Average Cost per Share</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  placeholder="0.00"
                  className="bg-[#0a0a0a] border-gray-700"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-600"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-tesla-blue hover:bg-tesla-blue/90"
                  onClick={addToPortfolio}
                  disabled={!newSymbol || !newShares || !newCost}
                >
                  Add Position
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default UserPortfolio;
