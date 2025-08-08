import React from 'react';

interface CursorTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  children: React.ReactNode;
}

export default function CursorTooltip({ x, y, visible, children }: CursorTooltipProps) {
  if (!visible) return null;
  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-50 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow"
      style={{ left: x + 8, top: y + 8 }}
    >
      {children}
    </div>
  );
}
