import React from 'react';

function Mock({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Mock;
export const Map = Mock;
export const Source = Mock;
export const Layer = () => null;
export const Marker = Mock;
