import Moralis from "moralis";

export async function startMoralis() {
  try {
    await Moralis.start({
      apiKey: import.meta.env.VITE_MORALIS_API_KEY,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getWalletTokens(address: string): Promise<IMyToken[]> {
  try {
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: "0xa4b1",
      address: address,
    });

    const tokens = response.raw as unknown as IMyToken[];

    tokens.forEach((token) => {
      const balance = token.balance;
      const decimal = token.decimals;
      const balanceEth = parseFloat(balance.toString()) / Math.pow(10, decimal);
      const formattedBalance = balanceEth.toFixed(2);
      token.balance = Number(formattedBalance);
    });

    console.log("raw", response.raw);
    return tokens as IMyToken[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTokenHolders(
  address: string
): Promise<ITokenHolder[]> {
  try {
    const response = await Moralis.EvmApi.token.getTokenOwners({
      chain: "0xa4b1",
      order: "DESC",
      tokenAddress: address,
    });

    console.log("response : ", response.raw().result);

    return response.raw().result as unknown as ITokenHolder[];
  } catch (error) {
    console.error(error);
    return [];
  }
}
