"use client";
import { ResponsiveFunnel } from "@nivo/funnel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const FunnelChart = ({ data }: { data: any }) => (
  <AspectRatio ratio={16 / 9} className="rounded-lg">
    <ResponsiveFunnel
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      valueFormat=">-.4s"
      colors={{ scheme: "category10" }}
      borderWidth={20}
      labelColor={{ from: "color", modifiers: [["darker", 3]] }}
      beforeSeparatorLength={100}
      beforeSeparatorOffset={20}
      afterSeparatorLength={100}
      afterSeparatorOffset={20}
      currentPartSizeExtension={10}
      currentBorderWidth={40}
      direction="horizontal"
    />
  </AspectRatio>
);

export default FunnelChart;
