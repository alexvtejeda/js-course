'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface LoadingOverlayProps {
  logoSrc?: string; // Path to your triangular logo
  minDisplayTime?: number; // Minimum time to show loader (ms)
}

export function LoadingOverlay({
  logoSrc,
  minDisplayTime = 800
}: LoadingOverlayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      // Ensure minimum display time
      setTimeout(() => {
        setShouldHide(true);
        // Remove from DOM after fade animation
        setTimeout(() => setIsLoading(false), 300);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [minDisplayTime]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-300 ${
        shouldHide ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Triangular Logo Container */}
        <div className="relative">

          {/* Rotating Triangle Border */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div
              className="w-[320px] h-[320px] border-t-4 border-primary"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          </div>

          {/* Logo Image */}
          {logoSrc ? (
            <div
              className="w-[320px] h-[320px] flex items-center justify-center"
            >
              <img
                src={logoSrc}
                className="w-full h-full object-contain p-4"
              />
            </div>
          ) : (
            // Fallback: Filled Triangle
            <div
              className="w-[120px] h-[120px] bg-gradient-to-br from-primary to-chart-2"
              style={{
                clipPath: 'polygon(50% 10%, 10% 90%, 90% 90%)',
              }}
            />
          )}
        </div>

        {/* Loading Text with Spinner */}
        <div className="flex items-center gap-3">
          <Spinner className="text-primary" />
        </div>
      </div>
    </div>
  );
}
