import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomAreaTooltip from "./CustomAreaTooltip";

interface DataEntry {
  name: string;
  uv: number;
}

const data: DataEntry[] = [
  { name: "2024-08-01", uv: 0 },
  { name: "2024-08-02", uv: 10 },
  { name: "2024-08-03", uv: 40 },
  { name: "2024-08-04", uv: 100 },
  { name: "2024-08-05", uv: 180 },
  { name: "2024-08-06", uv: 220 },
  { name: "2024-08-07", uv: 240 },
  { name: "2024-08-08", uv: 280 },
  { name: "2024-08-09", uv: 320 },
  { name: "2024-08-10", uv: 350 },
  { name: "2024-08-11", uv: 400 },
];

const HolderAreaChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 14, right: 7, left: -50, bottom: -10 }}
      >
        <XAxis dataKey="name" tick={false} />
        <YAxis tick={false} />
        <Tooltip content={<CustomAreaTooltip />} />
        <Area type="monotone" dataKey="uv" stroke="teal" fill="#00C49F" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HolderAreaChart;
