import { application } from '@ijstech/components';
import { Wallet } from '@ijstech/eth-wallet';
import { EventId, IProvider, ITokenObject, IExtendedNetwork } from '../global/index';
import { ChainNativeTokenByChainId } from '@scom/scom-token-list';
import getNetworkList from '@scom/scom-network-list'
import { IDexInfo } from '@scom/scom-dex-list';

export enum WalletPlugin {
  MetaMask = 'metamask',
  WalletConnect = 'walletconnect',
}

const TOKENS = "oswap_user_tokens_";

export type ProxyAddresses = { [key: number]: string };

export const state = {
  currentChainId: 0,
  isExpertMode: false,
  slippageTolerance: 0.5,
  transactionDeadline: 30,
  userTokens: {} as { [key: string]: ITokenObject[] },
  infuraId: "",
  networkMap: {} as { [key: number]: IExtendedNetwork },
  dexInfoList: [] as IDexInfo[],
  providerList: [] as IProvider[],
  proxyAddresses: {} as ProxyAddresses,
  ipfsGatewayUrl: "",
  apiGatewayUrls: {} as Record<string, string>,
  embedderCommissionFee: "0",
  tokens: []
}

export const setDataFromConfig = (options: any) => {
  if (options.infuraId) {
    setInfuraId(options.infuraId)
  }
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId)
  }
  if (options.proxyAddresses) {
    setProxyAddresses(options.proxyAddresses)
  }
  if (options.ipfsGatewayUrl) {
    setIPFSGatewayUrl(options.ipfsGatewayUrl);
  }
  if (options.apiGatewayUrls) {
    setAPIGatewayUrls(options.apiGatewayUrls);
  }
  if (options.embedderCommissionFee) {
    setEmbedderCommissionFee(options.embedderCommissionFee);
  }
}

export const setProxyAddresses = (data: ProxyAddresses) => {
  state.proxyAddresses = data;
}

export const getProxyAddress = (chainId?: number) => {
  const _chainId = chainId || Wallet.getInstance().chainId;
  const proxyAddresses = state.proxyAddresses;
  if (proxyAddresses) {
    return proxyAddresses[_chainId];
  }
  return null;
}

export const setIPFSGatewayUrl = (url: string) => {
  state.ipfsGatewayUrl = url;
}

export const getIPFSGatewayUrl = () => {
  return state.ipfsGatewayUrl;
}

export const setAPIGatewayUrls = (urls: Record<string, string>) => {
  state.apiGatewayUrls = urls;
}

const setEmbedderCommissionFee = (fee: string) => {
  state.embedderCommissionFee = fee;
}

export const getEmbedderCommissionFee = () => {
  return state.embedderCommissionFee;
}

export const setCurrentChainId = (value: number) => {
  state.currentChainId = value;
}

export const getCurrentChainId = (): number => {
  return state.currentChainId;
}

export const isExpertMode = (): boolean => {
  return state.isExpertMode;
}

export function toggleExpertMode() {
  state.isExpertMode = !state.isExpertMode
}

export const getSlippageTolerance = (): any => {
  return state.slippageTolerance
};

export const setSlippageTolerance = (value: any) => {
  state.slippageTolerance = value
}

export const getTransactionDeadline = (): any => {
  return state.transactionDeadline;
}

export const setTransactionDeadline = (value: any) => {
  state.transactionDeadline = value
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

const setNetworkList = (networkList: IExtendedNetwork[], infuraId?: string) => {
  const wallet = Wallet.getClientInstance();
  state.networkMap = {};
  const defaultNetworkList = getNetworkList();
  const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
    acc[cur.chainId] = cur;
    return acc;
  }, {});
  for (let network of networkList) {
    const networkInfo = defaultNetworkMap[network.chainId];
    if (!networkInfo) continue;
    if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
      for (let i = 0; i < network.rpcUrls.length; i++) {
        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
      }
    }
    state.networkMap[network.chainId] = {
      ...networkInfo,
      ...network
    };
    wallet.setNetworkInfo(state.networkMap[network.chainId]);
  }
}

export const getSupportedNetworks = () => {
  return Object.values(state.networkMap);
}

export const getNetworkInfo = (chainId: number) => {
  return state.networkMap[chainId];
}

