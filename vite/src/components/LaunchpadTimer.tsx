import { FC } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useLaunchpadTimer } from "../hooks/useLaunchpadTimer";

interface LaunchpadTimerProps {
  launchpad: any;
}

const LaunchpadTimer: FC<LaunchpadTimerProps> = ({ launchpad }) => {
  const { timeLeft, getPhaseText } = useLaunchpadTimer(launchpad);

  const totalSeconds =
    timeLeft.days * 86400 +
    timeLeft.hours * 3600 +
    timeLeft.minutes * 60 +
    timeLeft.seconds;

  return (
    <Flex
      flexDir="column"
      h="100%"
      gap={8}
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDir="column" alignItems="center">
        <Text fontSize="28px" fontWeight="bold" mt={4}>
          {getPhaseText()}
        </Text>
        {totalSeconds > 0 && (
          <Flex justifyContent="center" gap={4} mt={4}>
            <Box bgColor="teal" p={4} borderRadius="xl" w={16} h={16}>
              <Text fontWeight="bold" fontSize="24px" textAlign="center">
                {timeLeft.days}
              </Text>
            </Box>
            <Box bgColor="teal" p={4} borderRadius="xl" w={16} h={16}>
              <Text fontWeight="bold" fontSize="24px" textAlign="center">
                {timeLeft.hours}
              </Text>
            </Box>
            <Box bgColor="teal" p={4} borderRadius="xl" w={16} h={16}>
              <Text fontWeight="bold" fontSize="24px" textAlign="center">
                {timeLeft.minutes}
              </Text>
            </Box>
            <Box bgColor="teal" p={4} borderRadius="xl" w={16} h={16}>
              <Text fontWeight="bold" fontSize="24px" textAlign="center">
                {timeLeft.seconds}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default LaunchpadTimer;
