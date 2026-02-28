import { useState } from 'react';
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
  const [fullscreen, setFullscreen] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {SCREENSHOTS.map((s) => (
          <div
            key={s.src}
            className="aspect-video overflow-hidden cursor-pointer"
            onClick={() => setFullscreen(s)}
          >
            <img
              src={s.src}
              alt={s.alt}
              className="screenshot-img"
              loading="lazy"
              style={{ border: '1px solid #000000' }}
            />
          </div>
        ))}
      </div>
      {fullscreen && (
        <FullscreenViewer
          src={fullscreen.src}
          alt={fullscreen.alt}
          onClose={() => setFullscreen(null)}
        />
      )}
    </>
  );
}
