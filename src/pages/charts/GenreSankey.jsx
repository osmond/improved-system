import React from 'react';
import GenreSankey from '@/components/genre/GenreSankey.jsx';

export default function GenreSankeyPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Genre Transition Sankey</h1>
      <GenreSankey />
    </div>
  );
}
