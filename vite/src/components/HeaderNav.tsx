import {
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FC } from "react";

interface HeaderNavProps {
  text: string;
  menuItem: string[] | undefined;
}

const HeaderNav: FC<HeaderNavProps> = ({ text, menuItem }) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bgColor="teal"
        variant="filled"
        w="170px"
        _hover={{ bgColor: "teal.400" }}
      >
        <Text className="styled-text" color="white" fontWeight="bold">
          {text}
        </Text>
      </MenuButton>
      <MenuList minWidth="150px" bgColor="gray.700">
        {menuItem?.map((v, i) => (
          <MenuItem key={i} bgColor="gray.700">
            <Text className="styled-text" color="white" fontWeight="bold">
              {v}
            </Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default HeaderNav;
