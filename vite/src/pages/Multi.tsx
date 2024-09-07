import { Box, Button, Divider, Flex, Select, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import MultiInputSet from "../components/MultiInputSet";
import MultiTextarea from "../components/MultiTextarea";
import MultiUploadTooltip from "../components/MultiUploadTooltip";
import { TbSend } from "react-icons/tb";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import { Contract } from "ethers";
import multiContractAbi from "../lib/multiContractAbi.json";

const Multi: FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Textarea를 참조할 ref
  const [excelValue, setExcelValue] = useState<any>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isTextareaDisable, setIsTextareaDisable] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<number>(0); // 키값을 관리할 상태 : 동일한 excel파일 선택했을때 브라우저가 변경으로 인식하지 않아서 onChange이벤트 발생 X
  //react key속성을 사용해서 <input type="file">로 input요소를 강제로 다시 렌더링 하면 동일 파일 선택했을 때도 onChange이벤트 발생
  const [addrAmountInputPage, setAddrAmountInputPage] = useState<number>(0);
  // const theme = useTheme();
  const [inputNumber, setInputNumber] = useState<number>(1);
  const [isWriting, setIsWriting] = useState<boolean>(true);
  const { signer } = useOutletContext<OutletContext>();
  const [multiContract, setMultiContract] = useState<Contract | null>(null);

  const inputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const switchToArbitrum = async () => {
    try {
      const arbitrumChainId = "0xa4b1"; // Arbitrum One Chain ID (42161 in decimal)
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: arbitrumChainId }],
      });
    } catch (error) {
      console.error("네트워크를 변경하지 못했습니다:", error);
    }
  };

  const checkFormat = async () => {
    var input = inputValue.trim().replace(/\r\n|\r|\n/g, "\n"); // 모든 줄바꿈 문자를 통일된 '\n'으로 변경
    input = input.replace(/,\s+/g, ","); // ,뒤에 \s는 공백 문자를 의미. +는 앞의 패턴이 1회 이상 반복됨을 의미 -> 공백 있으면 그냥 ,로 replace

    const lines = input.split("\n");
    const lineFormat = /^0x[a-fA-F0-9]{40},\d+(\.\d+)?$/i; // 각 줄을 검사할 정규식

    var isValid = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!lineFormat.test(line)) {
        isValid = false;
        alert(
          `전송 불가능: ${i + 1}번째 줄에 문제가 있습니다. \n내용: "${line}"`
        );
      }
    }

    const addresses = [];
    const amounts = [];
    let totalValue: number = 0;

    for (let i = 0; i < lines.length; i++) {
      const [address, amount] = lines[i].split(",");
      addresses.push(address);
      if (parseFloat(amount) === 0) return;
      amounts.push(parseFloat(amount) * 10 ** 18);
      totalValue += parseFloat(amount) * 10 ** 18;
    }

    console.log(addresses);
    console.log(amounts);

    await switchToArbitrum();

    if (!multiContract) return;
    await multiContract.multisender(addresses, amounts, {
      value: totalValue + lines.length * 10 ** 14,
    });

    if (!isValid) {
      setIsError(true);
      alert("전송 불가능");
    } else {
      setIsError(false);
      alert("전송 가능");
    }
  };

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader(); // 브라우저 내에서 파일을 읽을 수 있도록 해주는 객체 웹API 일부
    //fileReader는 readAsArrayBuffer, readAsText, readAsDataURL 메서드에 따라 result형식 달라짐
    try {
      if (!e.currentTarget.files) return;
      const formData = new FormData();
      formData.append("file", e.currentTarget.files[0]); //formData객체에서 특정이름으로 필드값을 가져올때 const uploadedFile = formData.get("file"); 이럴때 저 append한 이름을 사용함
      console.log(formData);
      console.log(Array.from(formData.entries())); //파일명은 이걸로 확인하기

      const file = e.currentTarget.files[0];
      console.log(file);
      const fileType = file.type;
      const validExcelTypes = [
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "text/csv", // csv
        "text/plain", //txt
      ];

      if (!validExcelTypes.includes(fileType)) {
        alert("엑셀 파일이 아닙니다");
        return;
      }
      reader.readAsArrayBuffer(file); //fileReader의 onload 이벤트 트리거
    } catch (error) {
      console.error(error);
    }

    //onload는 파일 읽기가 완료되었을 때 호출할 코드 정의
    reader.onload = (event) => {
      //event.target이 null이 아닌지, event.target.result가 undefined가 아닌지

      if (event.target?.result) {
        const arrayBuffer = event.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetNames = workbook.SheetNames; //시트 전체 이름 호출
        const sheetName = sheetNames[0]; //첫번째 시트 이름
        const sheet = workbook.Sheets[sheetName]; //시트들 중에 첫번째 시트 선택

        //참조할 값이 있는지 확인, 참조할 값 없다면 빈 엑셀임
        if (sheet["!ref"]) {
          const sheetRange = XLSX.utils.decode_range(sheet["!ref"]);
          //sheetRange.start.row
          let excelData = "";
          for (let row = sheetRange.s.r; row <= sheetRange.e.r; row++) {
            const cellA = sheet[XLSX.utils.encode_cell({ r: row, c: 0 })];
            const cellB = sheet[XLSX.utils.encode_cell({ r: row, c: 1 })];

            console.log(cellA);
            console.log(cellB);
            console.log(sheetRange);

            if (cellA && cellB) {
              const concatAddressAmount = `${cellA.w},${Number(cellB.v)}`;
              excelData += concatAddressAmount + "\n"; // 주소, 수량 엔터 역할 줄바꿈
            } else {
              alert(
                `엑셀의 ${row + 1}행에 있는 지갑 주소 ${
                  cellA.v
                } 혹은 보내는 수량을 확인해 주세요.`
              );
            }
            setExcelValue(excelData.trim());
            setInputValue(excelData.trim());
            if (textareaRef.current) {
              textareaRef.current.value = excelData.trim(); // Textarea에 값 설정
              setIsTextareaDisable(true);
            }
          }
        } else {
          alert("빈엑셀 입니다"); //출력확인
        }
        setInputKey(inputKey + 1);
      }
    };
  };

  useEffect(() => {
    console.log(inputValue);
  }, [inputValue]);
  useEffect(() => {
    if (isError) {
      setExcelValue("");
      setIsTextareaDisable(false);
    }
  }, [isError]);

  useEffect(() => {
    setMultiContract(
      new Contract(
        "0x93F6eA6D0F0Fd05963C131db47257BA61FBF436b",
        multiContractAbi,
        signer
      )
    );
  }, [signer]);

  useEffect(() => {
    console.log(multiContract);
  }, [multiContract]);

  return (
    <Flex
      flexDir="column"
      w="100%"
      minH="85vh"
      alignItems="center"
      bgColor="gray.800"
      p={4}
    >
      <Flex
        flexDir="column"
        borderWidth="3px"
        borderColor="teal"
        minW="4xl"
        minH="xs"
        mt={12}
        mx="auto"
        p="5"
        borderRadius="lg"
        boxShadow="lg"
        bgColor="boxColor"
      >
        <Text fontSize="2xl" fontWeight="bold" pb="6" color="white">
          토큰 다중 전송
        </Text>
        <Divider mb={4} borderColor="gray.600" />
        <Flex>
          <Flex flexDir="column" width="100%">
            <Box fontWeight="bold" fontSize="xl" color="white">
              토큰 선택
            </Box>
            <Select
              mt="4"
              variant="ghost"
              borderColor="brand.500"
              borderWidth="2px"
              cursor="pointer"
            >
              <option value="option1">Ethereum</option>
            </Select>
          </Flex>
        </Flex>
        <Flex flexDir="column" pt="4">
          <Flex alignItems="center" justifyContent="space-between">
            <Text mb="4" fontWeight="bold" fontSize="xl" color="white">
              주소 수량 입력
            </Text>
          </Flex>
          <Flex justifyContent="space-between" mb="4">
            <Button
              w="49%"
              onClick={() => {
                setAddrAmountInputPage(0);
                setInputValue("");
                setInputNumber(1);
                setIsWriting(true);
              }}
            >
              주소 수량 입력 1
            </Button>
            <Button
              w="49%"
              onClick={() => {
                setAddrAmountInputPage(1);
                setInputValue("");
              }}
            >
              주소 수량 입력 2
            </Button>
          </Flex>
          {addrAmountInputPage == 0 ? (
            <MultiTextarea
              textareaRef={textareaRef}
              isTextareaDisable={isTextareaDisable}
              inputChange={inputChange}
            />
          ) : (
            <>
              <MultiInputSet
                inputNumber={inputNumber}
                setInputNumber={setInputNumber}
                checkFormat={checkFormat}
                inputValue={inputValue}
                setInputValue={setInputValue}
                setIsWriting={setIsWriting}
              />
            </>
          )}
          {addrAmountInputPage == 0 ? (
            <>
              <MultiUploadTooltip
                inputKey={inputKey}
                onChangeFile={onChangeFile}
                excelValue={excelValue}
                setIsTextareaDisable={setIsTextareaDisable}
                setExcelValue={setExcelValue}
              />
              <Button
                onClick={checkFormat}
                borderColor="teal.500"
                borderWidth="2px"
                mt="5"
                bgColor="teal"
                _hover={{ bgColor: "teal.400" }}
                color="white"
              >
                <TbSend size="20" />
                <Text ml="1" _hover="teal.400">
                  전송하기
                </Text>
              </Button>
            </>
          ) : (
            <>
              {isWriting ? (
                <></>
              ) : (
                <Button
                  onClick={checkFormat}
                  borderColor="teal.500"
                  borderWidth="2px"
                  mt="5"
                  bgColor="teal"
                  _hover={{ bgColor: "teal.400" }}
                  color="white"
                >
                  <TbSend size="20" />
                  <Text ml="1" _hover="teal.400">
                    전송하기
                  </Text>
                </Button>
              )}
            </>
          )}
          <Text mt="4" color="white">
            계정당 전송 수수료 : 0.0001 ETH
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Multi;
