import React, { useEffect, useRef, useState } from 'react';
import GenreSankey from '@/components/genre/GenreSankey.jsx';

export default function GenreSankeyPage() {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-white p-4 flex flex-col'
          : 'p-4'
      }
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Genre Transition Sankey</h1>
        <button
          onClick={toggleFullscreen}
          className="px-2 py-1 border rounded"
          aria-pressed={isFullscreen}
          aria-label={
            isFullscreen ? 'Exit full screen' : 'Enter full screen'
          }
        >
          {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>
      <div className="flex-1">
        <GenreSankey />
      </div>
    </div>
  );
}
