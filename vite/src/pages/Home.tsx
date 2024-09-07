import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import NewTokenCard from "../components/NewTokenCard";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const [imageSrc, setImageSrc] = useState("../public/token_create.webp");
  const navigator = useNavigate();

  return (
    <Flex w="100%" h="94vh" flexDir="column" bgColor="backgroundColor">
      <Flex
        flexGrow={0.8}
        borderBottomColor="dark-gray"
        borderBottomWidth="2px"
      >
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          flexGrow={0.75}
          p={4}
        >
          <Text
            w="100%"
            textAlign="center"
            alignSelf="center"
            width="800px"
            mb={12}
            color="white"
            fontWeight="bold"
            fontSize="20px"
          >
            <Text fontSize="100px" fontWeight="bold" mb={16} color="white">
              Minty Way
            </Text>
            <Box as="span" color="teal.400" fontSize="20px" fontWeight="bold">
            손쉽게 ERC20 토큰을 생성하세요!
            </Box>{" "}
            스마트 계약을 통해 맞춤형 코인을 생성하고 블록체인 네트워크에
                배포할 수 있습니다{" "}
            <Box as="span" color="teal.400" fontSize="20px" fontWeight="bold">
            토큰 프로젝트를 MintyWay 플랫폼에서 선보이세요!
            </Box>{" "}
            프로젝트를 초기 투자자들에게 성공적으로 소개하고 빠르게 토큰
                세일을 시작할 수 있습니다
          </Text>

          <Button
            background="none"
            p={0}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
            onMouseOver={() => setImageSrc("../public/token_create2.webp")}
            onMouseOut={() => setImageSrc("../public/token_create.webp")}
            onClick={() => navigator("/createToken")}
          >
            <Image
              src={imageSrc}
              alt="token_create"
              w="250px"
              position="relative"
            />
            <Text
              color="white"
              position="absolute"
              fontSize="30px"
              fontWeight="bold"
            >
              토큰 생성
            </Text>
          </Button>
        </Flex>
        <Flex flexGrow={0.3} justifyContent="center" alignItems="center">
          <Image
            src="../public/coin.png"
            alt="coin"
            width="400px"
            height="400px"
            mr={12}
            className="animated-image"
          />
        </Flex>
      </Flex>
      <Flex
        flexGrow={0.2}
        justifyContent="center"
        alignItems="center"
        gap={4}
        p={4}
      >
        <NewTokenCard />
      </Flex>
    </Flex>
  );
};

export default Home;
