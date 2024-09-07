import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Image,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { TbCircleX, TbCircleCheck, TbArrowBigRight } from "react-icons/tb";
import {
  CopyAddressButton,
  ExternalDiscordButton,
  ExternalGithubButton,
  ExternalLinkButton,
  ExternalRightArrowButton,
  ExternalTelegramButton,
  ExternalWebsiterButton,
  ExternalWhitepaperButton,
  ExternalXButton,
} from "../utils/iconButtons";
import useToastNotification from "../hooks/useToastNotification";
import HolderPieChart from "../components/HolderPieChart";
import HolderAreaChart from "../components/HolderAreaChart";
import { OutletContext } from "../components/Layout";
import CreateLaunchpadModal from "../components/CreateLaunchpadModal";
import LaunchpadTimer from "../components/LaunchpadTimer";
import { getTokenHolders, startMoralis } from "../lib/moralis";
import { TbEdit } from "react-icons/tb";
import SocialLinkEditModal from "../components/SocialLinkEditModal";

const TokenDetail: FC = () => {
  const location = useLocation();
  const token = location.state;
  const { showToast } = useToastNotification();
  const { launchpadList, setLaunchpadList, setStep, signer } =
    useOutletContext<OutletContext>();
  const {
    isOpen: isLaunchpadModalOpen,
    onOpen: onLaunchpadModalOpen,
    onClose: onLaunchpadModalClose,
  } = useDisclosure();
  const {
    isOpen: isSocialLinkModalOpen,
    onOpen: onSocialLinkModalOpen,
    onClose: onSocialLinkModalClose,
  } = useDisclosure();
  const [hasTokenAddress, setHasTokenAddress] = useState<boolean>(false);
  const [launchpad, setLaunchpad] = useState<ILaunchpad | null>();
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [holderLoading, setHolderLoading] = useState<boolean>(false);
  const [holders, setHolders] = useState<ITokenHolder[]>([]);
  const navigate = useNavigate();

  const [github, setGithub] = useState<string>("");
  const [x, setX] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [whitepaper, setWhitepaper] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  const [foundToken, setFoundToken] = useState<IToken>();

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    showToast(
      "주소 복사됨",
      "컨트랙트 주소가 클립보드에 복사되었습니다.",
      "success"
    );
  };

  useEffect(() => {
    const storedLaunchpadList = JSON.parse(
      localStorage.getItem("launchpadList") || "[]"
    );
    setLaunchpadList(storedLaunchpadList);

    const storedNewTokenList = JSON.parse(
      localStorage.getItem("newTokens") || "[]"
    );

    console.log("storedNewTokens: ", storedNewTokenList);

    const foundToken = storedNewTokenList.find((storedToken: IToken) => {
      return (
        storedToken.tokenAddress.toLocaleLowerCase() === token.token_address
      );
    });
    setFoundToken(foundToken);
    console.log("foundToken : ", foundToken);
  }, []);

  useEffect(() => {
    const foundLaunchpad = launchpadList.find(
      (launchpad) => launchpad.tokenAddress === token.token_address
    );

    if (foundLaunchpad) {
      setLaunchpad(foundLaunchpad);
      setHasTokenAddress(true);
      setTokenAddress(foundLaunchpad.tokenAddress);
    } else {
      setLaunchpad(null);
      setHasTokenAddress(false);
    }
  }, [launchpadList]);

  useEffect(() => console.log(hasTokenAddress), [hasTokenAddress]);

  const updateLaunchpadList = (newLaunchpad: ILaunchpad) => {
    setLaunchpadList([...launchpadList, newLaunchpad]);
    setLaunchpad(newLaunchpad);
    setStep(0);
    setHasTokenAddress(true);
  };

  const onClickLaunchpad = async () => {
    navigate(`/launchpad-detail/${tokenAddress}`, {
      state: {
        tokenAddress,
        launchpad,
      },
    });
  };

  useEffect(() => {
    if (!token.token_address) return;

    const fetchHolder = async () => {
      try {
        setHolderLoading(true);
        await startMoralis();
        setHolders(await getTokenHolders(token.token_address));
      } catch (error) {
        console.error(error);
      } finally {
        setHolderLoading(false);
      }
    };

    fetchHolder();
  }, [tokenAddress]);

  return (
    <>
      <Flex
        w="100%"
        h="85vh"
        p={4}
        justifyContent="center"
        alignItems="center"
        my={8}
        mt={12}
        maxH="100vh"
        color="white"
        gap={8}
      >
        <Flex
          w="50%"
          h="82vh"
          borderRadius="lg"
          bgColor="boxColor"
          boxShadow="lg"
          border="3px solid"
          borderColor="teal"
          flexDir="column"
          position="relative"
        >
          <Flex
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Image
              position="absolute"
              top={-12}
              alt={token.name}
              border="4px"
              borderColor="teal"
              borderRadius="full"
              w="120px"
              h="120px"
            />
            <Text fontWeight="bold" fontSize="24px" mt={20}>
              {token.name}
            </Text>
            <Text fontWeight="bold" fontSize="18px">
              {token.balance.toLocaleString()} {token.symbol}
            </Text>
          </Flex>
          <Flex position="absolute" top={4} right={8} gap={2}>
            <IconButton
              aria-label="Open Edit"
              icon={<TbEdit size="20px" />}
              size="md"
              variant="ghost"
              borderColor="teal"
              border="1px"
              colorScheme="teal"
              onClick={onSocialLinkModalOpen}
            />
            <ExternalLinkButton href={token.token_address} size="md" />
          </Flex>
          <Flex
            gap={2}
            justifyContent="end"
            mr={8}
            position="absolute"
            top={4}
            left={8}
          >
            {github && <ExternalGithubButton href={github} size="md" />}
            {x && <ExternalXButton href={x} size="md" />}
            {telegram && <ExternalTelegramButton href={telegram} size="md" />}
            {discord && <ExternalDiscordButton href={discord} size="md" />}
            {whitepaper && (
              <ExternalWhitepaperButton href={whitepaper} size="md" />
            )}
            {website && <ExternalWebsiterButton href={website} size="md" />}
          </Flex>
          <Divider mt={4} borderColor="gray.600" />
          <Flex
            flexDir="column"
            h="100%"
            alignItems="center"
            justifyContent="center"
            gap={4}
            p={8}
          >
            <Box
              w="100%"
              bgColor="gray.800"
              p={4}
              border="2px"
              borderColor="teal"
              borderRadius="md"
              mt={4}
            >
              <Text fontWeight="bold" fontSize="20px" mb={2}>
                토큰 주소
              </Text>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" fontSize="24px">
                  {token.token_address}
                </Text>
                <CopyAddressButton
                  address={token.token_address}
                  size="sm"
                  onCopy={handleCopyAddress}
                />
              </Flex>
            </Box>
            <Box
              w="100%"
              bgColor="gray.800"
              p={4}
              border="2px"
              borderColor="teal"
              borderRadius="md"
              mt={4}
            >
              <Text fontWeight="bold" fontSize="20px" mb={2}>
                Owner 주소
              </Text>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" fontSize="24px">
                  {foundToken?.token.tokenOwner}
                </Text>
                <CopyAddressButton
                  address={token.contractAddress}
                  size="sm"
                  onCopy={handleCopyAddress}
                />
              </Flex>
            </Box>
            <Flex gap={6} alignItems="center">
              <Flex flexDir="column" gap={1}>
                <Flex
                  flexDir="column"
                  justifyContent="center"
                  w="270px"
                  h="125px"
                  bgColor="gray.800"
                  p={4}
                  border="2px"
                  borderColor="teal"
                  borderRadius="md"
                  mt={4}
                >
                  <Text fontWeight="bold" fontSize="20px" mb={2}>
                    발행량
                  </Text>
                  <Text fontWeight="bold" fontSize="24px">
                    5,423,123
                  </Text>
                </Flex>
                <Flex
                  flexDir="column"
                  justifyContent="center"
                  w="270px"
                  h="125px"
                  bgColor="gray.800"
                  p={4}
                  border="2px"
                  borderColor="teal"
                  borderRadius="md"
                  mt={4}
                >
                  <Text fontWeight="bold" fontSize="20px" mb={2}>
                    최대 발행량
                  </Text>
                  <Text fontWeight="bold" fontSize="24px">
                    {Number(token.total_supply).toLocaleString()}
                  </Text>
                </Flex>
              </Flex>
              <Box
                w="270px"
                h="fit-content"
                bgColor="gray.800"
                p={4}
                border="2px"
                borderColor="teal"
                borderRadius="md"
                mt={4}
              >
                <Text fontWeight="bold" fontSize="20px" mb={2}>
                  홀더 비율
                </Text>
                {holderLoading ? (
                  <Flex h="200px" justifyContent="center" alignItems="center">
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="teal"
                      size="xl"
                    />
                  </Flex>
                ) : (
                  <HolderPieChart holders={holders} />
                )}
              </Box>
              <Box
                w="270px"
                h="fit-content"
                bgColor="gray.800"
                p={4}
                border="2px"
                borderColor="teal"
                borderRadius="md"
                mt={4}
              >
                <Text fontWeight="bold" fontSize="20px" mb={2}>
                  홀더 수
                </Text>
                <Flex w="full" h="200px">
                  <HolderAreaChart />
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir="column" w="25%" gap={6}>
          <Flex
            h="40vh"
            p={4}
            borderRadius="lg"
            bgColor="boxColor"
            boxShadow="lg"
            border="3px solid"
            borderColor="teal"
            flexDir="column"
          >
            <Flex alignItems="center" justifyContent="space-between" mb={4}>
              <Text fontSize="24px" fontWeight="bold">
                런치패드
              </Text>
              {launchpad && (
                <Button
                  w="10px"
                  h="fit-content"
                  bgColor="transparent"
                  onClick={onClickLaunchpad}
                >
                  <IconButton
                    aria-label="Open Website"
                    icon={<TbArrowBigRight size="20px" />}
                    variant="ghost"
                    borderColor="teal"
                    border="1px"
                    size="md"
                    colorScheme="teal"
                  />
                </Button>
              )}
            </Flex>
            <Divider borderColor="gray.600" />
            <Flex
              flexDir="column"
              h="100%"
              gap={8}
              justifyContent="center"
              alignItems="center"
            >
              {hasTokenAddress ? (
                <LaunchpadTimer launchpad={launchpad} />
              ) : (
                <Flex flexDir="column" alignItems="center" gap={4}>
                  <Text fontSize="28px" fontWeight="bold">
                    미진행
                  </Text>
                  <Button
                    bgColor="teal"
                    _hover={{ bgColor: "teal.400" }}
                    onClick={onLaunchpadModalOpen}
                  >
                    <Text fontSize="28px" fontWeight="bold" color="white" p={4}>
                      런치패드 생성
                    </Text>
                  </Button>
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex
            h="40vh"
            p={4}
            borderRadius="lg"
            bgColor="boxColor"
            boxShadow="lg"
            border="3px solid"
            borderColor="teal"
            flexDir="column"
            justifyContent="space-between"
          >
            <Flex flexDir="column">
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <Text fontSize="24px" fontWeight="bold">
                  토큰 권한
                </Text>
                <ExternalRightArrowButton
                  href={`${window.location.origin}/permissions`}
                  size="md"
                />
              </Flex>
              <Divider borderColor="gray.600" />
            </Flex>

            <Flex
              w="full"
              bgColor="gray.800"
              border="2px"
              borderColor="teal"
              justifyContent="space-between"
              borderRadius="md"
              p={4}
            >
              <Flex alignItems="center" gap={2}>
                <Icon as={TbCircleX} color="red" boxSize="32px" />
                <Text fontSize="24px" fontWeight="bold" color="white">
                  Mint
                </Text>
              </Flex>
              <Text fontSize="24px" fontWeight="bold" color="white">
                권한 있음
              </Text>
            </Flex>
            <Flex
              w="full"
              bgColor="gray.800"
              border="2px"
              borderColor="teal"
              justifyContent="space-between"
              borderRadius="md"
              p={4}
            >
              <Flex alignItems="center" gap={2}>
                <Icon as={TbCircleX} color="red" boxSize="32px" />
                <Text fontSize="24px" fontWeight="bold" color="white">
                  Owner
                </Text>
              </Flex>
              <Text fontSize="24px" fontWeight="bold" color="white">
                권한 있음
              </Text>
            </Flex>
            <Flex
              w="full"
              bgColor="gray.800"
              border="2px"
              borderColor="teal"
              justifyContent="space-between"
              borderRadius="md"
              p={4}
            >
              <Flex alignItems="center" gap={2}>
                <Icon as={TbCircleCheck} color="green" boxSize="32px" />
                <Text fontSize="24px" fontWeight="bold" color="white">
                  Freeze
                </Text>
              </Flex>
              <Text fontSize="24px" fontWeight="bold" color="white">
                권한 없음
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <CreateLaunchpadModal
        isOpen={isLaunchpadModalOpen}
        onClose={onLaunchpadModalClose}
        token={token}
        onLaunchpadCreated={updateLaunchpadList}
        signer={signer}
      />
      <SocialLinkEditModal
        tokenAddress={token.token_address}
        isOpen={isSocialLinkModalOpen}
        onClose={onSocialLinkModalClose}
        github={github}
        setGithub={setGithub}
        x={x}
        setX={setX}
        telegram={telegram}
        setTelegram={setTelegram}
        discord={discord}
        setDiscord={setDiscord}
        whitepaper={whitepaper}
        setWhitepaper={setWhitepaper}
        website={website}
        setWebsite={setWebsite}
      />
    </>
  );
};

export default TokenDetail;
