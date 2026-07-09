"use client";
import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";

// DONUT CHART 
export type DonutSegment = {
  label: string;
  value: number;
  color: string; 
  stroke: string;
};

type DonutChartProps = {
  data: DonutSegment[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
  thickness?: number;
  className?: string;
};

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  size = 160,
  thickness = 20,
  className,
}: DonutChartProps) {
  const id = useId();
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let offset = 0;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-800"
            strokeWidth={thickness}
          />
          {/* segments */}
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {total > 0 &&
              data.map((d, i) => {
                const fraction = d.value / total;
                const dash = fraction * circumference;
                const dashOffset = offset;
                offset += dash;
                return (
                  <motion.circle
                    key={`${id}-${d.label}-${i}`}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={d.stroke}
                    strokeWidth={thickness}
                    strokeLinecap="butt"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: -dashOffset + circumference }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ strokeDashoffset: -dashOffset }}
                  />
                );
              })}
          </g>
        </svg>
        {(centerLabel || centerValue != null) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue != null && (
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-[11px] text-gray-400 text-center px-2">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* legend */}
      <div className="w-full space-y-2">
        {data.map((d, i) => (
          <div key={`${d.label}-${i}`} className="flex items-center gap-2 text-xs">
            <span
              className={cn("w-2.5 h-2.5 rounded-full shrink-0", d.color)}
            />
            <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
              {d.label}
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TREND AREA / LINE CHART ────────────────────────────────────────────────

type TrendPoint = { label: string; value: number };

type TrendAreaChartProps = {
  data: TrendPoint[];
  height?: number;
  className?: string;
};

export function TrendAreaChart({
  data,
  height = 180,
  className,
}: TrendAreaChartProps) {
  const id = useId();
  if (!data.length) return null;

  const width = 100; // percent-based viewBox, scales with container
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = 0;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.value - min) / (max - min || 1)) * (height - 24) - 4;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill={`url(#${id}-fill)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={1.4}
            fill="var(--primary)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {points.map((p, i) => (
          <span
            key={i}
            className="text-[10px] text-gray-400 truncate"
            style={{ width: `${100 / points.length}%`, textAlign: "center" }}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
