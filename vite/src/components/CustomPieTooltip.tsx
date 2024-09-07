import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { truncateAddress } from "../utils/formatting";

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; percentage: number }[];
}

const CustomPieTooltip: React.FC<CustomPieTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <Box
        w="full"
        bg="gray.700"
        border="2px"
        borderColor="teal"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
        <Text fontSize="lg" color="white" fontWeight="bold">
          {truncateAddress(payload[0].name)}
        </Text>
        <Text fontSize="md" color="white" fontWeight="bold">
          {payload[0].value.toLocaleString()} (
          {payload[0].percentage.toString().slice(0, 4)}
          %)
        </Text>
      </Box>
    );
  }

  return null;
};

export default CustomPieTooltip;
