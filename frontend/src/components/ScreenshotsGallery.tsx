import React, { useState } from 'react';
import FullscreenViewer from './FullscreenViewer';

const SCREENSHOTS = [
  { src: '/assets/screen01.png', alt: 'Screenshot 1' },
  { src: '/assets/screen02.png', alt: 'Screenshot 2' },
  { src: '/assets/screen03.png', alt: 'Screenshot 3' },
  { src: '/assets/screen04.png', alt: 'Screenshot 4' },
  { src: '/assets/screen05.png', alt: 'Screenshot 5' },
  { src: '/assets/screen06.png', alt: 'Screenshot 6' },
];

export default function ScreenshotsGallery() {
  const [fullscreenSrc, setFullscreenSrc] = useState<string | null>(null);
  const [fullscreenAlt, setFullscreenAlt] = useState<string>('');

  const openFullscreen = (src: string, alt: string) => {
    setFullscreenSrc(src);
    setFullscreenAlt(alt);
  };

  const closeFullscreen = () => {
    setFullscreenSrc(null);
    setFullscreenAlt('');
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SCREENSHOTS.map((shot) => (
          <button
            key={shot.src}
            onClick={() => openFullscreen(shot.src, shot.alt)}
            className="group relative aspect-video overflow-hidden border border-foreground/20 rounded-sm hover:border-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/40"
            aria-label={`View ${shot.alt} fullscreen`}
          >
            <img
              src={shot.src}
              alt={shot.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </button>
        ))}
      </div>

      {fullscreenSrc && (
        <FullscreenViewer
          src={fullscreenSrc}
          alt={fullscreenAlt}
          onClose={closeFullscreen}
        />
      )}
    </>
  );
}
