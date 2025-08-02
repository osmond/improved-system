import React from "react";

export default function RouteNoveltyLegend() {
  return (
    <div className="bg-background/90 p-2 rounded shadow text-xs space-y-2">
      <div>
        <div className="font-medium mb-1">Novelty</div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Familiar</span>
          <div className="h-2 w-20 bg-gradient-to-r from-gray-400 to-red-500 rounded" />
          <span className="text-red-500">Novel</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-[0.6rem] text-white">
          #
        </div>
        <span>Cluster count of nearby starts</span>
      </div>
    </div>
  );
}

