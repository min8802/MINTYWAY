import { ethers } from "ethers";
import process from "process";
import dotenv from "dotenv";
import presaleManagerData from "../artifacts/contracts/presale/PresaleManager.sol/PresaleManager.json" assert { type: "json" };
// import presaleData from "../artifacts/contracts/presale/Presale.sol/Presale.json" assert { type: "json" };
dotenv.config();

async function deployPresaleManager() {
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
  const wallet = new ethers.Wallet(
    process.env.VITE_ARBITRUM_PRIVATE_KEY,
    provider
  );

  const blockNumber = await provider.getBlockNumber();
  console.log("Current block number:", blockNumber);

  const presaleManagerAbi = presaleManagerData.abi;
  const presaleManagerBytecode = presaleManagerData.bytecode;
  const contractFactory = new ethers.ContractFactory(
    presaleManagerAbi,
    presaleManagerBytecode,
    wallet
  );

  console.log("Deploying PresaleManager...");
  //   const contract = await contractFactory.deploy();
  //   await contract.deployed();
  //   console.log("PresaleManager deployed to address:", contract.address);
  //   return contract.address;
}

// async function createPresaleContract(presaleData, owner) {
//   const presaleManagerAddress = deployPresaleManager(
//     "0x3Af9E6986077D98d5cC492046460F8FCc629DF31"
//   );

//   const presaleAbi = presaleData.abi;
//   const presaleBytecode = presaleData.bytecode;
//   const contractFactory = new ethers.ContractFactory(
//     presaleAbi,
//     presaleBytecode,
//     owner.address
//   );

//   console.log("Deploying Presale...");
//   const contract = await contractFactory.deploy(presaleData.tokenAddress);
//   await contract.deployed();
//   console.log("Presale deployed to address: ", contract.address);
//   return;
// }

deployPresaleManager();
