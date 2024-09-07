import { ethers } from "ethers";
import memeData from "../../artifacts/contracts/permissions/memePlan.sol/MintyWay_MintMeme.json";
import proData from "../../artifacts/contracts/permissions/proPlan.sol/MintyWay_MintPro.json";

function getData(templateIndex: number) {
  if (templateIndex == 0) {
    return memeData;
  } else {
    return proData;
  }
}

export async function getCreateTokenContract(
  newToken: INewToken,
  templateIndex: number
) {
  if (!window.ethereum) {
    console.error("Please install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const data = getData(templateIndex);
  const dataAbi = data.abi;
  const dataBytecode = data.bytecode;
  const contractFactory = new ethers.ContractFactory(
    dataAbi,
    dataBytecode,
    signer
  );

  try {
    const initialSupplyEther = ethers.parseUnits(
      newToken.initialSupply.toString(),
      "ether"
    );

    const proTokenContract = await contractFactory.deploy(
      newToken.name,
      newToken.symbol,
      initialSupplyEther
    );
    await proTokenContract.waitForDeployment();
    return proTokenContract.target.toString();
  } catch (error) {
    console.error(error);
  }
}
