import { Button, Flex, Text } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import HeaderMenu from "./HeaderMenu";
import { JsonRpcSigner, ethers } from "ethers";
import { TbZoom } from "react-icons/tb";
import Search from "./Search";
import { truncateAddress } from "../utils/formatting";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  point: number;
}

const Header: FC<HeaderProps> = ({ signer, setSigner, point }) => {
  const navigator = useNavigate();

  const getSigner = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    setSigner(await provider.getSigner());
  };

  const onClickMetamaskLogin = async () => {
    try {
      getSigner();
      localStorage.setItem("isLogin", "true");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const localIsLogin = localStorage.getItem("isLogin");
    if (localIsLogin === "true") {
      getSigner();
    } else {
      localStorage.removeItem("isLogin");
    }
  }, []);

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      w="full"
      h="6vh"
      justifyContent="space-between"
      alignItems="center"
      fontWeight="bold"
      bgColor="gray.800"
      borderBottomColor="white"
      borderBottomWidth="2px"
      px={4}
      zIndex={3}
    >
      <Flex gap={2} position="relative">
        <Button
          bgColor="backgroundColor"
          w={220}
          fontSize="20px"
          textAlign="center"
          alignSelf="center"
          color="white"
          fontWeight="bold"
          _hover={{ bgColor: "backgroundColor" }}
          onClick={() => navigator("/")}
        >
          Minty Way
        </Button>
        <Search width="400px" placeholder="검색" />
        <Flex position="absolute" top={2} right={2}>
          <TbZoom color="teal" size="24px" />
        </Flex>
      </Flex>
      <Flex>
        {signer ? (
          <Flex alignItems="center" gap={4}>
            <Text color="#ffd700" fontWeight="bold" fontSize="18px">
              {point} 포인트
            </Text>
            <HeaderMenu
              text={truncateAddress(signer.address)}
              menuItem={["마이페이지", "로그아웃"]}
              setSigner={setSigner}
            />
          </Flex>
        ) : (
          <Button
            p={0}
            bgColor="teal"
            w="170px"
            _hover={{ bgColor: "teal.400" }}
            onClick={onClickMetamaskLogin}
          >
            <Text color="white" fontWeight="bold">
              지갑 연결
            </Text>
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
