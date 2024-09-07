import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useRef } from "react";
import { Tooltip } from "@chakra-ui/react";
import multisenderExcel from "../../public/multiExcel.png";
import multisenderTxt from "../../public/multiTxt.png";
import { TbFileUpload } from "react-icons/tb";

interface MultiUploadTooltipProps {
    inputKey : number;
    onChangeFile : (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
    excelValue : any;
    setIsTextareaDisable : React.Dispatch<React.SetStateAction<boolean>>;
    setExcelValue : React.Dispatch<any>;
}

const MultiUploadTooltip : FC<MultiUploadTooltipProps> = ({inputKey, onChangeFile, excelValue, setIsTextareaDisable, setExcelValue}) => {
    const inputRef = useRef<HTMLInputElement>(null); // ref 생성

    const onClickInput = () => {
        if (inputRef.current) {
        inputRef.current.click(); // input의 click() 메서드를 호출
        }
    };

    return (
        <Flex mt="5">
            <input key={inputKey} id="file2" type="file" onChange={onChangeFile} style={{ display: "none"}} ref={inputRef}/>
            <Button onClick={() => onClickInput() } color="white" bgColor="teal" borderWidth="2px" borderColor="teal.500" alignItems="center" _hover={{ bgColor: "teal.400" }}><Text mr="1" color="white" >excel/csv/txt</Text><TbFileUpload size="25"/></Button>
            <Tooltip
                label={<Box><Image width="300px" h="100px" src={multisenderExcel}/><Text fontSize={21}>A 열 : 지갑주소, B 열 : 보내는 수량</Text></Box>} 
                width={600}
                placement="top"
                aria-label='A tooltip'>
                <Button ml="4" variant="ghost" borderColor="teal.500" borderWidth="2px" color="white" bgColor="teal" _hover={{ bgColor: "teal.400" }}>excel ?</Button>
            </Tooltip>
            <Tooltip
                label={<Box><Image width="300px" h="100px" src={multisenderTxt}/><Text fontSize={21}>지갑주소 , 보내는 수량</Text></Box>} 
                width={600}
                placement="top"
                aria-label='A tooltip'>
                <Button ml="4" variant="ghost" borderColor="teal.500" borderWidth="2px" color="white" bgColor="teal" _hover={{ bgColor: "teal.400" }}>txt ?</Button>
            </Tooltip>
            {excelValue? 
            <Button ml="4" w="16" onClick={() => {setIsTextareaDisable(false);setExcelValue("")}} variant="ghost" borderColor="teal.500" borderWidth="2px" color="white" bgColor="teal" _hover={{ bgColor: "teal.400" }}>수정</Button> :
            <></>
            }
        </Flex>
    )
}

export default MultiUploadTooltip;