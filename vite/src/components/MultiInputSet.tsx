import { Button, Flex, Input } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";

interface MultiInputSetProps {
  inputNumber: number;
  setInputNumber: React.Dispatch<React.SetStateAction<number>>;
  checkFormat: () => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  setIsWriting: React.Dispatch<React.SetStateAction<boolean>>;
}

const MultiInputSet: FC<MultiInputSetProps> = ({
  setInputValue,
  setIsWriting,
}) => {
  const [walletAddr, setWalletAddr] = useState<string[]>([""]);
  const [amount, setAmount] = useState<string[]>([""]);
  const [newAddr, setNewAddr] = useState<string[]>([""]);

  const addInputSet = () => {
    setInputValue(
      (prev) =>
        prev +
        `${walletAddr[walletAddr.length - 1]}, ${amount[amount.length - 1]}\n`
    );
    setNewAddr((prev) => [
      ...prev.slice(0, -1),
      `${walletAddr[walletAddr.length - 1]}, ${amount[amount.length - 1]}`,
      "",
    ]);
    setWalletAddr([...walletAddr, ""]); // 새로운 빈 입력을 받을 준비
    setAmount([...amount, ""]); // 새로운 빈 입력을 받을 준비
    setIsWriting(false);
  };

  const subInputSet = (index: number) => {
    setNewAddr((prev) => prev.filter((_, i) => i !== index)); // 해당 인덱스를 제외하고 필터링
    setWalletAddr((prev) => prev.filter((_, i) => i !== index)); // walletAddr 배열에서 해당 인덱스 제거
    setAmount((prev) => prev.filter((_, i) => i !== index)); // amount 배열에서 해당 인덱스 제거

    setInputValue((prev) => {
      const lines = prev.split("\n");
      lines.splice(index, 1); // inputValue에서 해당 라인을 제거
      return lines.join("\n");
    });
  };

  const inputChangeWallet = (e: any, index: number) => {
    const value = e.target.value;
    setWalletAddr((prev) => {
      const updated = [...prev];
      updated[index] = value; // walletAddr 배열의 해당 인덱스 업데이트
      return updated;
    });
    setIsWriting(true);
  };

  const inputChangeAmount = (e: any, index: number) => {
    const value = e.target.value;
    setAmount((prev) => {
      const updated = [...prev];
      updated[index] = value; // amount 배열의 해당 인덱스 업데이트
      return updated;
    });
    setIsWriting(true);
  };

  useEffect(() => {
    console.log(newAddr); // newAddr 상태 변경 확인용
  }, [newAddr]);

  return (
    <Flex color="white" justifyContent="space-between" flexDir="column">
      {newAddr.map((_, i) => (
        <Flex gap={4} mt={4} key={i}>
          {newAddr.length - 1 === i ? (
            <>
              <Input
                w="80%"
                placeholder="지갑주소"
                onChange={(e) => inputChangeWallet(e, i)}
                value={walletAddr[i]}
                _focus={{
                  outline: "none",
                  boxShadow: "none",
                  borderColor: "teal",
                }}
              />
              <Input
                w="15%"
                placeholder="수량"
                onChange={(e) => inputChangeAmount(e, i)}
                value={amount[i]}
                _focus={{
                  outline: "none",
                  boxShadow: "none",
                  borderColor: "teal",
                }}
              />
              <Button w={4} onClick={addInputSet}>
                +
              </Button>
            </>
          ) : (
            <>
              <Input
                w="80%"
                placeholder="지갑주소"
                onChange={(e) => inputChangeWallet(e, i)}
                value={walletAddr[i]}
                disabled={true}
              />
              <Input
                w="15%"
                placeholder="수량"
                onChange={(e) => inputChangeAmount(e, i)}
                value={amount[i]}
                disabled={true}
              />
              <Button w={4} onClick={() => subInputSet(i)}>
                -
              </Button>
            </>
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default MultiInputSet;
