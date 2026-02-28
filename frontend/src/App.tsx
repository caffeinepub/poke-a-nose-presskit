import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useContent } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import PressKitPage from './pages/PressKitPage';
import AdminDashboard from './pages/AdminDashboard';

// Apply body text color globally
function BodyTextColorApplier() {
  const { data: content } = useContent();
  const { isDark } = useTheme();

  useEffect(() => {
    const color = isDark ? '#ffffff' : (content?.bodyTextColorHex || '#111111');
    document.documentElement.style.setProperty('--body-text-color', color);
  }, [content?.bodyTextColorHex, isDark]);

  return null;
}

function Layout() {
  return (
    <>
      <BodyTextColorApplier />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const landingRoute = createRoute({
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

const routeTree = rootRoute.addChildren([landingRoute, pressKitRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
