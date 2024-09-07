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

// Permissions 타입 정의
type Permissions = {
  mint?: boolean;
  burn?: boolean;
  freeze?: boolean;
  blacklist?: boolean;
  recover?: boolean;
  owner?: boolean;
};

const c_addr = "0x64871D2A24ABFC920E9463fd531245697f4daE01"; // 현재는 하드코딩이지만 사용자의 목록을 읽어올 때 바뀌어야 함

const isPermissionGranted = (
  permissions: Permissions,
  roleType: string
): boolean => {
  return permissions[roleType.toLowerCase() as keyof Permissions] === true;
};

const Permissions: React.FC = () => {
  const { showToast } = useToastNotification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRevokeModalOpen,
    onOpen: onRevokeModalOpen,
    onClose: onRevokeModalClose,
  } = useDisclosure();
  const [userAddress, setUserAddress] = useState("");
  const [selectedTokenName, setSelectedTokenName] = useState(""); // 상태 초기화
  const [selectedRoleType, setSelectedRoleType] = useState("");

  async function handleRoleAction(
    action: string,
    roleType: string,
    tokenName: string,
    userAddress: string
  ) {
    if (!tokenName || !roleType) {
      console.error("Token name or role type is missing");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(
        "https://arb1.arbitrum.io/rpc"
      );
      const wallet = new ethers.Wallet(
        import.meta.env.VITE_ARBITRUM_PRIVATE_KEY!,
        provider
      );
      const contractAddress = c_addr;
      const contract = new ethers.Contract(
        contractAddress,
        erc20PermissionsControlData.abi,
        wallet
      );

      let tx;
      if (action === "Give") {
        switch (roleType) {
          case "발행권한":
            tx = await contract.addMinter(userAddress);
            break;
          case "소각권한":
            tx = await contract.addBurner(userAddress);
            break;
          case "동결권한":
            tx = await contract.addFreezer(userAddress);
            break;
          case "블랙리스트권한":
            tx = await contract.addBlacklistManager(userAddress);
            break;
          case "복구권한":
            tx = await contract.addRecoverer(userAddress);
            break;
          default:
            throw new Error("Unknown role type");
        }
        await tx.wait();
        console.log(
          `${tokenName} ${roleType} role given to address: ${userAddress}`
        );
        showToast(
          "성공",
          `${tokenName}의 ${roleType} 권한이 ${userAddress}에게 부여되었습니다.`,
          "success"
        );
      } else if (action === "Remove") {
        switch (roleType) {
          case "발행권한":
            tx = await contract.removeMinter(userAddress);
            break;
          case "소각권한":
            tx = await contract.removeBurner(userAddress);
            break;
          case "동결권한":
            tx = await contract.removeFreezer(userAddress);
            break;
          case "블랙리스트권한":
            tx = await contract.removeBlacklistManager(userAddress);
            break;
          case "복구권한":
            tx = await contract.removeRecoverer(userAddress);
            break;
          default:
            throw new Error("Unknown role type");
        }
        await tx.wait();
        console.log(
          `${tokenName} ${roleType} role removed from address: ${userAddress}`
        );
        showToast(
          "성공",
          `${tokenName}의 ${roleType} 권한이 ${userAddress}으로부터 회수되었습니다.`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error executing contract action:", error);
      const errorMessage =
        action === "Give"
          ? `${roleType} 권한 부여 중 오류가 발생했습니다.`
          : `${roleType} 권한 회수 중 오류가 발생했습니다.`;
      showToast("실패", errorMessage, "error");
    } finally {
      onClose();
    }
  }


  const handleAddRole = () => {
    handleRoleAction("Give", selectedRoleType, selectedTokenName, userAddress);
  };

  const handleRemoveRole = () => {
    handleRoleAction(
      "Remove",
      selectedRoleType,
      selectedTokenName,
      userAddress
    );
  };

  const handleRevokeRole = async (roleType: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(
        "https://arb1.arbitrum.io/rpc"
      );
      const wallet = new ethers.Wallet(
        import.meta.env.VITE_ARBITRUM_PRIVATE_KEY!,
        provider
      );
      const contractAddress = c_addr;
      const contract = new ethers.Contract(
        contractAddress,
        erc20PermissionsControlData.abi,
        wallet
      );

      let tx;
      switch (roleType) {
        case "발행권한":
          tx = await contract.revokeMinter();
          break;
        case "소각권한":
          tx = await contract.revokeBurner();
          break;
        case "동결권한":
          tx = await contract.revokeFreezer();
          break;
        case "블랙리스트권한":
          tx = await contract.revokeBlacklistManager();
          break;
        case "복구권한":
          tx = await contract.revokeRecoverer();
          break;
        default:
          throw new Error("Unknown role type");
      }

      await tx.wait();
      console.log(`${roleType} role revoked.`);
      showToast("성공", `${roleType} 권한이 제거되었습니다.`, "success");
    } catch (error) {
      console.error(`Error revoking ${roleType} role:`, error);
      showToast(
        "실패",
        `${roleType} 권한 제거 중 오류가 발생했습니다.`,
        "error"
      );
    } finally {
      onRevokeModalClose();
    }
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
            권한 관리
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
                  권한 변경
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
                    {[
                      "발행권한",
                      "소각권한",
                      "동결권한",
                      "블랙리스트권한",
                      "복구권한",
                    ].map((roleType) => (
                      <Menu key={roleType}>
                        <MenuButton
                          as={Button}
                          size="sm"
                          colorScheme="teal"
                          variant="solid"
                          rightIcon={<TbCaretDownFilled />}
                          mr={2}
                          isDisabled={
                            !isPermissionGranted(data.permissions, roleType)
                          }
                          _hover={{ bg: "teal.600" }}
                        >
                          {roleType}
                        </MenuButton>
                        <MenuList bgColor={"gray.700"} color="white">
                          <MenuItem
                            bgColor={"gray.700"}
                            _hover={{ bg: "teal.600" }}
                            onClick={() => {
                              setSelectedTokenName(data.tokenName);
                              setSelectedRoleType(roleType);
                              onOpen();
                            }}
                          >
                            {roleType} 권한 관리하기
                          </MenuItem>
                          <MenuItem
                            bgColor={"gray.700"}
                            _hover={{ bg: "teal.600" }}
                            onClick={() => {
                              setSelectedTokenName(data.tokenName);
                              setSelectedRoleType(roleType);
                              onRevokeModalOpen();
                            }}
                          >
                            권한 및 기능 없애기
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* 권한 관리 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTokenName} {selectedRoleType} 권한 관리
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="지갑 주소를 입력하세요"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddRole}>
              권한 부여
            </Button>
            <Button colorScheme="red" mr={3} onClick={handleRemoveRole}>
              권한 회수
            </Button>
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 권한 및 기능 없애기 모달 */}
      <Modal isOpen={isRevokeModalOpen} onClose={onRevokeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>권한 및 기능 없애기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              주의! {selectedRoleType} 권한을 없애면 복구할 수 없습니다.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRevokeRole(selectedRoleType)}
            >
              권한 없애기
            </Button>
            <Button variant="ghost" onClick={onRevokeModalClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Permissions;
