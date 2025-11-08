"use client";

import { useEffect, useRef } from "react";
import type { eventWithTime } from "@rrweb/types";
import "rrweb-player/dist/style.css";

interface SessionRecordingTestProps {
  className?: string;
  events: eventWithTime[];
}

export default function SessionReplay({
  className,
  events,
}: SessionRecordingTestProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReplay = async () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const rrwebPlayer = (await import("rrweb-player")).default;

    playerRef.current = new rrwebPlayer({
      target: containerRef.current!,
      props: {
        width: containerRef.current?.clientWidth,
        height: containerRef.current?.clientHeight,
        events: events,
        autoPlay: true,
        showWarning: false,
        showDebug: false,
        skipInactive: true,
        showController: true,
        speed: 1,
      },
    });
  };

  useEffect(() => {
    handleReplay();
  }, [events]);

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <div className="bg-muted px-4 py-2 border-b">
        <h4 className="text-sm font-medium">Session Replay</h4>
        <p className="text-xs text-muted-foreground">
          Duration:{" "}
          {events.length > 0
            ? `${Math.round((events[events.length - 1].timestamp - events[0].timestamp) / 1000)}s`
            : "0s"}
        </p>
      </div>
      <div
        ref={containerRef}
        id="replay-container"
        className="min-h-[400px] bg-white"
        style={{ width: "100%" }}
      />
    </div>
  );
}
