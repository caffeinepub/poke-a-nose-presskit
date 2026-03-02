import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetContent } from '../hooks/useQueries';
import PasswordGateModal from '../components/PasswordGateModal';

const VERIFIED_SESSION_KEY = 'presskit_verified';

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: content, isLoading: contentLoading } = useGetContent();

  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return sessionStorage.getItem(VERIFIED_SESSION_KEY) === 'true';
  });

  const passwordEnabled = content?.passwordEnabled ?? false;

  // If password is disabled, mark as verified automatically
  useEffect(() => {
    if (!contentLoading && passwordEnabled === false) {
      setIsVerified(true);
    }
  }, [passwordEnabled, contentLoading]);

  const showPasswordGate =
    !contentLoading &&
    passwordEnabled === true &&
    !isVerified;

  const handleVerified = () => {
    sessionStorage.setItem(VERIFIED_SESSION_KEY, 'true');
    setIsVerified(true);
    navigate({ to: '/press-kit' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="page-bg" />

      {/* Password Gate Modal — shown on landing page when password protection is enabled */}
      {showPasswordGate && (
        <PasswordGateModal onVerified={handleVerified} />
      )}

      {/* Content */}
      <div className="page-content min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full flex flex-col items-center gap-8 text-center">

            {/* Game Logo — enlarged, static (no navigation) */}
            <div className="w-full flex justify-center">
              <img
                src="/assets/gamelogo.png"
                alt="Poke A Nose"
                className="game-logo h-auto"
                style={{ maxWidth: '100%', width: 'min(640px, 100%)' }}
              />
            </div>

            {/* Newsletter Signup iframe */}
            <div className="w-full flex justify-center">
              <iframe
                width="540"
                height="305"
                src="https://93131207.sibforms.com/serve/MUIFABVezFOY1nHR9ltGQqaDwJ10Fg-HcQoqGQe4GpZ-B0vvFqzsFHVBqIiBEIlFLJO0vlTclMExp7C7Gk2pTqwlo2lXjvlK72Lm8DoYlw_mrgeja6z6ZBDk40pGyPmJmufxw6b_qtJB1hU2OuLrowtJ4nq0OeADNzvc8aTH6olP6VtzI7s0SNckw0ch_WtAL7d3aChZ_s6pTSzYag=="
                frameBorder={0}
                scrolling="no"
                allowFullScreen
                style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%', overflow: 'hidden' }}
              />
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
