'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface PhotoZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Clickable photo thumbnail that opens a centered overlay zoom on click.
 * Click the overlay or press Escape to close.
 */
export default function PhotoZoom({ src, alt, width = 80, height = 80, className = '' }: PhotoZoomProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div className="flex-shrink-0 cursor-pointer" onClick={() => setOpen(true)}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`rounded-lg object-cover border border-gray-200 hover:border-brand-teal hover:shadow-md transition-all ${className}`}
          style={{ width, height }}
        />
      </div>

      {/* Full-screen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          tabIndex={0}
          role="dialog"
        >
          {/* Close button */}
          <span
            className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer z-10"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </span>

          {/* Zoomed image */}
          <div onClick={(e) => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              width={400}
              height={400}
              className="rounded-xl object-cover shadow-2xl max-w-[90vw] max-h-[80vh]"
              style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '80vh' }}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
