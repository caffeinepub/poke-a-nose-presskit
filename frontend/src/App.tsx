import React, { useEffect } from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import PressKitPage from './pages/PressKitPage';
import AdminDashboard from './pages/AdminDashboard';
import { useGetContent } from './hooks/useQueries';

// ── Query Client ──────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof Error && error.message.includes('Unauthorized')) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15000),
    },
  },
});

// ── Body Text Color Applier ───────────────────────────────────────────────────

function BodyTextColorApplier() {
  const { data: content } = useGetContent();

  useEffect(() => {
    if (content?.bodyTextColorHex) {
      document.documentElement.style.setProperty('--body-text-color', content.bodyTextColorHex);
    }
  }, [content?.bodyTextColorHex]);

  return null;
}

// ── Layout ────────────────────────────────────────────────────────────────────

function RootLayout() {
  return (
    <>
      <BodyTextColorApplier />
      <Header />
      <Outlet />
    </>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootLayout,
});

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

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
