import { Link, useRouterState } from '@tanstack/react-router';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { toggleTheme, isDark } = useTheme();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Don't show header on admin page
  if (pathname === '/admin') return null;

  return (
    <header className="relative z-10 w-full">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-end">
        <nav className="flex items-center gap-6">
          <Link
            to="/press-kit"
            className="font-body text-sm font-medium hover:opacity-60 transition-opacity body-text"
          >
            Press Kit
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="p-2 rounded-sm hover:opacity-60 transition-opacity body-text"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
