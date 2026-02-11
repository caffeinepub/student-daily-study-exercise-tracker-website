import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AppHeader from './components/layout/AppHeader';
import AccessDeniedScreen from './components/auth/AccessDeniedScreen';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'student-tracker'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const routeTree = rootRoute.addChildren([indexRoute, historyRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AuthenticatedApp() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupDialog />}
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthenticatedApp />
      <Toaster />
    </ThemeProvider>
  );
}

