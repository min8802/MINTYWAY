import { ethers } from "ethers";
import launchpadData from "../../artifacts/contracts/launchpad/Launchpad.sol/Launchpad.json" assert { type: "json" };
import {
  getWallet,
  getLaunchpadManagerContract,
} from "../scripts/launchpadManagerContract";
import erc20Abi from "../lib/erc20Abi.json";

async function getSigner() {
  if (!window.ethereum) {
    console.error("Please install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
}

async function getLaunchpadContract(tokenAddress: string) {
  const launchpadManagerContract = await getLaunchpadManagerContract();
  const launchpadAddress = await launchpadManagerContract.getLaunchpad(
    tokenAddress
  );

  const wallet = await getWallet();
  const launchpadContract = new ethers.Contract(
    launchpadAddress,
    launchpadData.abi,
    wallet
  );

  return launchpadContract;
}

export async function deployLaunchpadContract(
  launchpad: ILaunchpad,
  amount: number
) {
  const wallet = await getWallet();

  const tokenAddress = launchpad.tokenAddress;
  const launchpadAbi = launchpadData.abi;
  const launchpadBytecode = launchpadData.bytecode;
  const contractFactory = new ethers.ContractFactory(
    launchpadAbi,
    launchpadBytecode,
    wallet
  );

  const launchpadContract = await contractFactory.deploy(tokenAddress);
  await launchpadContract.waitForDeployment();

  try {
    console.log("launchpad address : ", launchpadContract.target.toString());
    await depositToken(
      tokenAddress,
      launchpadContract.target.toString(),
      amount
    );

    const launchpadManagerContract = await getLaunchpadManagerContract();
    const tx = await launchpadManagerContract.addLaunchpad(
      tokenAddress,
      launchpadContract.target
    );
    await tx.wait();

    return launchpadContract.target;
  } catch (error) {
    console.error(error);
  }
}

export async function depositToken(
  tokenAddress: string,
  spender: string,
  amount: number
) {
  try {
    const signer = await getSigner();

    if (!signer) return;

    console.log("signer address: ", signer.address);

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    const tx = await tokenContract.approve(
      spender,
      ethers.parseUnits(amount.toString(), 18)
    );
    await tx.wait();
    console.log("tx : ", tx);

    const decimals = await tokenContract.decimals();
    console.log("Decimals: ", decimals);

    const transferAmount = ethers.parseUnits(amount.toString(), decimals);
    console.log("Adjusted Amount: ", transferAmount.toString());

    const transferTx = await tokenContract.transfer(spender, transferAmount);
    await transferTx.wait();
    console.log("transferTx : ", transferTx);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function subscription(
  sender: string,
  tokenAddress: string,
  point: number
) {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const tx = await launchpadContract.subscription(sender, point);
    await tx.wait();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSubscriberCount(
  tokenAddress: string
): Promise<number> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const subscriber = await launchpadContract.getSubscribers();
    return Number(subscriber);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function isSubscribe(
  tokenAddress: string,
  sender: string
): Promise<boolean> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const isSubscribe = await launchpadContract.subscribers(sender);
    return isSubscribe;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function buyTicket(
  tokenAddress: string,
  sender: string,
  ticketPrice: number,
  ticketAmount: number
) {
  try {
    const signer = await getSigner();

    if (!signer) return;
    console.log("buyTicket signer : ", signer.address);

    const launchpadContract = await getLaunchpadContract(tokenAddress);

    const price = ethers.parseUnits(ticketPrice.toString(), "ether");
    const amount = BigInt(parseInt(ticketAmount.toString(), 10));
    const totalPriceInEther = (price * amount).toString();

    await launchpadContract.buyTicket(signer.address, price, ticketAmount, {
      value: totalPriceInEther,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTicketAmount(
  tokenAddress: string,
  sender: string
): Promise<number> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const ticketAmount = await launchpadContract.getTicketAmount(sender);
    return ticketAmount;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getBuyer(tokenAddress: string): Promise<string[]> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const buyer = await launchpadContract.getBuyer();
    const buyerAddresses: string[] = Array.from(buyer);
    return buyerAddresses;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const formatAddress = (address: string) => {
  try {
    return ethers.getAddress(address.toLowerCase());
  } catch (error) {
    console.error("Invalid address:", address, error);
    return null;
  }
};

function formatLotteryWinnerArray(winners: ILotteryWinner[]) {
  return winners
    .map((winner) => ({
      buyer: formatAddress(winner.buyer),
      wins: winner.wins,
    }))
    .filter((winner) => winner.buyer !== null);
}

function formatLotteryNonWinnerArray(nonWinners: ILotteryNonWinner[]) {
  return nonWinners
    .map((nonWinner) => ({
      buyer: formatAddress(nonWinner.buyer),
      nonWins: nonWinner.nonWins,
    }))
    .filter((nonWinner) => nonWinner.buyer !== null);
}

export async function setLotteryResult(
  tokenAddress: string,
  winners: ILotteryWinner[],
  nonWinners: ILotteryNonWinner[]
) {
  try {
    console.log("setLotteryResult");
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const formattedWinners = formatLotteryWinnerArray(winners);
    const formattedNonWinners = formatLotteryNonWinnerArray(nonWinners);

    const tx = await launchpadContract.setLotteryResult(
      formattedWinners,
      formattedNonWinners
    );
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
}

export async function getIsExcuted(tokenAddress: string): Promise<boolean> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    return await launchpadContract.getIsExcuted();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getIsWinner(
  tokenAddress: string,
  sender: string
): Promise<boolean> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    return await launchpadContract.isWinner(sender);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getIsNonWinner(
  tokenAddress: string,
  sender: string
): Promise<boolean> {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    return await launchpadContract.isNonWinner(sender);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function claim(tokenAddress: string) {
  try {
    const signer = await getSigner();

    if (!signer) return;

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    const decimals = await tokenContract.decimals();

    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const winnerTicket = await launchpadContract.winners(signer.address);
    const deciamal = BigInt(10) ** decimals;
    console.log("decimal", deciamal);
    console.log("winner", winnerTicket);
    console.log("* : ", BigInt(winnerTicket) * deciamal);

    const claimTx = await launchpadContract.launchpadClaimToken(
      signer.address,
      BigInt(winnerTicket) * deciamal,
      {
        gasLimit: 100000,
      }
    );

    await claimTx.wait();

    console.log("claimTx : ", claimTx);

    await launchpadContract.launchpadClaimToken(signer.address, {
      gasLimit: 55000,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function refund(
  tokenAddress: string,
  sender: string,
  ticketPrice: number
) {
  try {
    const launchpadContract = await getLaunchpadContract(tokenAddress);
    const price = ethers.parseUnits(ticketPrice.toString(), "ether");
    const amount = await launchpadContract.nonWinners(sender);
    const refundAmount = price * amount;

    console.log("refund sender : ", sender);

    await launchpadContract.launchpadRefundETH(
      sender,
      refundAmount.toString(),
      {
        gasLimit: 550000,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
