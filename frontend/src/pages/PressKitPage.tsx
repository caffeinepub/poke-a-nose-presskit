import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetContent } from '../hooks/useQueries';
import VideoSection from '../components/VideoSection';
import ScreenshotsGallery from '../components/ScreenshotsGallery';
import SocialMediaSection from '../components/SocialMediaSection';
import MediaDownloadButton from '../components/MediaDownloadButton';

const VERIFIED_SESSION_KEY = 'presskit_verified';

export default function PressKitPage() {
  const navigate = useNavigate();
  const { data: content, isLoading: contentLoading } = useGetContent();

  const passwordEnabled = content?.passwordEnabled ?? false;
  const isVerified = sessionStorage.getItem(VERIFIED_SESSION_KEY) === 'true';

  // If password is enabled and user hasn't verified, redirect to landing page
  useEffect(() => {
    if (!contentLoading && passwordEnabled === true && !isVerified) {
      navigate({ to: '/' });
    }
  }, [contentLoading, passwordEnabled, isVerified, navigate]);

  // Extract content fields with safe defaults
  const aboutText = content?.aboutText ?? '';
  const features = content?.features ?? [];
  const gameDetails = content?.gameDetails ?? { genre: '', platforms: '', releaseDate: '' };
  const instagramLink = content?.instagramLink ?? '';
  const youtubeLink = content?.youtubeLink ?? '';
  const developerWebsite = content?.developerWebsite ?? '';
  const pressEmail = content?.pressEmail ?? '';

  return (
    <div className="page-bg">
      <div className="page-content">
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">

          {/* 1. Game Logo */}
          <section className="flex justify-center">
            <img
              src="/assets/gamelogo.png"
              alt="Poke A Nose"
              className="max-h-48 object-contain game-logo-invert"
            />
          </section>

          {/* 2. YouTube Video (no heading) */}
          <section>
            <VideoSection youtubeLink={youtubeLink} />
          </section>

          {/* 3. About */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4" style={{ color: 'var(--body-text-color)' }}>
              About
            </h2>
            {contentLoading ? (
              <div className="h-20 bg-muted animate-pulse rounded" />
            ) : aboutText ? (
              <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--body-text-color)' }}>
                {aboutText}
              </p>
            ) : (
              <p className="text-base leading-relaxed text-muted-foreground italic">
                No description available yet.
              </p>
            )}
          </section>

          {/* 4. Game Details */}
          {(contentLoading || gameDetails.genre || gameDetails.platforms || gameDetails.releaseDate) && (
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4" style={{ color: 'var(--body-text-color)' }}>
                Game Details
              </h2>
              {contentLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <dl className="space-y-2">
                  {gameDetails.genre && (
                    <div className="flex gap-2">
                      <dt className="font-semibold min-w-[120px]" style={{ color: 'var(--body-text-color)' }}>
                        Genre:
                      </dt>
                      <dd style={{ color: 'var(--body-text-color)' }}>{gameDetails.genre}</dd>
                    </div>
                  )}
                  {gameDetails.platforms && (
                    <div className="flex gap-2">
                      <dt className="font-semibold min-w-[120px]" style={{ color: 'var(--body-text-color)' }}>
                        Platforms:
                      </dt>
                      <dd style={{ color: 'var(--body-text-color)' }}>{gameDetails.platforms}</dd>
                    </div>
                  )}
                  {gameDetails.releaseDate && (
                    <div className="flex gap-2">
                      <dt className="font-semibold min-w-[120px]" style={{ color: 'var(--body-text-color)' }}>
                        Release Date:
                      </dt>
                      <dd style={{ color: 'var(--body-text-color)' }}>{gameDetails.releaseDate}</dd>
                    </div>
                  )}
                </dl>
              )}
            </section>
          )}

          {/* 5. Features */}
          {(contentLoading || features.length > 0) && (
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4" style={{ color: 'var(--body-text-color)' }}>
                Features
              </h2>
              {contentLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-base"
                      style={{ color: 'var(--body-text-color)' }}
                    >
                      <span className="mt-1 text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* 6. Screenshots */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4" style={{ color: 'var(--body-text-color)' }}>
              Screenshots
            </h2>
            <ScreenshotsGallery />
          </section>

          {/* 7. Download all screenshots */}
          <section>
            <MediaDownloadButton />
          </section>

          {/* 8. Socials */}
          {instagramLink && (
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4" style={{ color: 'var(--body-text-color)' }}>
                Social Media
              </h2>
              <SocialMediaSection instagramUrl={instagramLink} />
            </section>
          )}

          {/* 9. Press Email */}
          {(developerWebsite || pressEmail) && (
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4" style={{ color: 'var(--body-text-color)' }}>
                Contact
              </h2>
              <div className="space-y-2">
                {developerWebsite && (
                  <p style={{ color: 'var(--body-text-color)' }}>
                    <span className="font-semibold">Website: </span>
                    <a
                      href={developerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80"
                      style={{ color: 'var(--body-text-color)' }}
                    >
                      {developerWebsite}
                    </a>
                  </p>
                )}
                {pressEmail && (
                  <p style={{ color: 'var(--body-text-color)' }}>
                    <span className="font-semibold">Press Email: </span>
                    <a
                      href={`mailto:${pressEmail}`}
                      className="underline hover:opacity-80"
                      style={{ color: 'var(--body-text-color)' }}
                    >
                      {pressEmail}
                    </a>
                  </p>
                )}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>
            Built with{' '}
            <span className="text-red-500">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'unknown-app')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Poke A Nose. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
