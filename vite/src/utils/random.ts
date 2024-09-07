export const getRandomUniqueNumbers = (
  max: number,
  min: number,
  count: number
): Set<number> => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    numbers.add(randomNumber);
  }
  return numbers;
};

export function getLotteryResult(buyer: string[], winningTickets: number) {
  const winnerIndex = getRandomUniqueNumbers(buyer.length, 0, winningTickets);
  console.log(winnerIndex);
  const addressCounts = new Map<string, { total: number; wins: number }>();

  buyer.forEach((address) => {
    const count = addressCounts.get(address) || { total: 0, wins: 0 };
    count.total += 1;
    addressCounts.set(address, count);
  });

  buyer.forEach((address, index) => {
    if (winnerIndex.has(index)) {
      const count = addressCounts.get(address);
      if (count) {
        count.wins += 1;
        addressCounts.set(address, count);
      }
    }
  });

  const winners: { buyer: string; wins: number }[] = [];
  const nonWinners: { buyer: string; nonWins: number }[] = [];

  addressCounts.forEach((sender, key) => {
    winners.push({ buyer: key, wins: sender.wins });
    nonWinners.push({ buyer: key, nonWins: sender.total - sender.wins });
  });

  return { winners, nonWinners };
}
