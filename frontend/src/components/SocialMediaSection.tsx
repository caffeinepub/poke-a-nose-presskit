import { useTheme } from '../contexts/ThemeContext';

interface SocialMediaSectionProps {
  instagramLink: string;
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

export default function SocialMediaSection({ instagramLink }: SocialMediaSectionProps) {
  const { isDark } = useTheme();

  if (!isValidUrl(instagramLink)) return null;

  return (
    <div className="flex items-start">
      <a
        href={instagramLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="inline-flex items-center justify-center w-12 h-12 transition-colors"
        style={{
          backgroundColor: isDark ? '#ffffff' : '#000000',
          padding: '8px',
        }}
      >
        <img
          src="/assets/generated/instagram-icon-transparent.dim_64x64.png"
          alt="Instagram"
          width={32}
          height={32}
          style={{
            filter: isDark ? 'invert(1)' : 'none',
            display: 'block',
          }}
        />
      </a>
    </div>
  );
}
