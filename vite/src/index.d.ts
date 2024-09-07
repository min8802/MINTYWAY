interface Window {
  ethereum: any;
}

interface INewToken {
  name: string;
  symbol: string;
  image: string | ArrayBuffer | null | undefined;
  initialSupply: number;
  totalSupply: number;
  tokenOwner: string | undefined;
}

interface IToken {
  tokenAddress: string;
  token: INewToken;
}

interface IPermissions {
  mint: boolean;
  freeze: boolean;
  owner: boolean;
}

// interface IToken {
//   tokenName: string;
//   contractAddress: string;
//   permissions: IPermissions;
//   imageUrl: string;
//   link: string;
// }

interface ITemplate {
  image: string;
  template: string;
  price: string;
  properties: {
    key: string;
    description: string;
  };
}

interface IMyToken {
  balance: number;
  decimals: number;
  logo: string;
  name: string;
  percentage_relative_to_total_supply: number;
  possible_spam: boolean;
  symbol: string;
  thumbnail: string;
  token_address: string;
  total_supply: number;
  total_supply_formatted: string;
  verified_contract: boolean;
}

interface IProjectInfo {
  network: string;
  totalSupply: number;
}

interface ILaunchpadInfo {
  pricePerToken: number;
  tokenPool: number;
  pricePerTicket: number;
  winningTickets: number;
  totalRaisedAmount: number;
  participants: number;
}

interface ILaunchpad {
  tokenAddress: string;
  name: string;
  symbol: string;
  description: string;
  image: string | ArrayBuffer | null | undefined;
  subscriptionStartTime: number;
  subscriptionEndTime: number;
  ticketStartTime: number;
  ticketEndTime: number;
  lotteryStartTime: number;
  lotteryEndTime: number;
  redemptionTime: number;
  projectInfo: IProjectInfo;
  launchpadInfo: ILaunchpadInfo;
}

interface IDatePicker {
  label: string;
  selectedDate: number;
  onChange: (number) => void;
  pickerOpen: boolean;
  onClickPicker: () => void;
  onClosePicker: () => void;
  minDate: Date;
  minTime: Date;
}

interface ILotteryWinner {
  buyer: string;
  wins: number;
}

interface ILotteryNonWinner {
  buyer: string;
  nonWins: number;
}

interface ITokenHolder {
  balance: number;
  balance_formatted: number;
  is_contract: boolean;
  owner_address: string;
  owner_address_label: null;
  usd_value: null;
  percentage_relative_to_total_supply: number;
}
