import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, User, LogOut, Menu, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { getUnreadCount } from '@/db/api';

export const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    if (user) {
      const count = await getUnreadCount(user.id);
      setUnreadCount(count);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isPublicPage = location.pathname === '/' || location.pathname === '/auth';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/domus_logo.png"
            alt="DOMUS"
            className="h-16 md:h-20 lg:h-[5rem] w-auto max-h-16 md:max-h-20 object-contain"
          />
          <span className="sr-only">DOMUS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && profile ? (
            <>
              <Link to="/properties">
                <Button variant="ghost">Properties</Button>
              </Link>
              <Link to="/emergency-housing">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Emergency Housing
                </Button>
              </Link>
              <Link to={profile.account_type === 'broker' ? '/broker' : profile.account_type === 'reclaim_seeker' ? '/emergency/seeker' : '/dashboard'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/ai-finder">
                <Button variant="ghost">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Home Finder
                </Button>
              </Link>
              <Link to="/messages" className="relative">
                <Button variant="ghost" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {profile.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {profile.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {user && profile ? (
                  <>
                    <div className="pb-4 border-b">
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                    <Link to="/properties">
                      <Button variant="ghost" className="w-full justify-start">Properties</Button>
                    </Link>
                    <Link to="/shelter-map">
                      <Button variant="ghost" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Emergency Housing
                      </Button>
                    </Link>
                    <Link to={profile.account_type === 'broker' ? '/broker' : profile.account_type === 'reclaim_seeker' ? '/emergency/seeker' : '/dashboard'}>
                      <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                    </Link>
                    <Link to="/market">
                      <Button variant="ghost" className="w-full justify-start">Market Analytics</Button>
                    </Link>
                    <Link to="/map">
                      <Button variant="ghost" className="w-full justify-start">Map Explorer</Button>
                    </Link>
                    <Link to="/messages" className="relative">
                      <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Messages
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start">Profile Settings</Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/">
                      <Button variant="ghost" className="w-full justify-start">Home</Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="default" className="w-full">Enter DOMUS</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
