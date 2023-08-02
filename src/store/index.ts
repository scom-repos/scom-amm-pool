import { INetwork, Wallet } from '@ijstech/eth-wallet';
import {ICustomTokenObject } from '../global/index';
import { tokenStore, WETHByChainId, ITokenObject } from '@scom/scom-token-list';
import { application } from '@ijstech/components';

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const state = {
  rpcWalletId: ""
}

export const getWETH = (chainId: number): ITokenObject => {
  let wrappedToken = WETHByChainId[chainId];
  return wrappedToken;
};

export * from './utils';

export const getSupportedTokens = (tokens: ICustomTokenObject[], chainId: number) => {
  if (!tokens) return [];
  return tokens.filter(token => token.chainId === chainId).map(v => {
    const address = v.address?.toLowerCase().startsWith('0x') ? v.address.toLowerCase() : v.address;
    const tokenObj = tokenStore.tokenMap[address];
    return {
      ...v,
      ...tokenObj
    }
  })
}

export function getRpcWallet() {
  return Wallet.getRpcWalletInstance(state.rpcWalletId);
}

export function getClientWallet() {
  return Wallet.getClientInstance();
}

export function isRpcWalletConnected() {
  const wallet = getRpcWallet();
  return wallet?.isConnected;
}

export function initRpcWallet(defaultChainId: number) {
  if (state.rpcWalletId) {
    return state.rpcWalletId;
  }
  const clientWallet = Wallet.getClientInstance();
  const networkList: INetwork[] = Object.values(application.store.networkMap);
  const instanceId = clientWallet.initRpcWallet({
    networks: networkList,
    defaultChainId,
    infuraId: application.store.infuraId,
    multicalls: application.store.multicalls
  });
  state.rpcWalletId = instanceId;
  if (clientWallet.address) {
    const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
    rpcWallet.address = clientWallet.address;
  }
  return instanceId;
}

export function getChainId() {
  const rpcWallet = getRpcWallet();
  return rpcWallet?.chainId;
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}
