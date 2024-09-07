import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { TbCaretDownFilled } from "react-icons/tb";
import Search from "../components/Search";
import { truncateAddress } from "../utils/formatting";
import useToastNotification from "../hooks/useToastNotification";
import dummyData from "../data/dummyData.json";
import { CopyAddressButton, ExternalLinkButton } from "../utils/iconButtons";
import { ethers } from "ethers";
import erc20PermissionsControlData from "../../artifacts/contracts/permissions/proPlan.sol/MintyWay_MintPro.json";

const c_addr = "0x54CB808BCE4F7580f00a6b4Fb97102D74eBfe35d"; // 컨트랙트 주소

const TokenManagement: React.FC = () => {
  const { showToast } = useToastNotification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedTokenName, setSelectedTokenName] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("");

  // mint, burn, freeze 등의 액션을 처리하는 함수
  async function handleTokenAction(
    action: string,
    userAddress: string,
    // toAddress: string,
    amount: string
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(
        "https://arb1.arbitrum.io/rpc"
      );
      const wallet = new ethers.Wallet(
        import.meta.env.VITE_ARBITRUM_PRIVATE_KEY!,
        provider
      );
      const contract = new ethers.Contract(
        c_addr,
        erc20PermissionsControlData.abi,
        wallet
      );

      let tx;
      switch (action) {
        case "Mint":
          tx = await contract.mint(
            userAddress,
            ethers.parseUnits(amount, "ether")
          );
          break;
        case "Burn":
          tx = await contract.burn(
            userAddress,
            ethers.parseUnits(amount, "ether")
          );
          break;
        case "Freeze":
          tx = await contract.freezeAccount(userAddress);
          break;
        case "Unfreeze":
          tx = await contract.unfreezeAccount(userAddress);
          break;
        case "Blacklist":
          tx = await contract.addToBlacklist(userAddress);
          break;
        case "Remove from Blacklist":
          tx = await contract.removeFromBlacklist(userAddress);
          break;
        case "Recover":
          tx = await contract.recover(
            userAddress,
            "0xd4D5F7c70c8eDa224eBb3f75146Be0529f6204E7",
            ethers.parseUnits(amount, "ether")
          );
          break;
        default:
          throw new Error("Unknown action type");
      }

      await tx.wait();
      showToast(
        "성공",
        `${action} 작업이 성공적으로 수행되었습니다.`,
        "success"
      );
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
      showToast("실패", `${action} 작업 중 오류가 발생했습니다.`, "error");
    } finally {
      onClose();
    }
  }

  const handleOpenActionModal = (tokenName: string, actionType: string) => {
    setSelectedTokenName(tokenName);
    setSelectedActionType(actionType);
    onOpen();
  };

  const handleExecuteAction = () => {
    handleTokenAction(selectedActionType, userAddress, amount);
  };

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
      my={8}
      mt={12}
      maxH="100vh"
      flexDir="column"
      justifyContent="flex-start"
      alignItems="center"
      bgColor="backgroundColor"
      color="white"
    >
      <Box
        w="80%"
        h="85vh"
        p={6}
        borderRadius="lg"
        bg="boxColor"
        boxShadow="lg"
        border="3px solid"
        borderColor="teal"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            토큰 관리
          </Text>
          <Search width="300px" placeholder="토큰 검색" />
        </Flex>
        <Divider mb={4} borderColor="gray.600" />
        <Box className="styled-scrollbar">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th w="15%" fontSize="md" fontWeight="bold" color="gray.400">
                  토큰 이름
                </Th>
                <Th w="25%" fontSize="md" fontWeight="bold" color="gray.400">
                  컨트랙트 주소
                </Th>
                <Th
                  w="40%"
                  textAlign="left"
                  fontSize="md"
                  fontWeight="bold"
                  color="gray.400"
                >
                  액션
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {dummyData.map((data, index) => (
                <Tr key={index} _hover={{ bg: "hoverColor" }}>
                  <Td>
                    <Flex alignItems="center">
                      <Image
                        src={data.imageUrl}
                        alt={`${data.tokenName} 이미지`}
                        borderRadius="full"
                        boxSize="40px"
                        mr={3}
                        _hover={{
                          transform: "scale(1.05)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                      />
                      <Text fontWeight="bold" color="white">
                        {data.tokenName}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex alignItems="center" gap={1}>
                      <Text
                        mr={2}
                        wordBreak="break-all"
                        color="teal.300"
                        fontWeight="bold"
                      >
                        {truncateAddress(data.contractAddress)}
                      </Text>
                      <CopyAddressButton
                        address={data.contractAddress}
                        size="sm"
                        onCopy={handleCopyAddress}
                      />
                      <ExternalLinkButton href={data.link} size="sm" />
                    </Flex>
                  </Td>
                  <Td textAlign="left">
                    {/* 토큰 관리 그룹 */}
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        colorScheme="teal"
                        variant="solid"
                        rightIcon={<TbCaretDownFilled />}
                        mr={2}
                        _hover={{ bg: "teal.600" }}
                      >
                        토큰 관리
                      </MenuButton>
                      <MenuList bgColor={"gray.700"} color="white">
                        {/* 토큰 관리 메뉴 */}
                        {[
                          ["Mint", "Burn"], // 첫 번째 그룹: Mint와 Burn
                          ["Recover"], // 두 번째 그룹: Recover
                        ].map((group, groupIndex) => (
                          <React.Fragment key={groupIndex}>
                            {group.map((actionType) => (
                              <MenuItem
                                key={actionType}
                                bgColor={"gray.700"}
                                _hover={{ bg: "teal.600" }}
                                onClick={() =>
                                  handleOpenActionModal(
                                    data.tokenName,
                                    actionType
                                  )
                                }
                              >
                                {actionType}
                                {/* 실행 */}
                              </MenuItem>
                            ))}
                            {groupIndex < 1 && <Divider />}{" "}
                            {/* 첫 번째 그룹 뒤에 구분선 추가 */}
                          </React.Fragment>
                        ))}
                      </MenuList>
                    </Menu>

                    {/* 사용자 관리 그룹 */}
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        colorScheme="teal"
                        variant="solid"
                        rightIcon={<TbCaretDownFilled />}
                        mr={2}
                        _hover={{ bg: "teal.600" }}
                      >
                        사용자 관리
                      </MenuButton>
                      <MenuList bgColor={"gray.700"} color="white">
                        {[
                          ["Freeze", "Unfreeze"],
                          ["Blacklist", "Remove from Blacklist"],
                        ].map((group, groupIndex) => (
                          <React.Fragment key={groupIndex}>
                            {group.map((actionType) => (
                              <MenuItem
                                key={actionType}
                                bgColor={"gray.700"}
                                _hover={{ bg: "teal.600" }}
                                onClick={() =>
                                  handleOpenActionModal(
                                    data.tokenName,
                                    actionType
                                  )
                                }
                              >
                                {actionType}
                                {/* 실행 */}
                              </MenuItem>
                            ))}
                            {groupIndex < 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* 액션 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTokenName} {selectedActionType} 실행
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="지갑 주소를 입력하세요"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
            {(selectedActionType === "Mint" ||
              selectedActionType === "Burn" ||
              selectedActionType === "Recover") && (
              <Input
                mt={4}
                placeholder="수량을 입력하세요"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleExecuteAction}>
              실행
            </Button>
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TokenManagement;
