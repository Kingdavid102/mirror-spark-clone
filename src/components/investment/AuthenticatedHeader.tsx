import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AuthenticatedHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const navItems = ["Inventory", "Invest", "Stocks", "Portfolio"];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Tesla Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold tracking-[0.3em] text-foreground">
            T Ξ S L Λ
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-tesla-blue hover:text-tesla-blue/80 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Account / Auth */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-tesla-blue rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:inline text-sm">{user.email?.split('@')[0]}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Signed in as</span>
                <span className="text-sm text-muted-foreground truncate max-w-full">
                  {user.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                My Orders
              </DropdownMenuItem>
              <DropdownMenuItem>
                Portfolio
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            className="bg-tesla-blue hover:bg-tesla-blue/90 text-white"
          >
            Account
          </Button>
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
