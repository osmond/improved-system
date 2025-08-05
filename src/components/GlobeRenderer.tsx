import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath } from "d3-geo";
import { drag, type DragBehavior } from "d3-drag";
import { zoom, type ZoomBehavior } from "d3-zoom";
import { timer, Timer } from "d3-timer";
import type { Feature } from "geojson";

interface PathData {
  coordinates: [number, number][];
  date?: string;
  miles?: number;
  /** Optional stroke color for rendering */
  color?: string;
}

interface GlobeRendererProps {
  paths: PathData[];
  worldFeatures?: Feature[];
  autoRotate?: boolean;
  strokeWidth?: number;
  onPathMouseEnter?: (p: PathData) => void;
  onPathMouseLeave?: () => void;
}

export default function GlobeRenderer({
  paths,
  worldFeatures = [],
  autoRotate = false,
  strokeWidth = 2,
  onPathMouseEnter,
  onPathMouseLeave,
}: GlobeRendererProps) {
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
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = select(svgEl);

    const dragBehavior: DragBehavior<SVGSVGElement, unknown, unknown> = drag<SVGSVGElement, unknown>()
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

    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<SVGSVGElement, unknown>()
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

    svg.call(dragBehavior);
    svg.call(zoomBehavior);
  }, [autoRotate]);

  // animate newly added paths to "draw" themselves
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const pathEls = svg.querySelectorAll("path.activity-path");
    pathEls.forEach((el) => {
      if (el.getAttribute("data-animated")) return;
      const pathEl = el as SVGPathElement;
      if (typeof pathEl.getTotalLength !== "function") return;
      const length = pathEl.getTotalLength();
      pathEl.setAttribute("stroke-dasharray", length.toString());
      pathEl.setAttribute("stroke-dashoffset", length.toString());
      pathEl.setAttribute("data-animated", "true");
      pathEl.style.transition = "stroke-dashoffset 1s ease";
      requestAnimationFrame(() => {
        pathEl.setAttribute("stroke-dashoffset", "0");
      });
    });
  }, [paths]);

  const pathGenerator = pathGeneratorRef.current;

  return (
    <svg ref={svgRef} className="h-full w-full rounded" viewBox="0 0 400 400">
      {worldFeatures.map((f, idx) => (
        <path
          key={`land-${idx}`}
          d={pathGenerator(f as any) || undefined}
          fill="var(--muted)"
          stroke="var(--muted-foreground)"
          strokeWidth={0.5}
        />
      ))}
      {paths.map((p, idx) => (
        <path
          key={idx}
          className="activity-path"
          d={pathGenerator({ type: "LineString", coordinates: p.coordinates }) || undefined}
          fill="none"
          stroke={p.color || "var(--primary-foreground)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.8}
          style={{ transition: "stroke 0.3s ease" }}
          onMouseEnter={() => onPathMouseEnter?.(p)}
          onMouseLeave={() => onPathMouseLeave?.()}
        />
      ))}
    </svg>
  );
}
