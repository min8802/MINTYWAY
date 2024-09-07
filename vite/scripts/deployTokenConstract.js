import { ethers } from "ethers";
import dotenv from "dotenv";
import MintyWay_MintProData from "../artifacts/contracts/Permissions/Permissions.sol/MintyWay_MintPro.json" assert { type: "json" };

dotenv.config();

async function deployMintyWay_MintPro() {
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
  const wallet = new ethers.Wallet(
    process.env.VITE_ARBITRUM_PRIVATE_KEY,
    provider
  );

  const erc20Abi = MintyWay_MintProData.abi;
  const erc20Bytecode = MintyWay_MintProData.bytecode;
  const contractFactory = new ethers.ContractFactory(
    erc20Abi,
    erc20Bytecode,
    wallet
  );

  // 컨트랙트 배포
  const contract = await contractFactory.deploy("TokenName", "TOKEN", 1000000);
}

deployMintyWay_MintPro().catch((error) => {
  console.error("Error deploying contract:", error);
});
