import React from 'react';
import BookNetwork from '@/components/network/BookNetwork.jsx';

export default function BookNetworkPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Related Books Network</h1>
      <BookNetwork />
    </div>
  );
}
