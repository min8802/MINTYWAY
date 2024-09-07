import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import CreateTokenModal from "../components/CreateTokenModal";
import templateData from "../data/templateData.json";
import useToastNotification from "../hooks/useToastNotification";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

const CreateToken: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const { signer } = useOutletContext<OutletContext>();
  const { showToast } = useToastNotification();

  const handleCreateToken = () => {
    if (!signer) {
      showToast("지갑 연결 후 이용해주세요.", "", "error");
      return;
    }

    if (selectedTemplateIndex !== null) {
      onOpen();
    } else {
      alert("템플릿이 선택되지 않았습니다.");
    }
  };

  const handleBoxClick = (index: number) => {
    setSelectedTemplateIndex(index);
  };

  return (
    <>
      <Flex
        w="100%"
        h="85vh"
        p={4}
        my={8}
        mt={12}
        minH="100vh"
        flexDir="column"
        justifyContent="flex-start"
        alignItems="center"
        bgColor="backgroundColor"
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
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Text fontSize="2xl" fontWeight="bold">
              토큰 생성
            </Text>
            <Button
              bgColor="teal"
              w="170px"
              _hover={{ bgColor: "teal.400" }}
              onClick={handleCreateToken}
            >
              <Text color="white" fontWeight="bold" fontSize="20px">
                생성
              </Text>
            </Button>
          </Flex>
          <Divider mb={4} borderColor="gray.600" />
          <Grid templateColumns="repeat(12, 1fr)" mb={4}>
            <GridItem colSpan={2}>
              <Text fontSize="lg" fontWeight="bold" color="gray.400">
                토큰 이름
              </Text>
            </GridItem>
            <GridItem colSpan={2} ml={4}>
              <Text fontSize="lg" fontWeight="bold" color="gray.400">
                토큰 설명
              </Text>
            </GridItem>
          </Grid>
          <Divider mb={8} borderColor="white" />
          <Flex flexDir="column" gap={8}>
            {templateData.map((v, i) => (
              <Box
                key={i}
                w="full"
                h="200px"
                p="4"
                borderRadius="md"
                boxShadow="lg"
                border={`1px solid ${
                  selectedTemplateIndex === i ? "teal" : "white"
                }`}
                bgColor={selectedTemplateIndex === i ? "teal.800" : "boxColor"}
                cursor="pointer"
                onClick={() => handleBoxClick(i)}
                transition="background-color 0.3s ease"
              >
                <Flex h="full">
                  <Flex
                    w="20%"
                    justifyContent="center"
                    alignItems="center"
                    flexDir="column"
                  >
                    <Text fontSize="24px" fontWeight="bold">
                      {v.template}
                    </Text>
                    <Text fontSize="20px" fontWeight="bold">
                      {v.price}
                    </Text>
                  </Flex>
                  <Flex flexDir="column" w="full">
                    <Flex
                      h="40%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {v.properties.map((v, i) => (
                        <Text
                          key={i}
                          fontWeight="bold"
                          fontSize="20px"
                          borderBottom="2px"
                          borderColor="teal"
                          _focus={{ borderColor: "white" }}
                          p={2}
                        >
                          {v.key}
                        </Text>
                      ))}
                    </Flex>
                    <Flex
                      h="full"
                      border="2px"
                      borderColor="teal"
                      mt={4}
                      p={2}
                      rounded="md"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontWeight="bold" fontSize="20px">
                        어떤 사람들이 사용하는지에 대한 설명
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>
      <CreateTokenModal
        isOpen={isOpen}
        onClose={onClose}
        templateIndex={selectedTemplateIndex}
      />
    </>
  );
};

export default CreateToken;
