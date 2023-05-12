import { IWalletPlugin } from "@scom/scom-wallet-modal";
import { ITokenObject } from "./common";

export interface IContractInfo {
  factoryAddress: string;
  routerAddress: string;
  tradeFee: {
    fee: string;
    base: string;
  },
  fromToken?: string;
  toToken?: string;
}

export interface IProvider {
  caption: string;
  image: string;
  key: string;
  dexId?: number;
}

export interface IProviderUI {
  caption: string;
  image: string;
  key: string;
  dexId?: number;
  // Contract Info
  chainId: string | number;
  factoryAddress: string;
  routerAddress: string;
  fromToken?: string;
  toToken?: string;
  tradeFee: {
    fee: string;
    base: string;
  }
}

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}

export interface INetworkConfig {
  chainName?: string;
  chainId: number;
}

export type ModeType = 'add-liquidity' | 'remove-liquidity';

export interface IPoolConfig {
  providers: IProviderUI[];
  tokens?: ITokenObject[];
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: INetworkConfig[];
  showHeader?: boolean;
  mode: ModeType;
}
