import { SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FC } from "react";

interface SearchProps {
  width: string;
  placeholder: string;
}

const Search: FC<SearchProps> = ({ width, placeholder }) => {
  return (
    <InputGroup w={width}>
      <Input
        placeholder={placeholder}
        variant="filled"
        bgColor="gray.700"
        _hover={{ bgColor: "gray.600" }}
        _placeholder={{ color: "gray.400" }}
        _focus={{ bgColor: "gray.600", borderColor: "teal" }}
        color="white"
      />
      <InputRightElement>
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          variant="ghost"
          colorScheme="teal"
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default Search;
