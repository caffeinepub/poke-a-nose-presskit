import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoSectionProps {
  youtubeLink?: string;
}

function getYoutubeEmbedUrl(link: string): string {
  if (!link) return '';
  // Handle youtu.be short links
  const shortMatch = link.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
  }
  // Handle full youtube.com/watch?v= links
  const fullMatch = link.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (fullMatch) {
    return `https://www.youtube.com/embed/${fullMatch[1]}?autoplay=1`;
  }
  // Handle youtube.com/embed/ links directly
  if (link.includes('youtube.com/embed/')) {
    return link.includes('autoplay') ? link : `${link}?autoplay=1`;
  }
  return '';
}

export default function VideoSection({ youtubeLink }: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = youtubeLink ? getYoutubeEmbedUrl(youtubeLink) : '';
  const hasVideo = !!embedUrl;

  return (
    <div className="w-full">
      {!playing ? (
        <div
          className={`relative w-full group ${hasVideo ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => hasVideo && setPlaying(true)}
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src="/assets/video_thumbnail.png"
            alt="Game video thumbnail"
            className="w-full h-full object-contain bg-transparent"
            style={{ display: 'block' }}
          />
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center group-hover:bg-black transition-colors">
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={embedUrl}
            title="Poke A Nose Game Trailer"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
