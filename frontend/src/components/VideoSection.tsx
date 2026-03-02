import React, { useState } from 'react';

interface VideoSectionProps {
  youtubeLink?: string;
}

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  // Handle youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // Handle youtube.com/watch?v=ID
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];
  // Handle youtube.com/embed/ID
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

export default function VideoSection({ youtubeLink }: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);

  const videoId = youtubeLink ? extractYoutubeId(youtubeLink) : null;
  const thumbnailUrl = '/assets/video_thumbnail.png';
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : null;

  if (playing && embedUrl) {
    return (
      <div className="w-full aspect-video">
        <iframe
          src={embedUrl}
          title="Game Trailer"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => embedUrl && setPlaying(true)}
      className={`relative w-full aspect-video overflow-hidden block ${embedUrl ? 'cursor-pointer' : 'cursor-default'}`}
      aria-label={embedUrl ? 'Play video' : 'Video thumbnail'}
    >
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      {embedUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors">
            <svg
              className="w-7 h-7 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
