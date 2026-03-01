import React, { useEffect } from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import PressKitPage from './pages/PressKitPage';
import AdminDashboard from './pages/AdminDashboard';
import { useContent } from './hooks/useQueries';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

// Body text color applier — reads from backend content
function BodyTextColorApplier() {
  const { data: content } = useContent();
  useEffect(() => {
    if (content?.bodyTextColorHex) {
      document.documentElement.style.setProperty('--body-text-color', content.bodyTextColorHex);
    }
  }, [content?.bodyTextColorHex]);
  return null;
}

// Layout with header (hidden on /admin)
function Layout() {
  return (
    <>
      <BodyTextColorApplier />
      <Header />
      <Outlet />
    </>
  );
}

// Routes
const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const pressKitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/press-kit',
  component: PressKitPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute, pressKitRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
