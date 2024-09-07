import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const linkItems = [
    { name: "토큰 생성", path: "/createToken" },
    { name: "토큰 관리", path: "/permissions" },
    { name: "다중 전송", path: "/multi" },
    { name: "런치패드", path: "/launchpad" },
  ];

  return (
    <Box
      w="60"
      pos="fixed"
      h="full"
      bgColor="backgroundColor"
      color="white"
      p={4}
      borderRightColor="white"
      borderRight="2px"
      mt={16}
    >
      {linkItems.map((link) => (
        <Flex
          as={Link}
          to={link.path}
          p={4}
          mb={2}
          borderRadius="md"
          _hover={{ bg: "hoverColor" }}
          key={link.name}
          justify="center"
        >
          <Text fontWeight="bold" fontSize="20px" textAlign="center">
            {link.name}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default Sidebar;
