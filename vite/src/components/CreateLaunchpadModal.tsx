import {
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerInput from "./DatePickerInput";
import useToastNotification from "../hooks/useToastNotification";
import { deployLaunchpadContract } from "../scripts/launchpadContract";
import { JsonRpcSigner } from "ethers";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

interface CreateLaunchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: IMyToken;
  onLaunchpadCreated: (launchpad: ILaunchpad) => void;
  signer: JsonRpcSigner | null;
}

const CreateLaunchpadModal: FC<CreateLaunchpadModalProps> = ({
  isOpen,
  onClose,
  token,
  onLaunchpadCreated,
  signer,
}) => {
  const { showToast } = useToastNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const [subscriptionStartTime, setSubscriptionStartTime] = useState<number>(
    Number(new Date())
  );
  const [subscriptionEndTime, setSubscriptionEndTime] = useState<number>(
    Number(new Date())
  );
  const [ticketStartTime, setTicketStartTime] = useState<number>(
    Number(new Date())
  );
  const [ticketEndTime, setTicketEndTime] = useState<number>(
    Number(new Date())
  );
  const [lotteryStartTime, setLotteryStartTime] = useState<number>(
    Number(new Date())
  );
  const [lotteryEndTime, setLotteryEndTime] = useState<number>(
    Number(new Date())
  );
  const [redemptionTime, setRedemptionTime] = useState<number>(
    Number(new Date())
  );

  const [subscriptionStartTimePickerOpen, setSubscriptionStartTimePickerOpen] =
    useState<boolean>(false);
  const [subscriptionEndTimePickerOpen, setSubscriptionEndTimePickerOpen] =
    useState<boolean>(false);
  const [ticketStartTimePickerOpen, setTicketStartTimePickerOpen] =
    useState<boolean>(false);
  const [ticketEndTimePickerOpen, setTicketEndTimePickerOpen] =
    useState<boolean>(false);
  const [lotteryStartTimePickerOpen, setLotteryStartTimePickerOpen] =
    useState<boolean>(false);
  const [lotteryEndTimePickerOpen, setLotteryEndTimePickerOpen] =
    useState<boolean>(false);
  const [redemptionTimePickerOpen, setRedemptionTimePickerOpen] =
    useState<boolean>(false);

  const [description, setDescription] = useState<string>("");
  const [pricePerToken, setPricePerToken] = useState<number>(0);
  const [tokenPool, setTokenPool] = useState<number>(0);
  const [pricePerTicket, setPricePerTicket] = useState<number>(0);
  const [winningTickets, setWinningTickets] = useState<number>(0);
  const [totalRaisedAmount, setTotalRaisedAmount] = useState<number>(0);

  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleSubscriptionStartTimeClick = () => {
    setSubscriptionStartTimePickerOpen(true);
  };

  const handleSubscriptionStartTimeChange = (date: number) => {
    setSubscriptionStartTime(date);
    setSubscriptionEndTime(date);
    setSubscriptionStartTimePickerOpen(false);
  };

  const handleSubscriptionEndTimeClick = () => {
    setSubscriptionEndTimePickerOpen(true);
  };

  const handleSubscriptionEndTimeChange = (date: number) => {
    setSubscriptionEndTime(date);
    setTicketStartTime(date);
    setSubscriptionEndTimePickerOpen(false);
  };

  const handleTicketStartTimeClick = () => {
    setTicketStartTimePickerOpen(true);
  };

  const handleTicketStartTimeChange = (date: number) => {
    setTicketStartTime(date);
    setTicketEndTime(date);
    setTicketStartTimePickerOpen(false);
  };

  const handleTicketEndTimeClick = () => {
    setTicketEndTimePickerOpen(true);
  };

  const handleTicketEndTimeChange = (date: number) => {
    setTicketEndTime(date);
    setLotteryStartTime(date);
    setTicketEndTimePickerOpen(false);
  };

  const handleLotteryStartTimeClick = () => {
    setLotteryStartTimePickerOpen(true);
  };

  const handleLotteryStartTimeChange = (date: number) => {
    setLotteryStartTime(date);
    setLotteryEndTime(date);
    setLotteryStartTimePickerOpen(false);
  };

  const handleLotteryEndTimeClick = () => {
    setLotteryEndTimePickerOpen(true);
  };

  const handleLotteryEndTimeChange = (date: number) => {
    setLotteryEndTime(date);
    setRedemptionTime(date);
    setLotteryEndTimePickerOpen(false);
  };

  const handleRedemptionTimeClick = () => {
    setRedemptionTimePickerOpen(true);
  };

  const handleRedemptionTimeChange = (date: number) => {
    setRedemptionTime(date);
    setRedemptionTimePickerOpen(false);
  };

  const datePickers = [
    {
      label: "구독 시작 시간",
      selectedDate: subscriptionStartTime,
      onChange: handleSubscriptionStartTimeChange,
      pickerOpen: subscriptionStartTimePickerOpen,
      onClickPicker: handleSubscriptionStartTimeClick,
      onClosePicker: () => setSubscriptionStartTimePickerOpen(false),
      minDate: new Date(),
      minTime: new Date(),
    },
    {
      label: "구독 종료 시간",
      selectedDate: subscriptionEndTime,
      onChange: handleSubscriptionEndTimeChange,
      pickerOpen: subscriptionEndTimePickerOpen,
      onClickPicker: handleSubscriptionEndTimeClick,
      onClosePicker: () => setSubscriptionEndTimePickerOpen(false),
      minDate: new Date(subscriptionStartTime),
      minTime: new Date(subscriptionStartTime),
    },
    {
      label: "티켓 구매 시작 시간",
      selectedDate: ticketStartTime,
      onChange: handleTicketStartTimeChange,
      pickerOpen: ticketStartTimePickerOpen,
      onClickPicker: handleTicketStartTimeClick,
      onClosePicker: () => setTicketStartTimePickerOpen(false),
      minDate: new Date(subscriptionEndTime),
      minTime: new Date(subscriptionEndTime),
    },
    {
      label: "티켓 구매 종료 시간",
      selectedDate: ticketEndTime,
      onChange: handleTicketEndTimeChange,
      pickerOpen: ticketEndTimePickerOpen,
      onClickPicker: handleTicketEndTimeClick,
      onClosePicker: () => setTicketEndTimePickerOpen(false),
      minDate: new Date(ticketStartTime),
      minTime: new Date(ticketStartTime),
    },
    {
      label: "추첨 시작 시간",
      selectedDate: lotteryStartTime,
      onChange: handleLotteryStartTimeChange,
      pickerOpen: lotteryStartTimePickerOpen,
      onClickPicker: handleLotteryStartTimeClick,
      onClosePicker: () => setLotteryStartTimePickerOpen(false),
      minDate: new Date(ticketEndTime),
      minTime: new Date(ticketEndTime),
    },
    {
      label: "추첨 종료 시간",
      selectedDate: lotteryEndTime,
      onChange: handleLotteryEndTimeChange,
      pickerOpen: lotteryEndTimePickerOpen,
      onClickPicker: handleLotteryEndTimeClick,
      onClosePicker: () => setLotteryEndTimePickerOpen(false),
      minDate: new Date(lotteryStartTime),
      minTime: new Date(lotteryStartTime),
    },
    {
      label: "토큰 분배 시간",
      selectedDate: redemptionTime,
      onChange: handleRedemptionTimeChange,
      pickerOpen: redemptionTimePickerOpen,
      onClickPicker: handleRedemptionTimeClick,
      onClosePicker: () => setRedemptionTimePickerOpen(false),
      minDate: new Date(lotteryEndTime),
      minTime: new Date(lotteryEndTime),
    },
  ];

  const renderDatePickers = (pickers: IDatePicker[]) =>
    pickers.map((picker, index) => (
      <DatePickerInput
        key={index}
        label={picker.label}
        selectedDate={picker.selectedDate}
        onChange={picker.onChange}
        pickerOpen={picker.pickerOpen}
        onClickPicker={picker.onClickPicker}
        onClosePicker={picker.onClosePicker}
        minDate={picker.minDate}
        minTime={picker.minTime}
      />
    ));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setSelectedImage(imageUrl);
        setSelectedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const onClickCreateLaunchpad = async () => {
    if (!signer) return;

    setLoading(true);
    if (
      !description ||
      !selectedImage ||
      tokenPool <= 0 ||
      winningTickets <= 0 ||
      totalRaisedAmount <= 0
    ) {
      showToast("모든 필드를 올바르게 입력해 주세요.", "", "error");
      setLoading(false);
      return;
    }

    const newLaunchpad: ILaunchpad = {
      tokenAddress: token.token_address,
      name: token.name,
      symbol: token.symbol,
      description,
      image: selectedImage,
      subscriptionStartTime,
      subscriptionEndTime,
      ticketStartTime,
      ticketEndTime,
      lotteryStartTime,
      lotteryEndTime,
      redemptionTime,
      projectInfo: {
        network: "Arbitrum",
        totalSupply: token.total_supply,
      },
      launchpadInfo: {
        pricePerToken,
        tokenPool,
        pricePerTicket,
        winningTickets,
        totalRaisedAmount,
        participants: 0,
      },
    };

    try {
      const launchpadAddress = await deployLaunchpadContract(
        newLaunchpad,
        newLaunchpad.launchpadInfo.tokenPool
      );
      console.log(`Launchpad deployed at address: ${launchpadAddress}`);
    } catch (error) {
      console.error("Error deploying Launchpad:", error);
      showToast(
        "런치패드 생성이 실패했습니다.",
        "다시 시도해 주세요.",
        "error"
      );
    }

    const storedLaunchpadList = JSON.parse(
      localStorage.getItem("launchpadList") || "[]"
    );
    const updatedLaunchpadList = [...storedLaunchpadList, newLaunchpad];
    localStorage.setItem("launchpadList", JSON.stringify(updatedLaunchpadList));
    onLaunchpadCreated(newLaunchpad);
    setLoading(false);
    showToast("런치패드 생성이 완료되었습니다.", "", "success");
    onClose();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setDescription("");
    setTokenPool(0);
    setWinningTickets(0);
    setTotalRaisedAmount(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent
        bgColor="boxColor"
        border="3px solid"
        borderColor="teal"
        borderRadius="xl"
        className="styled-scrollbar"
        maxHeight="900px"
      >
        <ModalBody>
          <Flex flexDir="column">
            <ModalHeader fontSize="32px" color="white" textAlign="center">
              런치패드 생성
            </ModalHeader>
            <ModalCloseButton mt={4} mr={2} color="teal" fontSize="28px" />
          </Flex>
          <Divider mb={4} borderColor="gray.600" />
          <Flex justifyContent="center" gap={2}>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex h="40px" justifyContent="start" alignItems="center">
                <Text fontWeight="bold" fontSize="20px">
                  토큰 이름
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="토큰 이름"
                value={token.name}
                isDisabled={true}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  토큰 심볼
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="토큰 심볼"
                value={token.symbol}
                isDisabled={true}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  토큰 이미지
                </Text>
              </Flex>
              <Button
                as="label"
                htmlFor="file-upload"
                bgColor="backgroundColor"
                color="white"
                p={4}
                borderRadius="md"
                textAlign="center"
                h="50px"
                border="2px solid"
                borderColor="gray.300"
                _hover={{ bgColor: "gray.600" }}
              >
                <Text fontSize="20px" fontWeight="bold">
                  {selectedFileName || "파일 선택"}
                </Text>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  display="none"
                />
              </Button>
            </Flex>
          </Flex>
          <Flex justifyContent="center" gap={2}>
            <Flex flexDir="column" color="white" p={4} w="full">
              <Flex h="40px" justifyContent="start" alignItems="center">
                <Text fontWeight="bold" fontSize="20px">
                  프로젝트 설명
                </Text>
              </Flex>
              <Textarea
                fontWeight="bold"
                fontSize="20px"
                placeholder="프로젝트에 대한 설명을 적어주세요."
                onChange={(e) => setDescription(e.target.value)}
                _focus={{
                  border: "2px solid",
                  borderColor: "teal",
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="center" gap={2}>
            {renderDatePickers(datePickers.slice(0, 2))}
          </Flex>
          <Flex justifyContent="center" gap={2}>
            {renderDatePickers(datePickers.slice(2, 4))}
          </Flex>
          <Flex justifyContent="center" gap={2}>
            {renderDatePickers(datePickers.slice(4, 7))}
          </Flex>
          <Flex justifyContent="center" gap={2}>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex h="40px" justifyContent="start" alignItems="center">
                <Text fontWeight="bold" fontSize="20px">
                  블록체인 네트워크
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="블록체인 네트워크"
                value="Arbitrum"
                isDisabled={true}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  총 발행량
                </Text>
              </Flex>
              <Input
                fontSize="20px"
                fontWeight="bold"
                placeholder="총 발행량"
                value={Number(token.total_supply).toLocaleString()}
                isDisabled={true}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
                gap={2}
              >
                <Text fontWeight="bold" fontSize="20px">
                  토큰 당 가격
                </Text>
                <Tooltip
                  label="목표 모금액 / 토큰 풀"
                  fontSize="lg"
                  border="3px solid"
                  borderColor="teal"
                  bgColor="backgroundColor"
                  rounded="md"
                  placement="top"
                  fontWeight="bold"
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="토큰 당 가격"
                value={
                  totalRaisedAmount !== 0 && tokenPool !== 0
                    ? totalRaisedAmount / tokenPool
                    : ""
                }
                isDisabled={true}
                onChange={(e) => setPricePerToken(Number(e.target.value))}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="center" gap={2}>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex h="40px" justifyContent="start" alignItems="center" gap={2}>
                <Text fontWeight="bold" fontSize="20px">
                  토큰 풀
                </Text>
                <Tooltip
                  label="나눠줄 토큰의 양"
                  fontSize="xl"
                  border="3px solid"
                  borderColor="teal"
                  bgColor="backgroundColor"
                  rounded="md"
                  placement="top"
                  fontWeight="bold"
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="토큰 풀"
                onChange={(e) => setTokenPool(Number(e.target.value))}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
                gap={2}
              >
                <Text fontWeight="bold" fontSize="20px">
                  티켓 당 가격
                </Text>
                <Tooltip
                  label="목표 모금액 / 당첨 티켓 수"
                  fontSize="xl"
                  border="3px solid"
                  borderColor="teal"
                  bgColor="backgroundColor"
                  rounded="md"
                  placement="top"
                  fontWeight="bold"
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="티켓 당 가격"
                onChange={(e) => setPricePerTicket(Number(e.target.value))}
                h="50px"
                isDisabled={true}
                value={
                  totalRaisedAmount !== 0 && winningTickets !== 0
                    ? totalRaisedAmount / winningTickets
                    : ""
                }
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
                gap={2}
              >
                <Text fontWeight="bold" fontSize="20px">
                  당첨 티켓
                </Text>
                <Tooltip
                  label="당첨될 티켓의 수"
                  fontSize="xl"
                  border="3px solid"
                  borderColor="teal"
                  bgColor="backgroundColor"
                  rounded="md"
                  placement="top"
                  fontWeight="bold"
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="당첨 티켓"
                onChange={(e) => setWinningTickets(Number(e.target.value))}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="center" gap={2}>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex h="40px" justifyContent="start" alignItems="center" gap={2}>
                <Text fontWeight="bold" fontSize="20px">
                  목표 모금액
                </Text>
                <Tooltip
                  label="모금할 금액"
                  fontSize="xl"
                  border="3px solid"
                  borderColor="teal"
                  bgColor="backgroundColor"
                  rounded="md"
                  placement="top"
                  fontWeight="bold"
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="목표 모금액"
                onChange={(e) => setTotalRaisedAmount(Number(e.target.value))}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="41%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  참여자
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="참여자"
                isDisabled={true}
                value={0}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
          </Flex>
        </ModalBody>
        <Flex my={4} justifyContent="center">
          <Button
            bgColor="teal"
            _hover={{ bgColor: "teal.400" }}
            w="93%"
            onClick={onClickCreateLaunchpad}
            isLoading={loading}
            isDisabled={loading}
          >
            <Text color="white" fontSize="20px" fontWeight="bold">
              런치패드 생성
            </Text>
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreateLaunchpadModal;
