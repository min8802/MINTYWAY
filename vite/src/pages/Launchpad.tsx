import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import Search from "../components/Search";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import LaunchpadTimerText from "../components/LaunchpadTimerText";

const Launchpad: FC = () => {
  const { launchpadList, setLaunchpadList } = useOutletContext<OutletContext>();
  const navigator = useNavigate();

  const handleLaunchpadClick = (
    tokenAddress: string,
    launchpad: ILaunchpad
  ) => {
    navigator(`/launchpad-detail/${tokenAddress}`, {
      state: {
        tokenAddress,
        launchpad,
      },
    });
  };

  useEffect(() => {
    const storedLaunchpadList = JSON.parse(
      localStorage.getItem("launchpadList") || "[]"
    );
    const reversedLaunchpadList = storedLaunchpadList.reverse();
    setLaunchpadList(reversedLaunchpadList);
  }, []);

  return (
    <Flex
      w="100%"
      h="85vh"
      p={4}
      my={8}
      mt={12}
      maxH="100vh"
      flexDir="column"
      justifyContent="flex-start"
      alignItems="center"
      bgColor="backgroundColor"
      color="white"
    >
      <Box
        w="80%"
        h="85vh"
        p={6}
        borderRadius="lg"
        bg="boxColor"
        boxShadow="lg"
        border="3px solid"
        borderColor="teal"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            런치패드
          </Text>
          <Search width="300px" placeholder="런치패드 검색" />
        </Flex>
        <Divider mb={4} borderColor="gray.600" />
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={8}
          justifyContent="center"
          alignItems="center"
          className="styled-scrollbar"
        >
          {launchpadList.map((launchpad, i) => (
            <GridItem key={i} w="100%" h="auto">
              <Flex
                flexDir="column"
                bgColor="boxColor"
                p={4}
                borderRadius="lg"
                alignItems="center"
                cursor="pointer"
                border="2px solid"
                borderColor="white"
                onClick={() =>
                  handleLaunchpadClick(launchpad.tokenAddress, launchpad)
                }
                _hover={{ bgColor: "gray.800", borderColor: "teal" }}
              >
                <Image
                  src={
                    typeof launchpad.image === "string"
                      ? launchpad.image
                      : undefined
                  }
                  alt={launchpad.name}
                  w="full"
                  h="200px"
                  objectFit="cover"
                  borderRadius="lg"
                  mb={4}
                />
                <Text fontWeight="bold" fontSize="28px" textAlign="center">
                  {launchpad.name}
                </Text>
                <LaunchpadTimerText launchpad={launchpad} />
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default Launchpad;
