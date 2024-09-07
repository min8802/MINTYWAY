import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";

const MyPage: FC = () => {
  const [myToken, setMyToken] = useState<IMyToken[]>([]);

  const tempMyToken = () => {
    setMyToken([
      ...myToken,
      {
        image: "../public/coin.png",
        name: "Name1",
        symbol: "Symbol1",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name2",
        symbol: "Symbol2",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name3",
        symbol: "Symbol3",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name4",
        symbol: "Symbol4",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name5",
        symbol: "Symbol5",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name6",
        symbol: "Symbol6",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name7",
        symbol: "Symbol7",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name8",
        symbol: "Symbol8",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name9",
        symbol: "Symbol9",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
      {
        image: "../public/coin.png",
        name: "Name10",
        symbol: "Symbol10",
        address: "0x3Af9E6986077D98d5cC492046460F8FCc629DF31",
      },
    ]);
  };

  useEffect(() => tempMyToken(), []);

  return (
    <Flex w="100%" h="85vh" p={4} justifyContent="center" my={8} mt={12}>
      <Flex bgColor="gray.700" flexDir="column" w="80%" p={4} borderRadius="md">
        <Flex justifyContent="space-between" alignItems="center" p={4} mb={2}>
          <Text color="white" fontSize="28px" fontWeight="bold">
            내 토큰
          </Text>
          <Input
            placeholder="내 토큰 검색"
            bgColor="gray.600"
            maxW="300px"
            borderColor="gray.700"
          />
        </Flex>
        <Divider />
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={4}
          w="100%"
          overflowY="auto"
          maxH="750px"
          mt={4}
          css={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-track": {
              background: "gray.700",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "teal",
              borderRadius: "6px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "teal",
            },
          }}
        >
          {myToken.map((v, i) => (
            <GridItem
              key={i}
              w="95%"
              h="150px"
              bg="gray.800"
              display="flex"
              alignItems="center"
              borderRadius="md"
              border="1px"
              borderColor="white"
              m={2}
            >
              <Button
                w="100%"
                h="100%"
                bg="gray.800"
                border="none"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                p={4}
                _hover={{ bgColor: "gray.700" }}
              >
                <Image src={v.image} alt="coin" w="70px" m={4} />
                <Flex flexDir="column">
                  <Flex>
                    <Text color="white" fontWeight="bold" fontSize="24px">
                      {v.name} ({v.symbol})
                    </Text>
                  </Flex>
                  <Text color="teal" fontWeight="bold" fontSize="20px">
                    {`${v.address.substring(0, 8)}...${v.address.substring(
                      v.address.length - 8
                    )}`}
                  </Text>
                </Flex>
              </Button>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default MyPage;