export const getUserTokens: (chainId: number) => any[] | null = (chainId: number) => {
  let tokens = localStorage[TOKENS + chainId];
  if (tokens) {
    tokens = JSON.parse(tokens);
  } else {
    tokens = [];
  }
  const userTokens = state.userTokens[chainId];
  if (userTokens && userTokens.length) {
    tokens = tokens.concat(userTokens);
  }
  return tokens.length ? tokens : null;
}

export const addUserTokens = (token: ITokenObject) => {
  const chainId = getChainId();
  let tokens = localStorage[TOKENS + chainId];
  let i = -1;
  if (tokens) {
    tokens = JSON.parse(tokens);
    i = tokens.findIndex((item: ITokenObject) => item.address == token.address);
  } else {
    tokens = [];
  }
  if (i == -1) {
    tokens.push(token);
  }
  localStorage[TOKENS + chainId] = JSON.stringify(tokens);
}

interface NetworkConditions {
  isDisabled?: boolean,
  isTestnet?: boolean,
  isMainChain?: boolean
}

function matchFilter<O extends { [keys: string]: any }>(list: O[], filter: Partial<O>): O[] {
  let filters = Object.keys(filter);
  return list.filter(item => filters.every(f => {
    switch (typeof filter[f]) {
      case 'boolean':
        if (filter[f] === false) {
          return item[f] === undefined || item[f] === null;
        }
      // also case for filter[f] === true 
      case 'string':
      case 'number':
        return filter[f] === item[f];
      case 'object': // have not implemented yet
      default:
        console.log(`matchFilter do not support ${typeof filter[f]} yet!`)
        return false;
    }
  }));
}

export const getMatchNetworks = (conditions: NetworkConditions): IExtendedNetwork[] => {
  let networkFullList = Object.values(state.networkMap);
  let out = matchFilter(networkFullList, conditions);
  return out;
}

export const getNetworkExplorerName = (chainId: number) => {
  if (getNetworkInfo(chainId)) {
    return getNetworkInfo(chainId).explorerName;
  }
  return 'Unknown';
}

export const setUserTokens = (token: ITokenObject, chainId: number) => {
  if (!state.userTokens[chainId]) {
    state.userTokens[chainId] = [token];
  } else {
    state.userTokens[chainId].push(token);
  }
}

export const hasUserToken = (address: string, chainId: number) => {
  return state.userTokens[chainId]?.some((token: ITokenObject) => token.address?.toLocaleLowerCase() === address?.toLocaleLowerCase());
}

export const setDexInfoList = (value: IDexInfo[]) => {
  state.dexInfoList = value;
}

export const getDexInfoList = () => {
  return state.dexInfoList || [];
}

export const setProviderList = (value: IProvider[]) => {
  state.providerList = value;
}

export const getProviderList = () => {
  return state.providerList || [];
}

export const getProviderByKey = (providerKey: string) => {
  const providers = state.providerList || [];
  return providers.find(item => item.key === providerKey) || null;
}

export const viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerTxUrl) {
    let url = `${network.explorerTxUrl}${txHash}`;
    window.open(url);
  }
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerAddressUrl) {
    let url = `${network.explorerAddressUrl}${address}`;
    window.open(url);
  }
}

// wallet
export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
}

export function isWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export async function switchNetwork(chainId: number) {
  const wallet = Wallet.getClientInstance();
  if (!isWalletConnected()) {
    setCurrentChainId(chainId);
    wallet.chainId = chainId;
    application.EventBus.dispatch(EventId.chainChanged, chainId);
    return;
  }
  if (wallet?.clientSideProvider?.name === WalletPlugin.MetaMask) {
    await wallet.switchNetwork(chainId);
  }
}

export const hasMetaMask = function () {
  const wallet = Wallet.getClientInstance();
  return wallet?.clientSideProvider?.name === WalletPlugin.MetaMask;
}

export const truncateAddress = (address: string) => {
  if (address === undefined || address === null) return '';
  return address.substr(0, 6) + '...' + address.substr(-4);
}

export function getChainId() {
  return Wallet.getInstance().chainId;
}

export const getChainNativeToken = (chainId: number): ITokenObject => {
  return ChainNativeTokenByChainId[chainId];
};
