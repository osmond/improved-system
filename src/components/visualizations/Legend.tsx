
interface LegendProps {
  minValue: number;
  maxValue: number;
  gradient: string;
}

export default function Legend({ minValue, maxValue, gradient }: LegendProps) {
  const ticks = [minValue, -0.5, 0, 0.5, maxValue]
    .filter((t, i, arr) => t >= minValue && t <= maxValue && arr.indexOf(t) === i);
  const range = maxValue - minValue || 1;

  return (
    <div className="mt-4 flex w-full flex-col items-center">
      <div className="relative h-2 w-64 rounded" style={{ background: gradient }}>
        {ticks.map((t) => (
          <div
            key={t}
            className="h-3 w-px bg-gray-700"
            style={{
              position: "absolute",
              top: "-0.25rem",
              left: `${((t - minValue) / range) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="mt-1 flex w-64 justify-between text-[10px] text-muted-foreground">
        {ticks.map((t) => (
          <span key={t}>{t.toFixed(1)}</span>
        ))}
      </div>
      <div className="mt-1 flex w-64 justify-between text-[10px] text-muted-foreground">
        <span>Strong Negative</span>
        <span>No Correlation</span>
        <span>Strong Positive</span>
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">Pearson r</div>
    </div>
  );
}

