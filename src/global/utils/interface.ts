import { IWalletPlugin } from "@scom/scom-wallet-modal";

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
  key: string;
}

export interface IProviderUI {
  key: string;
  chainId: string | number;
}

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}

export interface IEmbedData {
  commissions?: ICommissionInfo[];
}

export interface INetworkConfig {
  chainName?: string;
  chainId: number;
}

export type ModeType = 'add' | 'remove' | 'both';

export interface ICustomTokenObject {
  address: string;
  symbol?: string;
  chainId: number;
}

export interface IPoolConfig {
  commissions?: ICommissionInfo[];
  providers: IProviderUI[];
  tokens?: ICustomTokenObject[];
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: INetworkConfig[];
  showHeader?: boolean;
  mode: ModeType;
}

export interface IPoolDetailConfig {
  commissions?: ICommissionInfo[];
  providers: IProviderUI[];
  tokens?: ICustomTokenObject[];
}