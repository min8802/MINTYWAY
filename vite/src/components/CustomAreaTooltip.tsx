import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface CustomAreaTooltipProps {
  active?: boolean;
  payload?: {
    payload: { name: string; uv: number };
  }[];
}

const CustomAreaTooltip: React.FC<CustomAreaTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const { name, uv } = payload[0].payload;

    return (
      <Box
        bg="gray.700"
        border="2px"
        borderColor="teal"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
        <Text fontSize="lg" color="white" fontWeight="bold">
          {name}
        </Text>
        <Text fontSize="md" color="white" fontWeight="bold">
          {uv}
        </Text>
      </Box>
    );
  }

  return null;
};

export default CustomAreaTooltip;
