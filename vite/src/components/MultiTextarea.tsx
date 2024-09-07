import { Textarea } from "@chakra-ui/react";
import { FC } from "react";

interface MultiTextareaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isTextareaDisable: boolean;
  inputChange: any;
}

const MultiTextarea: FC<MultiTextareaProps> = ({
  textareaRef,
  isTextareaDisable,
  inputChange,
}) => {
  return (
    <Textarea
      ref={textareaRef} // Textarea에 ref 할당
      disabled={isTextareaDisable}
      color="white"
      bgColor="gray.600"
      fontSize="xl"
      h="sm"
      resize="none"
      _focus={{ borderColor: "teal", boxShadow: "none", outline: "none" }}
      onChange={inputChange}
      borderColor="white"
      borderWidth="2px"
      placeholder="주소 , 보내는 수량
예시)
0xf94Ab9d4bF12fd32D2Ee9d43134f26eB25e2C4D4,100
0x3da2fF368D0131798F76E760e20B44Ec82B2Bae6,100"
    />
  );
};

export default MultiTextarea;
