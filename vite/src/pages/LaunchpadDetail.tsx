import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  CopyAddressButton,
  ExternalDiscordButton,
  ExternalGithubButton,
  ExternalTelegramButton,
  ExternalWebsiterButton,
  ExternalWhitepaperButton,
  ExternalXButton,
} from "../utils/iconButtons";
import LaunchpadTimer from "../components/LaunchpadTimer";
import { OutletContext } from "../components/Layout";
import { formatDateInKorean } from "../utils/formatDateInKorean";
import useToastNotification from "../hooks/useToastNotification";
import {
  getSubscriberCount,
  isSubscribe,
  subscription,
  buyTicket,
  getTicketAmount,
  getBuyer,
  setLotteryResult,
  getIsExcuted,
  getIsWinner,
  getIsNonWinner,
  claim,
  refund,
} from "../scripts/launchpadContract";
import { getLotteryResult } from "../utils/random";

const LaunchpadDetail: FC = () => {
  const location = useLocation();
  const { tokenAddress, launchpad } = location.state;

  const { showToast } = useToastNotification();
  const { signer, step, setStep, point, setPoint } =
    useOutletContext<OutletContext>();
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [isSubscriber, setIsSubscriber] = useState<boolean>();
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const [ticketAmount, setTicketAmount] = useState<number>(0);
  const [totalTicketAmount, setTotalTicketAmount] = useState<number>(0);
  const [buyTicketLoading, setBuyTicketLoading] = useState(false);
  const [isExecuted, setIsExcuted] = useState<boolean>();
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const [now, setNow] = useState(() => new Date().getTime() + KST_OFFSET);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [isNonWinner, setIsNonWinner] = useState<boolean>(false);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [refundLoading, setRefundLoading] = useState<boolean>(false);

  const [github, setGithub] = useState<string>("");
  const [x, setX] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [whitepaper, setWhitepaper] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  useEffect(() => {
    if (!tokenAddress || !signer) return;

    const fetchData = async () => {
      setIsSubscriber(await isSubscribe(tokenAddress, signer.address));
      setSubscriberCount(await getSubscriberCount(tokenAddress));
      setIsExcuted(await getIsExcuted(tokenAddress));
      setTotalTicketAmount(
        Number(await getTicketAmount(tokenAddress, signer.address))
      );
    };

    const fetchLotteryResult = async () => {
      if (!isExecuted) return;
      setIsWinner(await getIsWinner(tokenAddress, signer.address));
      setIsNonWinner(await getIsNonWinner(tokenAddress, signer.address));
    };

    fetchData();
    fetchLotteryResult();
  }, [signer]);

  useEffect(() => {
    const token = tokenAddress;
    const savedLinks = JSON.parse(
      localStorage.getItem(`socialLinks_${token}`) || "{}"
    );
    if (savedLinks) {
      setGithub(savedLinks.github || "");
      setX(savedLinks.x || "");
      setTelegram(savedLinks.telegram || "");
      setDiscord(savedLinks.discord || "");
      setWhitepaper(savedLinks.whitepaper || "");
      setWebsite(savedLinks.website || "");
    }
  }, [tokenAddress]);

  const onClickSubscription = async () => {
    if (!tokenAddress || !signer || !launchpad) return;
    setSubscriptionLoading(true);

    if (point < 100) {
      // 미정
      showToast("포인트가 부족합니다.", "", "error");
      setSubscriptionLoading(false);
    } else {
      try {
        await subscription(signer.address, tokenAddress, point);
        setSubscriberCount(await getSubscriberCount(tokenAddress));
        setIsSubscriber(await isSubscribe(tokenAddress, signer.address));
        setPoint(point - 100);
        showToast("구독이 완료되었습니다.", "", "success");
      } catch (error) {
        console.error(error);
        showToast("이미 구독 중입니다.", "", "error");
      } finally {
        setSubscriptionLoading(false);
      }
    }
  };

  const onClickBuyTicket = async () => {
    if (!tokenAddress || !signer || !launchpad) return;
    setBuyTicketLoading(true);

    if (!isSubscriber) {
      showToast("구독자가 아닙니다..", "", "error");
      setBuyTicketLoading(false);
      return;
    }

    if (ticketAmount < 0) {
      showToast("잘못된 입력입니다.", "", "error");
      setBuyTicketLoading(false);
    } else {
      try {
        await buyTicket(
          tokenAddress,
          signer.address,
          launchpad.launchpadInfo.pricePerTicket,
          ticketAmount
        );
        setTotalTicketAmount(
          await getTicketAmount(tokenAddress, signer.address)
        );
        showToast(`${ticketAmount}장 구매되었습니다.`, "", "success");
      } catch (error) {
        console.error(error);
        showToast("금액이 부족합니다.", "", "error");
      } finally {
        setBuyTicketLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchTotalTicketAmount = async () => {
      if (!signer || !tokenAddress) return;

      setTotalTicketAmount(await getTicketAmount(tokenAddress, signer.address));
    };

    fetchTotalTicketAmount();
  }, [totalTicketAmount, signer, tokenAddress]);

  const onClickMax = () => {
    setTicketAmount(30); // 미정
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime() + KST_OFFSET);
    }, 1000);

    setIntervalId(interval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      now >= launchpad.lotteryStartTime + KST_OFFSET &&
      now < launchpad.lotteryEndTime + KST_OFFSET
    ) {
      const getBuyerList = async () => {
        if ((await getIsExcuted(tokenAddress)) || isExecuted) return;

        try {
          const buyerList = await getBuyer(tokenAddress);
          const { winners, nonWinners } = getLotteryResult(
            buyerList,
            launchpad.launchpadInfo.winningTickets
          );
          console.log(winners);
          console.log(nonWinners);
          await setLotteryResult(tokenAddress, winners, nonWinners);
        } catch (error) {
          console.error(error);
        }
      };

      getBuyerList();
    }

    if (now > launchpad.redemptionTime + KST_OFFSET && intervalId) {
      clearInterval(intervalId);
      handleLotteryResult();
    }
  }, [now]);

  useEffect(() => {
    console.log("launchpad : ", step);
    setStep(step);
  }, [step]);

  const handleLotteryResult = async () => {
    if (!tokenAddress || !signer) return;

    try {
      setIsWinner(await getIsWinner(tokenAddress, signer.address));
      setIsNonWinner(await getIsNonWinner(tokenAddress, signer.address));
    } catch (error) {
      console.log(error);
    }
  };

  const onClickClaim = async () => {
    if (!tokenAddress || !signer) return;

    try {
      setClaimLoading(true);
      await claim(tokenAddress);
      showToast("토큰 전송이 완료되었습니다.", "", "success");
      setIsWinner(false);
    } catch (error) {
      console.error(error);
      showToast("토큰 전송이 실패했습니다.", "", "error");
    } finally {
      setClaimLoading(false);
      setIsWinner(await getIsWinner(tokenAddress, signer.address));
    }
  };

  const onClickRefund = async () => {
    if (!tokenAddress || !signer) return;

    try {
      setRefundLoading(true);
      await refund(
        tokenAddress,
        signer.address,
        launchpad.launchpadInfo.pricePerTicket
      );
      showToast("ETH 환불이 완료되었습니다.", "", "success");
      setIsNonWinner(false);
    } catch (error) {
      console.error(error);
      showToast("ETH 환불이 실패했습니다.", "", "error");
    } finally {
      setRefundLoading(false);
      setIsNonWinner(await getIsNonWinner(tokenAddress, signer.address));
    }
  };

  const steps = [
    {
      title: "구독",
      StartTime: formatDateInKorean(launchpad.subscriptionStartTime),
      EndTime: formatDateInKorean(launchpad.subscriptionEndTime),
    },
    {
      title: "티켓 구매",
      StartTime: formatDateInKorean(launchpad.ticketStartTime),
      EndTime: formatDateInKorean(launchpad.ticketEndTime),
    },
    {
      title: "추첨",
      StartTime: formatDateInKorean(launchpad.lotteryStartTime),
      EndTime: formatDateInKorean(launchpad.lotteryEndTime),
    },
    {
      title: "토큰 분배",
      StartTime: formatDateInKorean(launchpad.redemptionTime),
    },
  ];

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    showToast(
      "주소 복사됨",
      "컨트랙트 주소가 클립보드에 복사되었습니다.",
      "success"
    );
  };

  return (
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
        w="60%"
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
          w="100%"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
        >
          <Stepper size="lg" colorScheme="teal" index={step} w="full" p={4}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>
                    <Text fontWeight="bold" color="white">
                      {step.title}
                    </Text>
                  </StepTitle>
                  <StepDescription>
                    <Text fontWeight="bold" color="white" fontSize="12px">
                      {step.StartTime}
                    </Text>
                    <Text fontWeight="bold" color="white" fontSize="12px">
                      {step.EndTime}
                    </Text>
                  </StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Divider mb={4} borderColor="gray.600" />
        </Flex>
        <Flex
          flexDir="column"
          h="100%"
          alignItems="center"
          justifyContent="center"
          gap={4}
          p={8}
          className="styled-scrollbar"
        >
          <Flex flexDir="column" gap={4} mt={32}>
            <Image
              src={launchpad.image}
              alt={launchpad.name}
              w="600px"
              h="auto"
              objectFit="contain"
              rounded="lg"
              mt={20}
            />
          </Flex>
          <Flex
            flexDir="column"
            justifyContent="space-between"
            w="full"
            gap={8}
          >
            <Flex justifyContent="space-between" mt={4}>
              <Text fontWeight="bold" fontSize="24px">
                {launchpad.name}
              </Text>
              <Flex gap={2}>
                {github && <ExternalGithubButton href={github} size="sm" />}
                {x && <ExternalXButton href={x} size="sm" />}
                {telegram && (
                  <ExternalTelegramButton href={telegram} size="sm" />
                )}
                {discord && <ExternalDiscordButton href={discord} size="sm" />}
                {whitepaper && (
                  <ExternalWhitepaperButton href={whitepaper} size="sm" />
                )}
                {website && <ExternalWebsiterButton href={website} size="sm" />}
              </Flex>
            </Flex>
            <Text w="full" fontWeight="bold" fontSize="20px">
              {launchpad.description}
            </Text>
          </Flex>
          <Divider my={4} borderColor="gray.600" />
          <Flex flexDir="column" w="full">
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
                  {launchpad.tokenAddress}
                </Text>
                <CopyAddressButton
                  address={launchpad.tokenAddress}
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
                  {launchpad.tokenAddress}
                </Text>
                <CopyAddressButton
                  address={launchpad.tokenAddress}
                  size="sm"
                  onCopy={handleCopyAddress}
                />
              </Flex>
            </Box>
          </Flex>
          <Grid
            w="full"
            templateColumns="repeat(2, 1fr)"
            gap={4}
            justifyContent="center"
            alignItems="center"
            h="40vh"
            mt={4}
          >
            <GridItem
              h="full"
              border="3px solid"
              borderColor="gray.600"
              borderRadius="lg"
            >
              <Text fontWeight="bold" fontSize="18px" p={2}>
                블록체인 네트워크
              </Text>
              <Divider borderColor="gray.600" />
              <Text fontWeight="bold" fontSize="24px" textAlign="center" p={4}>
                {launchpad.projectInfo.network}
              </Text>
            </GridItem>
            <GridItem
              h="full"
              border="3px solid"
              borderColor="gray.600"
              borderRadius="lg"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="18px" p={2}>
                  총 발행량
                </Text>
                <Text fontWeight="bold" fontSize="18px" p={2} color="gray.500">
                  {launchpad.symbol}
                </Text>
              </Flex>
              <Divider borderColor="gray.600" />
              <Text fontWeight="bold" fontSize="24px" textAlign="center" p={4}>
                {Number(launchpad.projectInfo.totalSupply).toLocaleString()}
              </Text>
            </GridItem>
          </Grid>
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
          </Flex>
          <Divider borderColor="gray.600" />
          <Flex
            flexDir="column"
            h="100%"
            gap={4}
            justifyContent="center"
            alignItems="center"
          >
            <LaunchpadTimer launchpad={launchpad} />
            {now >= launchpad.subscriptionStartTime + KST_OFFSET &&
              now < launchpad.subscriptionEndTime + KST_OFFSET && (
                <Button
                  bgColor="teal"
                  _hover={{ bgColor: "teal.400" }}
                  onClick={onClickSubscription}
                  isLoading={subscriptionLoading}
                  isDisabled={subscriptionLoading || isSubscriber}
                >
                  <Text color="white" fontWeight="bold" fontSize="24px" p={2}>
                    구독
                  </Text>
                </Button>
              )}
            {now >= launchpad.ticketStartTime + KST_OFFSET &&
              now < launchpad.ticketEndTime + KST_OFFSET && (
                <Flex
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                >
                  {isSubscribe ? (
                    <>
                      <Text
                        fontWeight="bold"
                        fontSize="20px"
                      >{`${totalTicketAmount}장 보유`}</Text>
                      <InputGroup w="90%" mx={12}>
                        <Input
                          placeholder="티켓 수"
                          variant="filled"
                          bgColor="gray.700"
                          _hover={{ bgColor: "gray.600" }}
                          _placeholder={{ color: "gray.400" }}
                          _focus={{ bgColor: "gray.600", borderColor: "teal" }}
                          color="white"
                          value={ticketAmount}
                          onChange={(e) =>
                            setTicketAmount(Number(e.target.value))
                          }
                        />
                        <Button
                          bgColor="teal"
                          _hover={{ bgColor: "teal.400" }}
                          onClick={onClickMax}
                        >
                          <Text color="white" fontWeight="bold">
                            MAX
                          </Text>
                        </Button>
                        <Button
                          bgColor="teal"
                          _hover={{ bgColor: "teal.400" }}
                          mb={8}
                          ml={4}
                          w={20}
                          onClick={onClickBuyTicket}
                          isDisabled={!isSubscribe}
                          isLoading={buyTicketLoading}
                        >
                          <Text color="white" fontWeight="bold">
                            구매
                          </Text>
                        </Button>
                      </InputGroup>
                    </>
                  ) : (
                    <Flex>
                      <Text>구독자가 아닙니다.</Text>
                    </Flex>
                  )}
                </Flex>
              )}
            {now >= launchpad.redemptionTime + KST_OFFSET && (
              <Flex gap={4}>
                {isWinner && (
                  <Button
                    bgColor="teal"
                    _hover={{ bgColor: "teal.400" }}
                    onClick={onClickClaim}
                    isLoading={claimLoading}
                    isDisabled={claimLoading}
                  >
                    <Text color="white" fontWeight="bold" fontSize="24px" p={2}>
                      토큰 받기
                    </Text>
                  </Button>
                )}
                {isNonWinner && (
                  <Button
                    bgColor="teal"
                    _hover={{ bgColor: "teal.400" }}
                    onClick={onClickRefund}
                    isLoading={refundLoading}
                    isDisabled={refundLoading}
                  >
                    <Text color="white" fontWeight="bold" fontSize="24px" p={2}>
                      환불 받기
                    </Text>
                  </Button>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={8}
          justifyContent="center"
          alignItems="center"
          h="40vh"
        >
          <GridItem
            h="full"
            border="3px solid"
            borderColor="teal"
            borderRadius="lg"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="18px" p={2}>
                토큰 당 가격
              </Text>
              <Text fontWeight="bold" fontSize="18px" p={2} color="gray.500">
                ETH
              </Text>
            </Flex>
            <Divider mb={4} borderColor="gray.600" />
            <Text fontWeight="bold" fontSize="24px" textAlign="center">
              {launchpad.launchpadInfo.pricePerToken > 1
                ? launchpad.launchpadInfo.pricePerToken.toLocaleString()
                : launchpad.launchpadInfo.pricePerToken}
            </Text>
          </GridItem>
          <GridItem
            h="full"
            border="3px solid"
            borderColor="teal"
            borderRadius="lg"
          >
            <Text fontWeight="bold" fontSize="18px" p={2}>
              토큰 풀
            </Text>
            <Divider mb={4} borderColor="gray.600" />
            <Text fontWeight="bold" fontSize="24px" textAlign="center">
              {Number(launchpad.launchpadInfo.tokenPool).toLocaleString()}
            </Text>
          </GridItem>
          <GridItem
            h="full"
            border="3px solid"
            borderColor="teal"
            borderRadius="lg"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="18px" p={2}>
                티켓 당 가격
              </Text>
              <Text fontWeight="bold" fontSize="18px" p={2} color="gray.500">
                ETH
              </Text>
            </Flex>
            <Divider mb={4} borderColor="gray.600" />
            <Text fontWeight="bold" fontSize="24px" textAlign="center">
              {launchpad.launchpadInfo.pricePerTicket > 1
                ? launchpad.launchpadInfo.pricePerTicket.toLocaleString()
                : launchpad.launchpadInfo.pricePerTicket}
            </Text>
          </GridItem>
          <GridItem
            h="full"
            border="3px solid"
            borderColor="teal"
            borderRadius="lg"
          >
            <Text fontWeight="bold" fontSize="18px" p={2}>
              당첨 티켓
            </Text>
            <Divider mb={4} borderColor="gray.600" />
            <Text fontWeight="bold" fontSize="24px" textAlign="center">
              {Number(launchpad.launchpadInfo.winningTickets).toLocaleString()}
            </Text>
          </GridItem>
          <GridItem
            h="full"
            border="3px solid"
            borderColor="teal"
            borderRadius="lg"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="18px" p={2}>
                총 모금액
              </Text>
            </Flex>
            <Divider mb={4} borderColor="gray.600" />
            <Text fontWeight="bold" fontSize="24px" textAlign="center">
              {Number(
                launchpad.launchpadInfo.totalRaisedAmount
              ).toLocaleString()}{" "}
            </Text>
          </GridItem>
          <GridItem
            h="full"
            border="3px solid"
            borderColor="teal"
            borderRadius="lg"
          >
            <Text fontWeight="bold" fontSize="18px" p={2}>
              참여자
            </Text>
            <Divider mb={4} borderColor="gray.600" />
            <Text fontWeight="bold" fontSize="24px" textAlign="center">
              {subscriberCount}
            </Text>
          </GridItem>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default LaunchpadDetail;
