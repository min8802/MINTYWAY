import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Box } from "@chakra-ui/react";
import CustomPieTooltip from "./CustomPieTooltip";

interface DataEntry {
  name: string;
  value: number;
  percentage: number;
}

interface HolderPieChartProps {
  holders: ITokenHolder[];
}

// const data: DataEntry[] = [
//   {
//     name: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
//     value: 300,
//     percentage: 300,
//   },
//   { name: "Group B", value: 280, percentage: 30.0 },
//   { name: "Group C", value: 120, percentage: 30.0 },
//   { name: "Group D", value: 70, percentage: 3.0 },
//   { name: "Group E", value: 60, percentage: 3.0 },
//   { name: "Group F", value: 30, percentage: 300 },
//   { name: "Group G", value: 20, percentage: 300 },
//   { name: "Group H", value: 10, percentage: 300 },
// ];

const Colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HolderPieChart: React.FC<HolderPieChartProps> = ({ holders }) => {
  const [data, setData] = useState<DataEntry[]>([]);

  useEffect(() => {
    const fetchPieChart = async () => {
      const mappedData = holders
        .map((holder) => ({
          name: holder.owner_address,
          value: Number(holder.balance_formatted),
          percentage: Number(holder.percentage_relative_to_total_supply),
        }))
        .slice(0, 10);

      console.log("mappedData: ", mappedData);
      setData(mappedData);
    };

    fetchPieChart();
  }, [holders]);

  return (
    <Box w="100%" h="100%">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={Colors[index % Colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default HolderPieChart;
