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
import { Dispatch, FC, SetStateAction, useEffect } from "react";

interface SocialLinkEditModalProps {
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  github: string;
  setGithub: Dispatch<SetStateAction<string>>;
  x: string;
  setX: Dispatch<SetStateAction<string>>;
  telegram: string;
  setTelegram: Dispatch<SetStateAction<string>>;
  discord: string;
  setDiscord: Dispatch<SetStateAction<string>>;
  whitepaper: string;
  setWhitepaper: Dispatch<SetStateAction<string>>;
  website: string;
  setWebsite: Dispatch<SetStateAction<string>>;
}

const SocialLinkEditModal: FC<SocialLinkEditModalProps> = ({
  tokenAddress,
  isOpen,
  onClose,
  github,
  setGithub,
  x,
  setX,
  telegram,
  setTelegram,
  discord,
  setDiscord,
  whitepaper,
  setWhitepaper,
  website,
  setWebsite,
}) => {
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

  const handleSaveSocialLinks = () => {
    const token = tokenAddress;
    const links = {
      github,
      x,
      telegram,
      discord,
      whitepaper,
      website,
    };
    localStorage.setItem(`socialLinks_${token}`, JSON.stringify(links));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent
        bgColor="boxColor"
        border="3px solid"
        borderColor="teal"
        borderRadius="xl"
      >
        <Flex flexDir="column">
          <ModalHeader fontSize="32px" color="white" textAlign="center">
            소셜 링크
          </ModalHeader>
          <ModalCloseButton mt={4} mr={2} color="teal" fontSize="28px" />
        </Flex>
        <Divider mb={4} borderColor="gray.600" />
        <ModalBody>
          <Flex
            flexDir="column"
            gap={4}
            justifyContent="center"
            alignItems="center"
          >
            <Flex flexDir="column" color="white" p={4} w="100%">
              <Flex h="40px" justifyContent="start" alignItems="center">
                <Text fontWeight="bold" fontSize="20px">
                  깃허브 주소
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="깃허브 주소"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="100%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  X 주소
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="X 주소"
                value={x}
                onChange={(e) => setX(e.target.value)}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="100%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  텔레그램 주소
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="텔레그램 주소"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                h="50px"
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="100%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  디스코드 주소
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="디스코드 주소"
                h="50px"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="100%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  백서 주소
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="백서 주소"
                h="50px"
                value={whitepaper}
                onChange={(e) => setWhitepaper(e.target.value)}
                _focus={{
                  bgColor: "gray.700",
                  borderColor: "teal",
                  boxShadow: "none",
                }}
              />
            </Flex>
            <Flex flexDir="column" color="white" p={4} w="100%">
              <Flex
                w="45%"
                h="40px"
                justifyContent="start"
                alignItems="center"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="20px">
                  웹사이트 주소
                </Text>
              </Flex>
              <Input
                fontSize="24px"
                fontWeight="bold"
                placeholder="웹 사이트 주소"
                h="50px"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
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
            w="92%"
            onClick={handleSaveSocialLinks}
          >
            <Text color="white" fontSize="20px" fontWeight="bold">
              저장
            </Text>
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default SocialLinkEditModal;
