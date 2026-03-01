import React, { useState } from 'react';
import { useContent } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import PasswordGateModal from '../components/PasswordGateModal';
import ScreenshotsGallery from '../components/ScreenshotsGallery';
import VideoSection from '../components/VideoSection';
import MediaDownloadButton from '../components/MediaDownloadButton';
import SocialMediaSection from '../components/SocialMediaSection';
import { Loader2 } from 'lucide-react';

export default function PressKitPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: content, isLoading: contentLoading } = useContent();

  // Password gate state
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem('presskit_verified') === 'true';
  });

  // Determine if we need to show the password gate
  const isReady = !actorFetching && !contentLoading && !!content;
  const needsPassword = isReady && content.passwordEnabled && !isVerified;

  // Show loading while actor or content is initializing
  if (actorFetching || contentLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="page-bg" />
        <div className="page-content min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-foreground" />
            <p className="text-muted-foreground text-sm">Loading press kit…</p>
          </div>
        </div>
      </div>
    );
  }

  // Show password gate if needed
  if (needsPassword) {
    return <PasswordGateModal onVerified={() => setIsVerified(true)} />;
  }

  // Press kit content
  const gameDetails = content?.gameDetails;
  const features = content?.features ?? [];
  const aboutText = content?.aboutText ?? '';
  const instagramLink = content?.instagramLink ?? '';
  const youtubeLink = content?.youtubeLink ?? '';
  const developerWebsite = content?.developerWebsite ?? '';
  const pressEmail = content?.pressEmail ?? '';

  return (
    <div className="min-h-screen relative">
      {/* Background — same as landing page */}
      <div className="page-bg" />

      <div className="page-content min-h-screen flex flex-col">
        <main className="flex-1 w-full">

          {/* 1. Game Logo — full content width, aspect ratio preserved */}
          <section className="w-full max-w-2xl mx-auto px-6 pt-16 pb-6">
            <img
              src="/assets/gamelogo.png"
              alt="Poke A Nose"
              className="game-logo w-full h-auto object-contain"
            />
          </section>

          {/* 2. YouTube Video */}
          <section className="w-full max-w-2xl mx-auto px-6 py-6">
            <VideoSection youtubeLink={youtubeLink} />
          </section>

          {/* 3. About */}
          {aboutText && (
            <section className="w-full max-w-2xl mx-auto px-6 py-6">
              <h2 className="font-heading text-2xl font-bold mb-3">About</h2>
              <p className="leading-relaxed whitespace-pre-wrap body-text">{aboutText}</p>
            </section>
          )}

          {/* 4. Game Details */}
          {gameDetails && (gameDetails.genre || gameDetails.platforms || gameDetails.releaseDate) && (
            <section className="w-full max-w-2xl mx-auto px-6 py-6">
              <h2 className="font-heading text-2xl font-bold mb-3">Game Details</h2>
              <dl className="space-y-2">
                {gameDetails.genre && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-32 shrink-0 body-text">Genre</dt>
                    <dd className="body-text">{gameDetails.genre}</dd>
                  </div>
                )}
                {gameDetails.platforms && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-32 shrink-0 body-text">Platforms</dt>
                    <dd className="body-text">{gameDetails.platforms}</dd>
                  </div>
                )}
                {gameDetails.releaseDate && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-32 shrink-0 body-text">Release Date</dt>
                    <dd className="body-text">{gameDetails.releaseDate}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {/* 5. Features */}
          {features.length > 0 && (
            <section className="w-full max-w-2xl mx-auto px-6 py-6">
              <h2 className="font-heading text-2xl font-bold mb-3">Features</h2>
              <ul className="list-disc list-inside space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="body-text">{f}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 6. Screenshots */}
          <section className="w-full max-w-4xl mx-auto px-6 py-6">
            <h2 className="font-heading text-2xl font-bold mb-4">Screenshots</h2>
            <ScreenshotsGallery />
          </section>

          {/* 7. Download All Screenshots */}
          <section className="w-full max-w-2xl mx-auto px-6 py-4">
            <MediaDownloadButton />
          </section>

          {/* 8. Socials */}
          <section className="w-full max-w-2xl mx-auto px-6 py-6">
            <SocialMediaSection instagramLink={instagramLink} />
          </section>

          {/* 9. Press Email */}
          {(pressEmail || developerWebsite) && (
            <section className="w-full max-w-2xl mx-auto px-6 py-6">
              <h2 className="font-heading text-2xl font-bold mb-3">Press Contact</h2>
              <div className="space-y-2">
                {pressEmail && (
                  <p className="body-text">
                    <span className="font-semibold">Press Email: </span>
                    <a href={`mailto:${pressEmail}`} className="underline hover:opacity-70">
                      {pressEmail}
                    </a>
                  </p>
                )}
                {developerWebsite && (
                  <p className="body-text">
                    <span className="font-semibold">Website: </span>
                    <a href={developerWebsite} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
                      {developerWebsite}
                    </a>
                  </p>
                )}
              </div>
            </section>
          )}

        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-16 py-8 px-6 text-center border-t border-border">
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
