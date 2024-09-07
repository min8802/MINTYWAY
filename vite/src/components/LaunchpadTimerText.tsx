import { FC } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useLaunchpadTimer } from "../hooks/useLaunchpadTimer";

interface LaunchpadTimerTextProps {
  launchpad: any;
}

const LaunchpadTimerText: FC<LaunchpadTimerTextProps> = ({ launchpad }) => {
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
      <Flex alignItems="center" gap={16}>
        <Text fontSize="20px" fontWeight="bold" mt={4}>
          {getPhaseText()}
        </Text>
        {totalSeconds > 0 && (
          <Flex justifyContent="center" mt={4} gap={2}>
            <Text fontWeight="bold" fontSize="20px" textAlign="center">
              {timeLeft.days}일
            </Text>
            <Text fontWeight="bold" fontSize="20px" textAlign="center">
              {timeLeft.hours}시간
            </Text>
            <Text fontWeight="bold" fontSize="20px" textAlign="center">
              {timeLeft.minutes}분
            </Text>
            <Text fontWeight="bold" fontSize="20px" textAlign="center">
              {timeLeft.seconds}초
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default LaunchpadTimerText;
