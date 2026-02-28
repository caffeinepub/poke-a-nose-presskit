import { useState } from 'react';
import { Play } from 'lucide-react';

const YOUTUBE_EMBED = 'https://www.youtube.com/embed/5in-hIASH08?autoplay=1';

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full">
      {!playing ? (
        <div
          className="relative w-full cursor-pointer group"
          onClick={() => setPlaying(true)}
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src="/assets/video_thumbnail.png"
            alt="Game video thumbnail"
            className="w-full h-full object-contain bg-transparent"
            style={{ display: 'block' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center group-hover:bg-black transition-colors">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={YOUTUBE_EMBED}
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
