
export type ProjectName = keyof typeof PROJECT_CONVERSIONS;

export interface TokenHolding {
  projectName: string;
  totalTokens: number;
  piggyBankTokens: number;
}

export interface NFTHolding {
  projectName: string;
  totalNFTs: number;
  microNFTs: number;
}

export interface WalletData {
  address: string;
  tokens: TokenHolding[];
  nfts: NFTHolding[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  wallets: WalletData[];
}

export const PROJECT_CONVERSIONS = {
  DEBT: "CHRS",
  ALUM: "BAUX",
  BGLD: "OIL",
  DCM: "DATA",
  DLG: "GDLG",
  GROW: "FARM",
  NATG: "NGAS",
  XPLR: "EXPL",
} as const;
