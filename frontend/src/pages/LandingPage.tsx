import { Link } from '@tanstack/react-router';
import Header from '../components/Header';
import NewsletterPlaceholder from '../components/NewsletterPlaceholder';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="page-bg" />

      {/* Content */}
      <div className="page-content min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center">

            {/* Game Logo */}
            <div className="w-full flex justify-center">
              <img
                src="/assets/gamelogo.png"
                alt="Poke A Nose"
                className="game-logo w-full max-w-xl"
                style={{ minWidth: '320px' }}
              />
            </div>

            {/* Description */}
            <p className="font-body text-base leading-relaxed max-w-md body-text opacity-80">
              A hand-drawn point-and-click adventure game full of absurd humor,
              quirky characters, and puzzles that will make you scratch your head —
              and maybe poke a nose or two.
            </p>

            {/* Press Kit Link */}
            <Link to="/press-kit">
              <Button
                variant="default"
                className="rounded-none uppercase tracking-widest text-xs px-8 py-5 gap-2"
              >
                View Press Kit
                <ArrowRight size={14} />
              </Button>
            </Link>

            {/* Newsletter */}
            <div className="mt-2">
              <NewsletterPlaceholder />
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-4 px-6 text-center">
          <p className="font-body text-xs opacity-40 body-text">
            © {new Date().getFullYear()} Poke A Nose &mdash; Built with{' '}
            <span className="text-red-500">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'poke-a-nose-presskit')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
