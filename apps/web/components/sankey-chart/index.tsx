"use client";

import { useEffect, useRef, useState } from "react";
import { Sankey } from "recharts";

// TODO: Set correct types
export const SankeyChart = ({ data }: { data: any }) => {
  // @TODO: Add more colors
  const colors = ["#3C898E", "#486DF0", "#6F50E5"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    resize(); // set initial size

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(resize); // debounce with RAF
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const CustomNode = (props: any): React.ReactElement => (
    <rect
      x={props.x + 4}
      y={props.y - 2}
      width={props.width - 8}
      height={props.height + 4}
      fill={colors[props.payload.depth % colors.length]}
      rx={2.5}
    />
  );

  const CustomLink = (props: any) => {
    const { sourceX, targetX, sourceY, targetY, linkWidth, payload } = props;

    const xDistance = Math.abs(targetX - sourceX);
    const curvature = 0.3;
    const xCurve = xDistance * curvature;

    const d = `
      M${sourceX},${sourceY}
      C${sourceX + xCurve},${sourceY}
       ${targetX - xCurve},${targetY}
       ${targetX},${targetY}
    `;

    const labelY = sourceY + (targetY - sourceY) / 2 - linkWidth / 2;
    const isStrongFlow = linkWidth > 8;
    const bg = isStrongFlow ? "#ffffffdd" : "#f1f5fe80";

    return (
      <g>
        <path
          d={d}
          fill="none"
          stroke={colors[payload.source.depth % colors.length]}
          strokeOpacity={0.4}
          strokeWidth={linkWidth}
          strokeLinecap="butt"
        />
        <foreignObject
          x={Math.min(sourceX, targetX)}
          y={labelY}
          width={Math.max(20, xDistance)}
          height={linkWidth}
          style={{ overflow: "visible" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
              padding: "0.4em",
              fontSize: 10,
              fontFamily: "sans-serif",
              gap: 6,
            }}
          >
            <div
              style={{
                backgroundColor: bg,
                padding: "0.25em 0.5em",
                borderRadius: 4,
                whiteSpace: "nowrap",
                boxShadow: isStrongFlow ? "0 1px 4px rgba(0,0,0,0.05)" : "none",
              }}
            >
              {payload.target.name ? `${payload.target.name}: ` : ""}
              {payload.value}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: 400 }}>
      {dimensions.width > 0 && (
        <Sankey
          data={data}
          width={dimensions.width}
          height={dimensions.height}
          nodeWidth={16}
          nodePadding={14}
          margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
          sort={false}
          node={(props: any) => <CustomNode {...props} />}
          link={(props: any) => <CustomLink {...props} />}
        />
      )}
    </div>
  );
};
