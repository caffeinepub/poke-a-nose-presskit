import { useEffect } from 'react';
import { X } from 'lucide-react';

interface FullscreenViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function FullscreenViewer({ src, alt, onClose }: FullscreenViewerProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fullscreen-viewer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen screenshot"
    >
      <button
        className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close fullscreen"
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '100vw', maxHeight: '100vh', objectFit: 'contain', cursor: 'zoom-out' }}
        onClick={onClose}
      />
    </div>
  );
}
