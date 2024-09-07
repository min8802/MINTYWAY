import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  Box,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import Search from "../components/Search";
import { truncateAddress } from "../utils/formatting";
import useToastNotification from "../hooks/useToastNotification";
// import dummyData from "../data/dummyData.json";
import { CopyAddressButton } from "../utils/iconButtons";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getWalletTokens, startMoralis } from "../lib/moralis";
import { OutletContext } from "../components/Layout";

const MyPage: FC = () => {
  const { showToast } = useToastNotification();
  const navigate = useNavigate();
  const { signer } = useOutletContext<OutletContext>();
  const [tokens, setTokens] = useState<IMyToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    showToast(
      "주소 복사됨",
      "컨트랙트 주소가 클립보드에 복사되었습니다.",
      "success"
    );
  };

  const onClickToken = (token: IMyToken) => {
    navigate(`/token/${token.token_address}`, { state: token });
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (signer?.address) {
        try {
          setLoading(true);
          await startMoralis();
          const tokens = await getWalletTokens(signer.address);
          setTokens(tokens);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTokens();
  }, [signer]);

  return (
    <Flex
      w="100%"
      h="85vh"
      p={4}
      justifyContent="center"
      alignItems="center"
      my={8}
      mt={12}
      minH="100vh"
      color="white"
    >
      <Box
        w="80%"
        h="100vh"
        p={6}
        borderRadius="lg"
        bgColor="boxColor"
        boxShadow="lg"
        border="3px solid"
        borderColor="teal"
      >
        {loading ? (
          <Flex justifyContent="center" alignItems="center" w="full" h="full">
            <Text color="white" fontWeight="bold" fontSize="40px">
              Loading...
            </Text>
          </Flex>
        ) : (
          <>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Text color="white" fontSize="2xl" fontWeight="bold">
                내 토큰
              </Text>
              <Search width="300px" placeholder="토큰 검색" />
            </Flex>
            <Divider mb={4} borderColor="gray.600" />
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={0}
              w="100%"
              mt={4}
              className="styled-scrollbar"
            >
              {tokens.map((v, i) => (
                <GridItem
                  key={i}
                  w="95%"
                  bg="backgroundColor"
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
                    bg="backgroundColor"
                    border="none"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    p={4}
                    _hover={{ bgColor: "hoverColor" }}
                    onClick={() => onClickToken(v)}
                  >
                    <Image
                      src={v.logo}
                      alt="coin"
                      w="70px"
                      m={4}
                      borderRadius="full"
                    />
                    <Flex flexDir="column">
                      <Flex>
                        <Text color="white" fontWeight="bold" fontSize="24px">
                          {v.name}
                        </Text>
                      </Flex>
                      <Flex alignItems="center" gap={2} mt={2}>
                        <Text color="teal" fontWeight="bold" fontSize="20px">
                          {truncateAddress(v.token_address)}
                        </Text>
                        <CopyAddressButton
                          address={v.token_address}
                          size="sm"
                          onCopy={handleCopyAddress}
                        />
                      </Flex>
                    </Flex>
                    <Flex w="full" justifyContent="end" alignSelf="flex-end">
                      <Text color="white" textAlign="end" mb={1}>
                        {Number(v.balance).toLocaleString()} {v.symbol}
                      </Text>
                    </Flex>
                  </Button>
                </GridItem>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default MyPage;
