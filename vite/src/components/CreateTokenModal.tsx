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
} from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import templateData from "../data/templateData.json";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "./Layout";
import useToastNotification from "../hooks/useToastNotification";
import { getCreateTokenContract } from "../scripts/createTokenContract";

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateIndex: number;
}

const CreateTokenModal: FC<CreateTokenModalProps> = ({
  isOpen,
  onClose,
  templateIndex,
}) => {
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [initialSupply, setInitialSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const { signer } = useOutletContext<OutletContext>();
  const [tokenOwner, setTokenOwner] = useState<string | undefined>(
    signer?.address
  );
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToastNotification();

  useEffect(() => {
    if (templateIndex === 0) {
      setTotalSupply(initialSupply);
    }
  }, [initialSupply, templateIndex]);

  useEffect(() => {
    handleClose();
  }, [signer]);

  const handleClose = () => {
    setInitialSupply(0);
    setTotalSupply(0);
    onClose();
    setTokenOwner(signer?.address);
  };

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

  const handleTokenCreation = (
    // newToken: INewToken,
    // newTokenAddress: string,
    templateIndex: number
  ) => {
    // const token: IToken = {
    //   tokenAddress: newTokenAddress,
    //   token: newToken,
    // };

    // const storedNewTokenList = JSON.parse(
    //   localStorage.getItem("newTokens") || "[]"
    // );

    // const updateNewTokenList = [...storedNewTokenList, token]; // 새 토큰 객체 저장
    // localStorage.setItem("newTokens", JSON.stringify(updateNewTokenList));

    showToast(
      `${templateData[templateIndex].template} 생성이 완료되었습니다.`,
      "",
      "success"
    );

    onClose();
    console.log(templateIndex)
  };

  const onClickCreateToken = async () => {
    if (!signer) return;
    setLoading(true);

    if (
      !selectedImage ||
      !name ||
      !symbol ||
      initialSupply < 0 ||
      totalSupply < 0 ||
      !tokenOwner
    ) {
      showToast("모든 필드를 올바르게 입력해 주세요.", "", "error");
      setLoading(false);
      return
    }

    const newToken: INewToken = {
      name,
      symbol,
      image: selectedImage,
      initialSupply,
      totalSupply,
      tokenOwner,
    };

    try {
      const newTokenAddress = await getCreateTokenContract(
        newToken,
        templateIndex
      );
      if(!newTokenAddress) return;
      handleTokenCreation(templateIndex);
    } catch (error) {
      console.error(error);
      showToast(
        "프로 토큰 생성이 실패했습니다.",
        "다시 시도해 주세요.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent
        bgColor="boxColor"
        border="3px solid"
        borderColor="teal"
        borderRadius="xl"
      >
        <Flex flexDir="column">
          <ModalHeader fontSize="32px" color="white" textAlign="center">
            {templateData[templateIndex].template}
          </ModalHeader>
          <ModalCloseButton mt={4} mr={2} color="teal" fontSize="28px" />
        </Flex>

        <Divider mb={4} borderColor="gray.600" />
        <ModalBody>
          <Flex flexDir="column" gap={4}>
            <Flex justifyContent="center" gap={2}>
              <Flex flexDir="column" color="white" p={4} w="25%">
                <Flex h="40px" justifyContent="start" alignItems="center">
                  <Text fontWeight="bold" fontSize="20px">
                    토큰 이름
                  </Text>
                </Flex>
                <Input
                  fontSize="24px"
                  fontWeight="bold"
                  placeholder="토큰 이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  h="50px"
                  _focus={{
                    bgColor: "gray.700",
                    borderColor: "teal",
                    boxShadow: "none",
                  }}
                />
              </Flex>
              <Flex flexDir="column" color="white" p={4} w="25%">
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
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  h="50px"
                  _focus={{
                    bgColor: "gray.700",
                    borderColor: "teal",
                    boxShadow: "none",
                  }}
                />
              </Flex>
              <Flex flexDir="column" color="white" p={4} w="34%">
                <Flex
                  w="45%"
                  h="40px"
                  justifyContent="start"
                  alignItems="center"
                  borderRadius="md"
                >
                  <Text fontWeight="bold" fontSize="20px">
                    토큰 로고
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
            <Flex justifyContent="center" gap={8}>
              <Flex flexDir="column" p={4} w="85%">
                <Flex flexDir="column" alignItems="start" mb={2} gap={1}>
                  <Text fontWeight="bold" fontSize="20px" color="white">
                    초기 토큰 발행량
                  </Text>
                  <Text fontWeight="bold" fontSize="16px" color="gray.400">
                    초기 토큰 발행량에 대한 설명
                  </Text>
                </Flex>
                <Input
                  fontSize="24px"
                  fontWeight="bold"
                  placeholder="토큰 초기 발행량"
                  h="50px"
                  color="white"
                  onChange={(e) => {
                    // const value = Number(e.target.value) || "";
                    setInitialSupply(Number(e.target.value));
                    if (templateIndex === 0) {
                      setTotalSupply(Number(e.target.value));
                    }
                  }}
                  _focus={{
                    bgColor: "gray.700",
                    borderColor: "teal",
                    boxShadow: "none",
                  }}
                />
              </Flex>
            </Flex>
            <Flex justifyContent="center" gap={8}>
              <Flex flexDir="column" p={4} w="85%">
                <Flex flexDir="column" alignItems="start" mb={2} gap={1}>
                  <Text fontWeight="bold" fontSize="20px" color="white">
                    총 토큰 발행량
                  </Text>
                  <Text fontWeight="bold" fontSize="16px" color="gray.400">
                    총 토큰 발행량에 대한 설명
                  </Text>
                </Flex>
                <Input
                  fontSize="24px"
                  fontWeight="bold"
                  placeholder="총 토큰 발행량"
                  h="50px"
                  color="white"
                  value={totalSupply === 0 ? "" : totalSupply}
                  onChange={(e) => {
                    if (templateIndex !== 0) {
                      setTotalSupply(Number(e.target.value));
                    }
                  }}
                  isDisabled={templateIndex === 0}
                  _focus={{
                    bgColor: "gray.700",
                    borderColor: "teal",
                    boxShadow: "none",
                  }}
                />
              </Flex>
            </Flex>
            <Flex justifyContent="center" gap={8}>
              <Flex flexDir="column" p={4} w="85%">
                <Flex flexDir="column" alignItems="start" mb={2} gap={1}>
                  <Text fontWeight="bold" fontSize="20px" color="white">
                    토큰 Owner
                  </Text>
                  <Text fontWeight="bold" fontSize="16px" color="gray.400">
                    토큰 Owner에 대한 설명
                  </Text>
                </Flex>
                <Input
                  fontSize="24px"
                  fontWeight="bold"
                  h="50px"
                  color="white"
                  value={tokenOwner}
                  placeholder="Owner 주소"
                  onChange={(e) => setTokenOwner(e.target.value)}
                  isDisabled={templateIndex === 0}
                  _focus={{
                    bgColor: "gray.700",
                    borderColor: "teal",
                    boxShadow: "none",
                  }}
                />
              </Flex>
            </Flex>
            {templateIndex !== 0 && (
              <Flex justifyContent="center" gap={8}>
                <Flex p={4} w="85%">
                  <Flex
                    flexDir="column"
                    alignItems="start"
                    mb={2}
                    gap={1}
                    w="50%"
                  >
                    <Text fontWeight="bold" fontSize="20px" color="white">
                      Mintable
                    </Text>
                    <Text fontWeight="bold" fontSize="16px" color="gray.400">
                      Mintable에 대한 설명
                    </Text>
                  </Flex>
                  <Flex
                    flexDir="column"
                    alignItems="start"
                    mb={2}
                    gap={1}
                    w="50%"
                  >
                    <Text fontWeight="bold" fontSize="20px" color="white">
                      Burnable
                    </Text>
                    <Text fontWeight="bold" fontSize="16px" color="gray.400">
                      Burnable에 대한 설명
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
            {templateIndex === 2 && (
              <Flex justifyContent="center" gap={8}>
                <Flex p={4} w="85%">
                  <Flex
                    flexDir="column"
                    alignItems="start"
                    mb={2}
                    gap={1}
                    w="40%"
                  >
                    <Text fontWeight="bold" fontSize="20px" color="white">
                      Freeze
                    </Text>
                    <Text fontWeight="bold" fontSize="16px" color="gray.400">
                      Freeze에 대한 설명
                    </Text>
                  </Flex>
                  <Flex
                    flexDir="column"
                    alignItems="start"
                    mb={2}
                    gap={1}
                    w="40%"
                  >
                    <Text fontWeight="bold" fontSize="20px" color="white">
                      Blacklist
                    </Text>
                    <Text fontWeight="bold" fontSize="16px" color="gray.400">
                      Blacklist에 대한 설명
                    </Text>
                  </Flex>
                  <Flex
                    flexDir="column"
                    alignItems="start"
                    mb={2}
                    gap={1}
                    w="40%"
                  >
                    <Text fontWeight="bold" fontSize="20px" color="white">
                      Recover
                    </Text>
                    <Text fontWeight="bold" fontSize="16px" color="gray.400">
                      Recover에 대한 설명
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Flex>

          <Flex my={4} justifyContent="center">
            <Button
              bgColor="teal"
              _hover={{ bgColor: "teal.400" }}
              w="82%"
              onClick={onClickCreateToken}
              isLoading={loading}
              isDisabled={loading}
            >
              <Text color="white" fontSize="20px" fontWeight="bold">
                토큰 생성
              </Text>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateTokenModal;
