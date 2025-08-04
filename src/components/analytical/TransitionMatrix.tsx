"use client";

import { useEffect, useRef } from "react";
import { chord, ribbon } from "d3-chord";
import { scaleOrdinal } from "d3-scale";
import { arc } from "d3-shape";
import { select } from "d3-selection";

interface TransitionMatrixProps {
  matrix: number[][];
  labels: string[];
  size?: number;
}

const defaultColors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export default function TransitionMatrix({ matrix, labels, size = 300 }: TransitionMatrixProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = select(ref.current);
    svg.selectAll("*").remove();

    const outerRadius = size / 2 - 10;
    const innerRadius = outerRadius - 10;

    const color = scaleOrdinal<string, string>()
      .domain(labels)
      .range(defaultColors);

    const layout = chord().padAngle(0.05).sortSubgroups(d3Descending)(matrix);

    const g = svg
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2},${size / 2})`);

    const group = g
      .append("g")
      .selectAll("g")
      .data(layout.groups)
      .enter()
      .append("g");

    const arcGen = arc().innerRadius(innerRadius).outerRadius(outerRadius);

    group
      .append("path")
      .attr("d", arcGen as any)
      .style("fill", (d) => color(labels[d.index]))
      .style("stroke", (d) => color(labels[d.index]));

    group
      .append("text")
      .each((d) => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dy", ".35em")
      .attr("transform", (d) => `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${outerRadius + 5})`)
      .style("text-anchor", (d) => (d.angle > Math.PI ? "end" : undefined))
      .text((d) => labels[d.index]);

    g
      .append("g")
      .attr("fill-opacity", 0.7)
      .selectAll("path")
      .data(layout)
      .enter()
      .append("path")
      .attr("d", ribbon().radius(innerRadius) as any)
      .style("fill", (d) => color(labels[d.target.index]))
      .style("stroke", (d) => color(labels[d.source.index]));
  }, [matrix, labels, size]);

  return <svg ref={ref} />;
}

function d3Descending(a: number, b: number) {
  return b - a;
}

