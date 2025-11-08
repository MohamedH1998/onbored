"use client";

import { TrendDirection } from "@/typings";
import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  trendDirection?: TrendDirection;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  trendDirection,
  width = 60,
  height = 20,
  color = "#3b82f6",
  className,
}: SparklineProps) {
  const charData = (
    trendDirection === "up"
      ? Array.from({ length: 7 }, (_, index) => index + 1)
      : trendDirection === "down"
        ? Array.from({ length: 7 }, (_, index) => 7 - index)
        : Array.from({ length: 7 }, (_, index) => 0)
  ).map((value, index) => ({
    index,
    value,
  }));
  const isUpTrend = trendDirection === "up";
  const trendColor = isUpTrend ? "#10b981" : "#ef4444";

  return (
    <div className={`inline-block ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={charData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color || trendColor}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
