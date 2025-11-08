import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { format } from "date-fns";

function CustomNode({ data, targetPosition, sourcePosition }: any) {
  const bgColor =
    data.eventType === "page_viewed"
      ? "bg-yellow-200"
      : data.eventType === "step_completed"
        ? "bg-blue-200"
        : data.eventType === "flow_completed"
          ? "bg-green-200"
          : data.eventType === "flow_started"
            ? "bg-purple-200"
            : data.eventType === "step_abandoned"
              ? "bg-red-400"
              : data.eventType === "step_skipped"
                ? "bg-yellow-400"
                : "bg-blue-200";
  const iconBg =
    data.eventType === "page_viewed"
      ? "bg-yellow-500"
      : data.eventType === "step_completed"
        ? "bg-blue-500"
        : data.eventType === "flow_completed"
          ? "bg-green-500"
          : data.eventType === "flow_started"
            ? "bg-purple-500"
            : data.eventType === "step_abandoned"
              ? "bg-red-500"
              : data.eventType === "step_skipped"
                ? "bg-yellow-500"
                : "bg-blue-500";
  const icon =
    data.eventType === "page_viewed"
      ? "👀"
      : data.eventType === "flow_started"
        ? "🚀"
        : "🔔";

  const borderColor =
    data.eventType === "page_viewed"
      ? "border-yellow-300"
      : data.eventType === "step_completed"
        ? "border-blue-300"
        : data.eventType === "flow_completed"
          ? "border-green-300"
          : data.eventType === "flow_started"
            ? "border-purple-300"
            : data.eventType === "step_abandoned"
              ? "border-red-300"
              : data.eventType === "step_skipped"
                ? "border-yellow-300"
                : "border-blue-300";

  return (
    <div
      className={`shadow-md rounded-md bg-white border-2 relative ${borderColor}`}
    >
      <Handle
        type="target"
        position={targetPosition || Position.Left}
        className="w-16 !bg-teal-500"
      />
      <div className={`w-[200px] h-[150px] overflow-hidden`}>
        <div
          className={`flex flex-col gap-2 ${bgColor} px-2 pt-4 pb-2 rounded-t-sm`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 ${iconBg} rounded-sm flex items-center justify-center text-white text-xs mr-2`}
            >
              {icon}
            </div>
            <div className="text-xs font-medium">
              {data?.step || data.eventType}
            </div>
          </div>
          <p className="text-xs text-gray-800 h-fit">
            {format(data.timestamp, "EEE do HH:mm:ss")}
          </p>
        </div>

        <div className="text-[10px] overflow-hidden p-4">
          {data.eventType === "step_abandoned" ? (
            <div className="flex flex-col gap-2 text-xs overflow-auto">
              <p className="">
                Abandoned: <strong>{data.step}</strong>
              </p>
              <p className="truncate">
                {JSON.stringify(data.properties, null, 2)}
              </p>
            </div>
          ) : (
            <p className="text-xs overflow-auto">
              {JSON.stringify(data.properties, null, 2)}
            </p>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
