import React, { useState, useEffect } from 'react';
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
  // We only show it once we know: actor is ready AND content is loaded AND passwordEnabled is true
  const isReady = !actorFetching && !contentLoading && !!content;
  const needsPassword = isReady && content.passwordEnabled && !isVerified;

  // Show loading while actor or content is initializing
  if (actorFetching || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-foreground" />
          <p className="text-muted-foreground text-sm">Loading press kit…</p>
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
    <div className="page-content min-h-screen">
      {/* Hero / Logo */}
      <section className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <img
          src="/assets/gamelogo.png"
          alt="Poke A Nose"
          className="game-logo max-w-xs w-full object-contain"
        />
      </section>

      {/* About */}
      {aboutText && (
        <section className="max-w-2xl mx-auto px-6 py-6">
          <h2 className="font-heading text-2xl font-bold mb-3">About</h2>
          <p className="leading-relaxed whitespace-pre-wrap">{aboutText}</p>
        </section>
      )}

      {/* Game Details */}
      {gameDetails && (gameDetails.genre || gameDetails.platforms || gameDetails.releaseDate) && (
        <section className="max-w-2xl mx-auto px-6 py-6">
          <h2 className="font-heading text-2xl font-bold mb-3">Game Details</h2>
          <dl className="space-y-2">
            {gameDetails.genre && (
              <div className="flex gap-3">
                <dt className="font-semibold w-32 shrink-0">Genre</dt>
                <dd>{gameDetails.genre}</dd>
              </div>
            )}
            {gameDetails.platforms && (
              <div className="flex gap-3">
                <dt className="font-semibold w-32 shrink-0">Platforms</dt>
                <dd>{gameDetails.platforms}</dd>
              </div>
            )}
            {gameDetails.releaseDate && (
              <div className="flex gap-3">
                <dt className="font-semibold w-32 shrink-0">Release Date</dt>
                <dd>{gameDetails.releaseDate}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 py-6">
          <h2 className="font-heading text-2xl font-bold mb-3">Features</h2>
          <ul className="list-disc list-inside space-y-1">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Video */}
      <section className="max-w-2xl mx-auto px-6 py-6">
        <VideoSection youtubeLink={youtubeLink} />
      </section>

      {/* Screenshots */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        <h2 className="font-heading text-2xl font-bold mb-4">Screenshots</h2>
        <ScreenshotsGallery />
      </section>

      {/* Media Download */}
      <section className="max-w-2xl mx-auto px-6 py-6">
        <MediaDownloadButton />
      </section>

      {/* Social */}
      <section className="max-w-2xl mx-auto px-6 py-6">
        <SocialMediaSection instagramLink={instagramLink} />
      </section>

      {/* Contact */}
      {(pressEmail || developerWebsite) && (
        <section className="max-w-2xl mx-auto px-6 py-6">
          <h2 className="font-heading text-2xl font-bold mb-3">Contact</h2>
          <div className="space-y-2">
            {pressEmail && (
              <p>
                <span className="font-semibold">Press Email: </span>
                <a href={`mailto:${pressEmail}`} className="underline hover:opacity-70">
                  {pressEmail}
                </a>
              </p>
            )}
            {developerWebsite && (
              <p>
                <span className="font-semibold">Website: </span>
                <a href={developerWebsite} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
                  {developerWebsite}
                </a>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Poke A Nose — Built with{' '}
        <span className="text-red-500">♥</span> using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
