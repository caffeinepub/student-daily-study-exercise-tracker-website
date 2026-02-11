import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import LoginButton from '../auth/LoginButton';
import { Link, useRouterState } from '@tanstack/react-router';
import { BookOpen, Dumbbell, History, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  const { data: userProfile } = useGetCallerUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/app-logo.dim_256x256.png"
              alt="App Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg hidden sm:inline">Daily Tracker</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              asChild
              variant={currentPath === '/' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant={currentPath === '/history' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/history">
                <History className="w-4 h-4 mr-2" />
                History
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userProfile && (
            <span className="text-sm font-medium hidden sm:inline">
              Hi, {userProfile.name}!
            </span>
          )}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}

