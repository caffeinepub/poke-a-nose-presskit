import React from 'react';

interface SocialMediaSectionProps {
  instagramUrl?: string;
}

function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function SocialMediaSection({ instagramUrl }: SocialMediaSectionProps) {
  if (!isValidUrl(instagramUrl || '')) return null;

  return (
    <div className="flex items-center gap-4">
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        <img
          src="/assets/generated/instagram-icon-transparent.dim_64x64.png"
          alt="Instagram"
          className="w-8 h-8 game-logo"
        />
        <span className="text-sm underline underline-offset-4">Instagram</span>
      </a>
    </div>
  );
}
