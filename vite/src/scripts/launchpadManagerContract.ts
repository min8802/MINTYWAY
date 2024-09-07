import { ethers } from "ethers";
import launchpadManagerData from "../../artifacts/contracts/launchpad/LaunchpadManager.sol/LaunchpadManager.json" assert { type: "json" };
import { launchpadManagerContractAddress } from "../lib/launchpadManagerContractAddress";

export async function getWallet() {
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
  const wallet = new ethers.Wallet(
    import.meta.env.VITE_ARBITRUM_PRIVATE_KEY,
    provider
  );

  return wallet;
}

export async function getLaunchpadManagerContract() {
  const wallet = await getWallet();

  const launchpadManagerContract = new ethers.Contract(
    launchpadManagerContractAddress,
    launchpadManagerData.abi,
    wallet
  );

  return launchpadManagerContract;
}

export async function getLaunchpadList(): Promise<string[]> {
  try {
    const wallet = await getWallet();
    const launchpadManagerContract = new ethers.Contract(
      launchpadManagerContractAddress,
      launchpadManagerData.abi,
      wallet
    );
    const launchpadList: string[] =
      await launchpadManagerContract.getLaunchpadList();
    return launchpadList.map((address: string) => address.toString());
  } catch (error) {
    console.error(error);
    throw error;
  }
}
