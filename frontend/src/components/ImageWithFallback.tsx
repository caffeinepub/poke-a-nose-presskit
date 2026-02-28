import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

export default function ImageWithFallback({ src, alt, className, style, width, height }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground text-xs font-body ${className || ''}`}
        style={{ width, height, ...style }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          className={`bg-muted animate-pulse ${className || ''}`}
          style={{ width, height, ...style }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className || ''} ${loaded ? '' : 'hidden'}`}
        style={style}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
