import { useState, useEffect } from 'react';
import Header from '../components/Header';
import PasswordGateModal from '../components/PasswordGateModal';
import VideoSection from '../components/VideoSection';
import ScreenshotsGallery from '../components/ScreenshotsGallery';
import MediaDownloadButton from '../components/MediaDownloadButton';
import SocialMediaSection from '../components/SocialMediaSection';
import { useContent } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Mail } from 'lucide-react';

function isVerifiedInSession(): boolean {
  try {
    return sessionStorage.getItem('presskit-verified') === '1';
  } catch {
    return false;
  }
}

export default function PressKitPage() {
  const { data: content, isLoading } = useContent();
  const [verified, setVerified] = useState(isVerifiedInSession);

  // Reset verification if password protection is disabled
  useEffect(() => {
    if (content && !content.passwordEnabled) {
      setVerified(true);
    }
  }, [content?.passwordEnabled]);

  const showPasswordGate = !isLoading && content?.passwordEnabled && !verified;
  const showContent = !isLoading && (!content?.passwordEnabled || verified);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="page-bg" />

      {/* Password Gate */}
      {showPasswordGate && (
        <PasswordGateModal onVerified={() => setVerified(true)} />
      )}

      {/* Page Content */}
      <div className="page-content min-h-screen flex flex-col">
        <Header />

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="space-y-4 w-full max-w-2xl px-6">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {showContent && content && (
          <main className="flex-1 px-6 pb-12">
            <div className="max-w-3xl mx-auto">

              {/* ── 1. Hero ── */}
              <section className="press-section text-center">
                <h1 className="font-heading text-6xl md:text-8xl leading-none body-text mb-2">
                  Poke A Nose
                </h1>
                <p className="font-body text-base md:text-lg opacity-60 body-text">
                  A hand-drawn point-and-click adventure
                </p>
              </section>

              {/* ── 2. Video ── */}
              <section className="press-section">
                <VideoSection />
              </section>

              {/* ── 3. About ── */}
              {content.aboutText && (
                <section className="press-section">
                  <h2 className="font-heading text-2xl body-text mb-3">About the Game</h2>
                  <p className="font-body text-sm leading-relaxed body-text opacity-80 whitespace-pre-wrap">
                    {content.aboutText}
                  </p>
                </section>
              )}

              {/* ── 4. Features ── */}
              {content.features && content.features.length > 0 && (
                <section className="press-section">
                  <h2 className="font-heading text-2xl body-text mb-3">Features</h2>
                  <ul className="space-y-1">
                    {content.features.map((f, i) => (
                      <li key={i} className="font-body text-sm body-text opacity-80 flex items-start gap-2">
                        <span className="mt-1 w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-60" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── 5. Game Details ── */}
              {(content.gameDetails.genre || content.gameDetails.platforms || content.gameDetails.releaseDate) && (
                <section className="press-section">
                  <h2 className="font-heading text-2xl body-text mb-3">Game Details</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {content.gameDetails.genre && (
                      <div>
                        <dt className="font-body text-xs uppercase tracking-widest opacity-40 body-text mb-1">Genre</dt>
                        <dd className="font-body text-sm body-text">{content.gameDetails.genre}</dd>
                      </div>
                    )}
                    {content.gameDetails.platforms && (
                      <div>
                        <dt className="font-body text-xs uppercase tracking-widest opacity-40 body-text mb-1">Platforms</dt>
                        <dd className="font-body text-sm body-text">{content.gameDetails.platforms}</dd>
                      </div>
                    )}
                    {content.gameDetails.releaseDate && (
                      <div>
                        <dt className="font-body text-xs uppercase tracking-widest opacity-40 body-text mb-1">Release Date</dt>
                        <dd className="font-body text-sm body-text">{content.gameDetails.releaseDate}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {/* ── 6. Media / Screenshots ── */}
              <section className="press-section">
                <h2 className="font-heading text-2xl body-text mb-1">Media</h2>
                <p className="font-body text-xs uppercase tracking-widest opacity-40 body-text mb-3">Screenshots</p>
                <div className="mb-4">
                  <MediaDownloadButton />
                </div>
                <ScreenshotsGallery />
              </section>

              {/* ── 7. Social Media ── */}
              <section className="press-section">
                <SocialMediaSection instagramLink={content.instagramLink} />
              </section>

              {/* ── 8. Developer ── */}
              {content.developerWebsite && (
                <section className="press-section">
                  <h2 className="font-heading text-2xl body-text mb-2">Developer</h2>
                  <a
                    href={content.developerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm body-text opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <ExternalLink size={13} />
                    {content.developerWebsite}
                  </a>
                </section>
              )}

              {/* ── 9. Press & Support ── */}
              {content.pressEmail && (
                <section className="press-section">
                  <h2 className="font-heading text-2xl body-text mb-2">Press &amp; Support</h2>
                  <a
                    href={`mailto:${content.pressEmail}`}
                    className="font-body text-sm body-text opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <Mail size={13} />
                    {content.pressEmail}
                  </a>
                </section>
              )}

              {/* ── 10. Footer Festival Logo ── */}
              <section className="press-section flex justify-center pt-4 pb-2">
                <img
                  src="/assets/kaboom-2025.png"
                  alt="Kaboom Animation Festival 2025"
                  className="festival-logo"
                  style={{ width: '220px', maxWidth: '100%' }}
                />
              </section>

            </div>
          </main>
        )}

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
