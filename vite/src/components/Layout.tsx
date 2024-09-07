import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { JsonRpcSigner } from "ethers";
import Sidebar from "./Sidebar";

export interface OutletContext {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  launchpadList: ILaunchpad[];
  setLaunchpadList: Dispatch<SetStateAction<ILaunchpad[]>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  point: number;
  setPoint: Dispatch<SetStateAction<number>>;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [launchpadList, setLaunchpadList] = useState<ILaunchpad[]>([]);
  const [step, setStep] = useState<number>(0);
  const [point, setPoint] = useState<number>(200);

  return (
    <Flex minH="100vh" flexDir="column" bgColor="backgroundColor">
      <Sidebar />
      <Flex flexDir="column" flex={1} ml={{ base: 0, md: 240 }}>
        <Header signer={signer} setSigner={setSigner} point={point} />
        <Box flex={1} mt={16}>
          <Outlet
            context={{
              signer,
              launchpadList,
              setLaunchpadList,
              step,
              setStep,
              point,
              setPoint,
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
