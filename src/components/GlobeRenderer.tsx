import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath } from "d3-geo";
import { drag } from "d3-drag";
import { zoom } from "d3-zoom";
import { timer, Timer } from "d3-timer";

interface PathData {
  coordinates: [number, number][];
}

interface GlobeRendererProps {
  paths: PathData[];
  autoRotate?: boolean;
  strokeWidth?: number;
}

export default function GlobeRenderer({ paths, autoRotate = false, strokeWidth = 2 }: GlobeRendererProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const projectionRef = useRef(geoOrthographic().scale(180).translate([200, 200]));
  const pathGeneratorRef = useRef(geoPath(projectionRef.current));
  const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
  const timerRef = useRef<Timer | null>(null);
  const [tick, setTick] = useState(0);

  // helper to (re)start timer when autoRotate true
  const startTimer = () => {
    if (!autoRotate) return;
    timerRef.current = timer(() => {
      const r = rotationRef.current;
      r[0] += 0.02; // slow rotation in degrees/ms
      projectionRef.current.rotate(r);
      setTick((t) => t + 1);
    });
  };

  useEffect(() => {
    timerRef.current?.stop();
    if (autoRotate) {
      startTimer();
    }
    return () => {
      timerRef.current?.stop();
    };
  }, [autoRotate]);

  useEffect(() => {
    const svg = select(svgRef.current);

    const dragBehavior = drag<SVGSVGElement, unknown>()
      .on("start", () => {
        timerRef.current?.stop();
      })
      .on("drag", (event) => {
        const rotate = projectionRef.current.rotate();
        projectionRef.current.rotate([
          rotate[0] + event.dx * 0.5,
          rotate[1] - event.dy * 0.5,
          rotate[2],
        ]);
        rotationRef.current = projectionRef.current.rotate() as [number, number, number];
        setTick((t) => t + 1);
      })
      .on("end", () => {
        rotationRef.current = projectionRef.current.rotate() as [number, number, number];
        if (autoRotate) startTimer();
      });

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .on("start", () => {
        timerRef.current?.stop();
      })
      .on("zoom", (event) => {
        projectionRef.current.scale(180 * event.transform.k);
        setTick((t) => t + 1);
      })
      .on("end", () => {
        if (autoRotate) startTimer();
      });

    svg.call(dragBehavior as any);
    svg.call(zoomBehavior as any);
  }, [autoRotate]);

  const pathGenerator = pathGeneratorRef.current;

  return (
    <svg ref={svgRef} className="h-full w-full rounded" viewBox="0 0 400 400">
      {paths.map((p, idx) => (
        <path
          key={idx}
          d={pathGenerator({ type: "LineString", coordinates: p.coordinates }) || undefined}
          fill="none"
          stroke="var(--primary-foreground)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.8}
        />
      ))}
    </svg>
  );
}
